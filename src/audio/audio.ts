// ---------------------------------------------------------------------------
// M6. Звук игры на WebAudio: без файлов и внешних запросов.
//
// Двигатель (пила + фильтр, частота от rpm), визг шин (шум + полосовой
// фильтр), выстрелы, удары, взрывы, сирена, интерфейс и сигналы миссий.
// Контекст создаётся лениво после жеста пользователя: браузер не блокирует
// автозапуск, а игра не падает, если WebAudio недоступен (возвращается
// беззвучная реализация).
//
// Громкость и mute — из настроек (config/ui.ts → settings), UI вызывает
// setVolume/setMuted.
// ---------------------------------------------------------------------------

import type { EntityId } from '../core/registry';
import type { VehicleAudioHooks } from '../systems/vehiclePhysics';

type AudioContextCtor = typeof AudioContext;

export interface GameAudio extends VehicleAudioHooks {
  /** Контекст создан и не сломан. */
  readonly available: boolean;
  /** Разбудить контекст после жеста пользователя. */
  resume(): void;
  setVolume(volume: number): void;
  setMuted(muted: boolean): void;
  /** Выстрел игрока/копа: тип влияет на тембр. */
  shot(weapon: string): void;
  /** Короткий сигнал интерфейса. */
  ui(kind: 'click' | 'success' | 'error'): void;
  /** Сигналы миссий: старт, груз, успех, провал. */
  mission(kind: 'start' | 'pickup' | 'complete' | 'fail'): void;
  horn(): void;
  /** Сирена ближайшей машины копов; distance — метры до игрока. */
  siren(active: boolean, distance: number): void;
  update(dt: number): void;
  dispose(): void;
}

interface ToneSpec {
  readonly frequency: number;
  readonly duration: number;
  readonly type: OscillatorType;
  readonly gain: number;
  readonly endFrequency?: number;
}

const MASTER_LEVEL = 0.7;
const SIREN_RANGE = 110;

function createSilent(): GameAudio {
  return {
    available: false,
    resume: () => undefined,
    setVolume: () => undefined,
    setMuted: () => undefined,
    shot: () => undefined,
    ui: () => undefined,
    mission: () => undefined,
    horn: () => undefined,
    siren: () => undefined,
    update: () => undefined,
    dispose: () => undefined,
    engineRpm: () => undefined,
    skid: () => undefined,
    impact: () => undefined,
    explosion: () => undefined,
  };
}

