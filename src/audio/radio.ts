// ---------------------------------------------------------------------------
// M8. Радио: три синтезированные станции + выпуски новостей.
//
// Отдельный AudioContext и отдельная шина gain (C-06): громкость и mute
// не зависят от двигателя/сирены, а информацию о преступлениях игрока
// app отдаёт строкой (локализация живёт в app, не в audio).
//
// Контекст создаётся только после жеста пользователя (resume), ноты
// планируются на 0.3 с вперёд — без setInterval и таймеров вне игры.
// ---------------------------------------------------------------------------

import { RADIO, RADIO_STATIONS, noteFrequency } from '../config/ambience';
import type { RadioStationDef } from '../config/ambience';

export interface RadioOptions {
  /** Готовый текст новости: app форматирует ключи локализации. */
  onNews?: (text: string) => void;
}

export interface Radio {
  /** Контекст запущен после жеста. */
  readonly available: boolean;
  /** Станция: -1 — выключено, 0..2. */
  readonly stationIndex: number;
  readonly stationKey: string;
  /** Сколько новостей передано за сеанс (диагностика). */
  readonly newsCount: number;
  resume(): void;
  /** Следующая станция по кругу: 0 → 1 → 2 → выкл → 0. */
  next(): number;
  setStation(index: number): void;
  setVolume(volume: number): void;
  setMuted(muted: boolean): void;
  /** Поставить новость в эфир (текст уже локализован). */
  news(text: string): void;
  update(dt: number): void;
  dispose(): void;
}

type AudioContextCtor = typeof AudioContext;

interface RadioImpl {
  stationIndex: number;
  available: boolean;
  newsCount: number;
}

