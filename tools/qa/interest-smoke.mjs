// CDP-смоук TakeMyCar без зависимостей: запускает Chrome headless, меряет кадры,
// снимает статистику __tmc, скриншот и ошибки консоли.
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const url = process.argv[2];
const shot = process.argv[3] ?? null;
const waitModels = process.argv[4] !== '0';

const profile = mkdtempSync(join(tmpdir(), 'tmc-cdp-'));
const chrome = spawn(CHROME, [
  '--headless=new',
  '--remote-debugging-port=0',
  `--user-data-dir=${profile}`,
  '--window-size=1600,900',
  '--no-first-run',
  '--no-default-browser-check',
  '--hide-scrollbars',
  '--enable-unsafe-swiftshader',
  '--autoplay-policy=no-user-gesture-required',
  'about:blank',
], { stdio: ['ignore', 'ignore', 'pipe'] });

const wsEndpoint = await new Promise((resolve, reject) => {
  let buffer = '';
  const timer = setTimeout(() => reject(new Error('DevTools endpoint timeout')), 30000);
  chrome.stderr.on('data', (chunk) => {
    buffer += chunk.toString();
    const match = /ws:\/\/[^\s]+/.exec(buffer);
    if (match) {
      clearTimeout(timer);
      resolve(match[0]);
    }
  });
});

const ws = new WebSocket(wsEndpoint);
await new Promise((resolve) => ws.addEventListener('open', resolve, { once: true }));

let nextId = 1;
const pending = new Map();
const events = [];
ws.addEventListener('message', (message) => {
  const data = JSON.parse(message.data);
  if (data.id) {
    const entry = pending.get(data.id);
    if (!entry) return;
    pending.delete(data.id);
    if (data.error) entry.reject(new Error(data.error.message));
    else entry.resolve(data.result);
    return;
  }
  events.push(data);
});