export function createGameAudio(): GameAudio {
  if (typeof window === 'undefined') return createSilent();

  let ctx: AudioContext | null = null;
  let failed = false;
  let master: GainNode | null = null;
  let noise: AudioBuffer | null = null;

  let engineOsc: OscillatorNode | null = null;
  let engineGain: GainNode | null = null;
  let skidGain: GainNode | null = null;
  let sirenOscA: OscillatorNode | null = null;
  let sirenOscB: OscillatorNode | null = null;
  let sirenGain: GainNode | null = null;

  let volume = 0.7;
  let muted = false;
  let sirenOn = false;
  let sirenDistance = 0;
  let sirenPhase = 0;
  let sirenTimer = 0;
  let skidOffTimer = 0;

  const applyMaster = (): void => {
    if (!ctx || !master) return;
    const target = muted ? 0 : volume * MASTER_LEVEL;
    try {
      master.gain.setTargetAtTime(target, ctx.currentTime, 0.05);
    } catch {
      // Контекст закрыт — звук просто не играет.
    }
  };

  const ensure = (force: boolean): boolean => {
    if (failed) return false;
    if (ctx) {
      if (ctx.state === 'suspended') void ctx.resume();
      return true;
    }
    if (!force) return false;
    try {
      const w = window as Window & { webkitAudioContext?: AudioContextCtor };
      const Ctor: AudioContextCtor | undefined = window.AudioContext ?? w.webkitAudioContext;
      if (!Ctor) {
        failed = true;
        return false;
      }
      ctx = new Ctor();
      master = ctx.createGain();
      master.gain.value = muted ? 0 : volume * MASTER_LEVEL;
      master.connect(ctx.destination);

      // Белый шум: шины, удары, выстрелы. Генерируется в рантайме, файлов нет.
      const sampleRate = ctx.sampleRate;
      const length = Math.max(1, Math.floor(sampleRate * 0.6));
      noise = ctx.createBuffer(1, length, sampleRate);
      const data = noise.getChannelData(0);
      for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;

      // Двигатель.
      engineOsc = ctx.createOscillator();
      engineOsc.type = 'sawtooth';
      engineOsc.frequency.value = 46;
      const engineFilter = ctx.createBiquadFilter();
      engineFilter.type = 'lowpass';
      engineFilter.frequency.value = 620;
      engineFilter.Q.value = 0.7;
      engineGain = ctx.createGain();
      engineGain.gain.value = 0;
      engineOsc.connect(engineFilter);
      engineFilter.connect(engineGain);
      engineGain.connect(master);
      engineOsc.start();

      // Визг шин: зацикленный шум через полосовой фильтр.
      const skidSource = ctx.createBufferSource();
      skidSource.buffer = noise;
      skidSource.loop = true;
      const skidFilter = ctx.createBiquadFilter();
      skidFilter.type = 'bandpass';
      skidFilter.frequency.value = 1250;
      skidFilter.Q.value = 0.9;
      skidGain = ctx.createGain();
      skidGain.gain.value = 0;
      skidSource.connect(skidFilter);
      skidFilter.connect(skidGain);
      skidGain.connect(master);
      skidSource.start();

      // Сирена: два треугольника с биениями, громкость от дистанции.
      sirenOscA = ctx.createOscillator();
      sirenOscA.type = 'triangle';
      sirenOscA.frequency.value = 660;
      sirenOscB = ctx.createOscillator();
      sirenOscB.type = 'triangle';
      sirenOscB.frequency.value = 880;
      sirenGain = ctx.createGain();
      sirenGain.gain.value = 0;
      sirenOscA.connect(sirenGain);
      sirenOscB.connect(sirenGain);
      sirenGain.connect(master);
      sirenOscA.start();
      sirenOscB.start();

      if (ctx.state === 'suspended') void ctx.resume();
      return true;
    } catch {
      failed = true;
      ctx = null;
      master = null;
      return false;
    }
  };

  const tone = (spec: ToneSpec): void => {
    if (!ensure(false) || !ctx || !master) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = spec.type;
      osc.frequency.setValueAtTime(spec.frequency, now);
      if (spec.endFrequency !== undefined) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, spec.endFrequency), now + spec.duration);
      }
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(spec.gain, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + spec.duration);
      osc.connect(gain);
      gain.connect(master);
      osc.start(now);
      osc.stop(now + spec.duration + 0.02);
      osc.onended = () => {
        osc.disconnect();
        gain.disconnect();
      };
    } catch {
      failed = true;
    }
  };

  const burst = (power: number, duration: number, cutoff: number): void => {
    if (!ensure(false) || !ctx || !master || !noise) return;
    try {
      const now = ctx.currentTime;
      const source = ctx.createBufferSource();
      source.buffer = noise;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = cutoff;
      const gain = ctx.createGain();
      const level = Math.min(0.7, 0.08 + power * 0.03);
      gain.gain.setValueAtTime(level, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      source.connect(filter);
      filter.connect(gain);
      gain.connect(master);
      source.start(now);
      source.stop(now + duration + 0.02);
      source.onended = () => {
        source.disconnect();
        filter.disconnect();
        gain.disconnect();
      };
    } catch {
      failed = true;
    }
  };

  return {
    get available() {
      return ctx !== null && !failed;
    },

    resume(): void {
      ensure(true);
      applyMaster();
    },

    setVolume(next: number): void {
      volume = Math.max(0, Math.min(1, next));
      applyMaster();
    },

    setMuted(next: boolean): void {
      muted = next;
      applyMaster();
    },

    engineRpm(_id: EntityId, rpm: number): void {
      // До первого жеста контекст не создаём: не пугаем консоль автозапуском.
      if (!ctx || !engineOsc || !engineGain) return;
      try {
        const now = ctx.currentTime;
        engineOsc.frequency.setTargetAtTime(46 + rpm * 210, now, 0.06);
        engineGain.gain.setTargetAtTime(rpm <= 0.001 ? 0 : 0.02 + rpm * 0.06, now, 0.08);
      } catch {
        failed = true;
      }
    },

    skid(_id: EntityId, slip: number): void {
      if (!ctx || !skidGain) return;
      try {
        skidGain.gain.setTargetAtTime(Math.min(0.32, 0.05 + slip * 0.3), ctx.currentTime, 0.04);
        skidOffTimer = 0.16;
      } catch {
        failed = true;
      }
    },

    impact(_id: EntityId, power: number): void {
      burst(Math.min(power, 30), 0.18, 260 + power * 10);
    },

    explosion(_id: EntityId): void {
      burst(34, 0.8, 180);
      tone({ frequency: 90, endFrequency: 30, duration: 0.55, type: 'sine', gain: 0.35 });
    },

    shot(weapon: string): void {
      if (weapon === 'shotgun') {
        burst(26, 0.22, 900);
        tone({ frequency: 140, endFrequency: 45, duration: 0.18, type: 'sawtooth', gain: 0.22 });
      } else if (weapon === 'smg') {
        burst(10, 0.07, 2200);
        tone({ frequency: 320, endFrequency: 120, duration: 0.06, type: 'square', gain: 0.08 });
      } else {
        burst(16, 0.11, 1600);
        tone({ frequency: 260, endFrequency: 90, duration: 0.09, type: 'square', gain: 0.1 });
      }
    },

    ui(kind: 'click' | 'success' | 'error'): void {
      if (kind === 'click') {
        tone({ frequency: 760, duration: 0.045, type: 'square', gain: 0.06 });
      } else if (kind === 'success') {
        tone({ frequency: 620, endFrequency: 980, duration: 0.18, type: 'triangle', gain: 0.1 });
      } else {
        tone({ frequency: 300, endFrequency: 150, duration: 0.22, type: 'sawtooth', gain: 0.1 });
      }
    },

    mission(kind: 'start' | 'pickup' | 'complete' | 'fail'): void {
      if (kind === 'start') {
        tone({ frequency: 520, duration: 0.1, type: 'triangle', gain: 0.07 });
        tone({ frequency: 780, duration: 0.14, type: 'triangle', gain: 0.07 });
      } else if (kind === 'pickup') {
        tone({ frequency: 440, endFrequency: 880, duration: 0.16, type: 'sine', gain: 0.09 });
      } else if (kind === 'complete') {
        tone({ frequency: 523, duration: 0.14, type: 'triangle', gain: 0.1 });
        tone({ frequency: 659, duration: 0.16, type: 'triangle', gain: 0.1 });
        tone({ frequency: 784, duration: 0.24, type: 'triangle', gain: 0.1 });
      } else {
        tone({ frequency: 330, endFrequency: 110, duration: 0.4, type: 'sawtooth', gain: 0.12 });
      }
    },

    horn(): void {
      tone({ frequency: 420, duration: 0.22, type: 'square', gain: 0.07 });
      tone({ frequency: 520, duration: 0.22, type: 'square', gain: 0.06 });
    },

    siren(active: boolean, distance: number): void {
      sirenOn = active;
      sirenDistance = distance;
      if (!ctx || !sirenGain) return;
      if (!active) {
        try {
          sirenGain.gain.setTargetAtTime(0, ctx.currentTime, 0.12);
        } catch {
          failed = true;
        }
      }
    },

    update(dt: number): void {
      if (!ctx) return;
      // Визг сам гаснет через 0.16 с после последнего slip-события.
      if (skidOffTimer > 0) {
        skidOffTimer -= dt;
        if (skidOffTimer <= 0 && skidGain) {
          try {
            skidGain.gain.setTargetAtTime(0, ctx.currentTime, 0.09);
          } catch {
            failed = true;
          }
        }
      }
      if (!sirenOn || !sirenGain) return;
      sirenTimer -= dt;
      if (sirenTimer > 0) return;
      sirenTimer = 0.1;
      sirenPhase += 0.1;
      const falloff = Math.max(0, Math.min(1, 1 - sirenDistance / SIREN_RANGE));
      const warble = Math.sin(sirenPhase * 7) * 0.5 + 0.5;
      try {
        sirenGain.gain.setTargetAtTime(0.02 + falloff * 0.1, ctx.currentTime, 0.08);
        if (sirenOscA) sirenOscA.frequency.setTargetAtTime(640 + warble * 180, ctx.currentTime, 0.05);
        if (sirenOscB) sirenOscB.frequency.setTargetAtTime(860 + warble * 220, ctx.currentTime, 0.05);
      } catch {
        failed = true;
      }
    },

    dispose(): void {
      try {
        engineOsc?.stop();
        sirenOscA?.stop();
        sirenOscB?.stop();
        if (ctx) void ctx.close();
      } catch {
        // Контекст мог быть уже закрыт — не мешает выходу.
      }
      ctx = null;
      master = null;
      noise = null;
      engineOsc = null;
      engineGain = null;
      skidGain = null;
      sirenOscA = null;
      sirenOscB = null;
      sirenGain = null;
    },
  };
}