export function createRadio(options: RadioOptions = {}): Radio {
  if (typeof window === 'undefined') {
    return {
      available: false,
      stationIndex: -1,
      stationKey: 'radio.station.off',
      newsCount: 0,
      resume: () => undefined,
      next: () => -1,
      setStation: () => undefined,
      setVolume: () => undefined,
      setMuted: () => undefined,
      news: () => undefined,
      update: () => undefined,
      dispose: () => undefined,
    };
  }

  const state: RadioImpl = {
    stationIndex: RADIO.defaultStation,
    available: false,
    newsCount: 0,
  };

  let ctx: AudioContext | null = null;
  let bus: GainNode | null = null;
  let failed = false;
  let volume = 0.7;
  let muted = false;
  let beat = 0;
  let nextTime = 0;
  let newsCooldown = 0;

  const station = (): RadioStationDef | null => {
    if (state.stationIndex < 0) return null;
    return RADIO_STATIONS[state.stationIndex] ?? null;
  };

  const applyBus = (): void => {
    if (!ctx || !bus) return;
    const target = muted || volume <= 0 ? 0 : Math.max(0, Math.min(1, volume)) * RADIO.volume;
    try {
      bus.gain.setTargetAtTime(target, ctx.currentTime, 0.08);
    } catch {
      // Контекст мог быть закрыт — радио просто молчит.
    }
  };

  const ensure = (): boolean => {
    if (failed) return false;
    if (ctx) {
      if (ctx.state === 'suspended') void ctx.resume();
      return true;
    }
    try {
      const w = window as Window & { webkitAudioContext?: AudioContextCtor };
      const Ctor: AudioContextCtor | undefined = window.AudioContext ?? w.webkitAudioContext;
      if (!Ctor) {
        failed = true;
        return false;
      }
      ctx = new Ctor();
      bus = ctx.createGain();
      bus.gain.value = 0;
      bus.connect(ctx.destination);
      state.available = true;
      nextTime = ctx.currentTime + 0.1;
      applyBus();
      return true;
    } catch {
      failed = true;
      ctx = null;
      bus = null;
      return false;
    }
  };

  const tone = (
    frequency: number,
    duration: number,
    type: OscillatorType,
    gain: number,
    at: number,
  ): void => {
    if (!ctx || !bus) return;
    try {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, at);
      const envelope = ctx.createGain();
      envelope.gain.setValueAtTime(0.0001, at);
      envelope.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), at + 0.02);
      envelope.gain.exponentialRampToValueAtTime(0.0001, at + duration);
      osc.connect(envelope);
      envelope.connect(bus);
      osc.start(at);
      osc.stop(at + duration + 0.03);
      osc.onended = () => {
        osc.disconnect();
        envelope.disconnect();
      };
    } catch {
      failed = true;
    }
  };

  const scheduleStep = (step: number, at: number, def: RadioStationDef): void => {
    const note = def.scale[step % def.scale.length];
    tone(noteFrequency(def.baseNote, note), 0.24, def.wave, def.gain, at);
    if (step % 4 === 0) {
      const bassStep = Math.floor(step / 4) % def.bass.length;
      tone(noteFrequency(def.baseNote * 0.5, def.bass[bassStep]), 0.36, 'sine', def.gain * 1.2, at);
    }
    // Лёгкий «хай-хэт» на слабых долях — без шумовых буферов в кадре.
    if (step % 2 === 1) tone(6200, 0.03, 'square', def.gain * 0.12, at);
  };

  return {
    get available() {
      return state.available;
    },
    get stationIndex() {
      return state.stationIndex;
    },
    get stationKey() {
      const def = station();
      return def ? def.nameKey : 'radio.station.off';
    },
    get newsCount() {
      return state.newsCount;
    },

    resume(): void {
      ensure();
    },

    next(): number {
      state.stationIndex += 1;
      if (state.stationIndex >= RADIO_STATIONS.length) state.stationIndex = -1;
      if (ctx) {
        nextTime = ctx.currentTime + 0.05;
        beat = 0;
        applyBus();
      }
      return state.stationIndex;
    },

    setStation(index: number): void {
      const next = Math.max(-1, Math.min(RADIO_STATIONS.length - 1, Math.round(index)));
      if (next === state.stationIndex) return;
      state.stationIndex = next;
      if (ctx) {
        nextTime = ctx.currentTime + 0.05;
        beat = 0;
      }
    },

    setVolume(value: number): void {
      volume = Math.max(0, Math.min(1, value));
      applyBus();
    },

    setMuted(value: boolean): void {
      muted = value;
      applyBus();
    },

    news(text: string): void {
      if (newsCooldown > 0) return;
      if (!text) return;
      newsCooldown = RADIO.newsCooldown;
      state.newsCount += 1;
      if (options.onNews) options.onNews(text);
      // Джингл новостей: три ноты вверх, если радио на воздухе.
      if (ctx && state.stationIndex >= 0) {
        const at = ctx.currentTime + 0.02;
        tone(523, 0.12, 'triangle', 0.08, at);
        tone(659, 0.12, 'triangle', 0.08, at + 0.14);
        tone(784, 0.2, 'triangle', 0.08, at + 0.28);
      }
    },

    update(dt: number): void {
      if (newsCooldown > 0) newsCooldown = Math.max(0, newsCooldown - dt);
      if (!ctx || !bus) return;
      const def = station();
      if (!def) return;
      // Вкладка была в фоне — не «догоняем» пачку нот.
      if (nextTime < ctx.currentTime - 1) nextTime = ctx.currentTime + 0.05;
      const stepSeconds = 60 / def.tempo / 2;
      let guard = 0;
      while (nextTime < ctx.currentTime + 0.3 && guard < 8) {
        scheduleStep(beat, nextTime, def);
        beat = (beat + 1) % 8;
        nextTime += stepSeconds;
        guard += 1;
      }
    },

    dispose(): void {
      try {
        if (ctx) void ctx.close();
      } catch {
        // Контекст мог быть закрыт браузером.
      }
      ctx = null;
      bus = null;
      state.available = false;
    },
  };
}