function send(method, params = {}, sessionId) {
  const id = nextId++;
  ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

const { targetInfos } = await send('Target.getTargets');
const page = targetInfos.find((t) => t.type === 'page');
const { sessionId } = await send('Target.attachToTarget', { targetId: page.targetId, flatten: true });

const consoleErrors = [];
const exceptions = [];
const failedRequests = [];
ws.addEventListener('message', (message) => {
  const data = JSON.parse(message.data);
  if (data.method === 'Runtime.consoleAPICalled' && data.params.type === 'error') {
    consoleErrors.push(data.params.args.map((a) => a.value ?? a.description ?? '').join(' '));
  }
  if (data.method === 'Runtime.exceptionThrown') {
    exceptions.push(data.params.exceptionDetails.text + ' ' + (data.params.exceptionDetails.exception?.description ?? ''));
  }
  if (data.method === 'Network.loadingFailed') failedRequests.push(data.params.errorText);
});

await send('Page.enable', {}, sessionId);
await send('Runtime.enable', {}, sessionId);
await send('Network.enable', {}, sessionId);
await send('Page.addScriptToEvaluateOnNewDocument', {
  source: `
    window.__gaps = { max: 0, count: 0, longTasks: 0, log: [], marks: [] };
    window.__gapMark = (name) => window.__gaps.marks.push({ name, t: Math.round(performance.now()) });
    (() => {
      let last = performance.now();
      const tick = (now) => {
        const d = now - last;
        last = now;
        if (d > window.__gaps.max) window.__gaps.max = d;
        if (d > 40) window.__gaps.log.push({ t: Math.round(now), d: Math.round(d) });
        window.__gaps.count += 1;
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      new PerformanceObserver((list) => { window.__gaps.longTasks += list.getEntries().length; })
        .observe({ entryTypes: ['longtask'] });
    })();
  `,
}, sessionId);

await send('Page.navigate', { url }, sessionId);

const evalAsync = async (expression) => {
  const result = await send('Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  }, sessionId);
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text + ' ' + (result.exceptionDetails.exception?.description ?? ''));
  return result.result.value;
};

const ready0 = await evalAsync(`(() => new Promise((resolve) => {
  const start = performance.now();
  const tick = () => {
    const tmc = window.__tmc;
    if (tmc && tmc.stats && tmc.stats().chunks >= 20) { resolve({ ok: true, ms: Math.round(performance.now() - start) }); return; }
    if (performance.now() - start > 25000) { resolve({ ok: false }); return; }
    requestAnimationFrame(tick);
  };
  tick();
}))()`);

// Стартовое меню: без клика игровой цикл стоит на паузе.
const started = await evalAsync(`(() => {
  const button = [...document.querySelectorAll('button')].find((b) => /Играть|Play/i.test(b.textContent ?? ''));
  if (button) { button.click(); return true; }
  return false;
})()`);

const ready = await evalAsync(`(() => new Promise((resolve) => {
  const start = performance.now();
  const target = ${waitModels ? '78' : '78'};
  let vehicles = 0;
  let chunks = 0;
  const tick = () => {
    const tmc = window.__tmc;
    if (tmc && tmc.stats) {
      const s = tmc.stats();
      vehicles = s.vehicles;
      chunks = s.chunks;
      const loading = document.getElementById('loading');
      const loaded = !loading || loading.classList.contains('hidden');
      if (loaded && chunks >= 20 && (vehicles >= target || performance.now() - start > 20000)) {
        resolve({ ok: true, ms: Math.round(performance.now() - start), vehicles, chunks });
        return;
      }
    }
    if (performance.now() - start > 35000) { resolve({ ok: false, vehicles, chunks }); return; }
    requestAnimationFrame(tick);
  };
  tick();
}))()`);

const bootGaps = await evalAsync('({ max: window.__gaps.max, log: window.__gaps.log.slice(-12) })');

// --- M8: проверка интереса (события, работы, коллекции, сейв, атмосфера) ---
const interest = await evalAsync(`(async () => {
  const out = { initial: window.__tmc.interest() };
  out.forced = window.__tmc.forceEvent('chase');
  await new Promise((r) => setTimeout(r, 1400));
  out.events = window.__tmc.events();
  window.__tmc.cancelEvent();
  out.jobList = window.__tmc.jobList();
  out.jobStart = window.__tmc.startJob('race');
  await new Promise((r) => setTimeout(r, 600));
  out.job = window.__tmc.jobs();
  const loot = window.__tmc.collectibles();
  if (loot.nearestPackageX || loot.nearestPackageZ) {
    window.__tmc.teleport(loot.nearestPackageX, loot.nearestPackageZ);
    await new Promise((r) => setTimeout(r, 1200));
  }
  out.collect = window.__tmc.collectibles();
  out.achievements = window.__tmc.achievements().filter((a) => a.unlocked === 1).length;
  out.save = window.__tmc.saveGame();
  out.dayNight = window.__tmc.dayNight();
  out.radio = window.__tmc.radio();
  out.final = window.__tmc.interest();
  return out;
})()`);

const tp = process.argv[5];
let teleported = null;
if (tp) {
  const [x, z] = tp.split(',').map(Number);
  teleported = await evalAsync(`(() => new Promise((resolve) => {
    window.__tmc.teleport(${x}, ${z});
    const start = performance.now();
    const tick = () => {
      const elapsed = performance.now() - start;
      if (elapsed > 2500) { resolve({ x: ${x}, z: ${z}, ms: Math.round(elapsed), stats: window.__tmc.stats() }); return; }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }))()`);
}

const measure = await evalAsync(`(() => new Promise((resolve) => {
  window.__gaps.max = 0;
  window.__gaps.log.length = 0;
  window.__gapMark('steady');
  let frames = 0;
  const start = performance.now();
  const tick = () => {
    frames += 1;
    const elapsed = performance.now() - start;
    if (elapsed >= 3000) {
      resolve({ fps: Math.round((frames * 1000) / elapsed), ms: Math.round(elapsed), frames });
      return;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}))()`);

const stats = await evalAsync('window.__tmc.stats()');
const steadyGaps = await evalAsync('({ max: window.__gaps.max, log: window.__gaps.log.slice(-12) })');
const overlay = await evalAsync(`(() => {
  const el = document.getElementById('stats');
  return el ? el.textContent : 'нет #stats';
})()`);
const gaps = await evalAsync('window.__gaps');
const marks = gaps.marks;const renderer = await evalAsync(`(() => {
  const c = document.createElement('canvas');
  const gl = c.getContext('webgl2') || c.getContext('webgl');
  if (!gl) return 'нет webgl';
  const ext = gl.getExtension('WEBGL_debug_renderer_info');
  return ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : 'unknown';
})()`);
const memory = await evalAsync(`(() => {
  const nav = performance.getEntriesByType('navigation')[0];
  return { domContentLoaded: Math.round(nav?.domContentLoadedEventEnd ?? 0), load: Math.round(nav?.loadEventEnd ?? 0) };
})()`);

let screenshotPath = null;
if (shot) {
  const clipArg = process.argv[6];
  const params = { format: 'png' };
  if (clipArg) {
    const [x, y, width, height, scale] = clipArg.split(',').map(Number);
    params.clip = { x, y, width, height, scale };
  }
  const { data } = await send('Page.captureScreenshot', params, sessionId);
  screenshotPath = shot;
  writeFileSync(shot, Buffer.from(data, 'base64'));
}

console.log(JSON.stringify({
  url,
  ready0,
  started,
  ready,
  interest,
  teleported,
  measure,
  stats,
  overlay,
  bootGaps,
  steadyGaps,
  marks,
  renderer,
  memory,
  consoleErrors,
  exceptions,
  failedRequests,
  screenshotPath,
}, null, 2));

ws.close();
chrome.kill();
setTimeout(() => {
  try { rmSync(profile, { recursive: true, force: true }); } catch { /* профиль занят — удалим позже */ }
  process.exit(0);
}, 1500);
