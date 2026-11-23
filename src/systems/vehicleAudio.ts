// ---------------------------------------------------------------------------
// M4. Простой WebAudio для машин: без файлов и внешних ассетов.
// Двигатель — пилообразный осциллятор, скольжение — шум с полосовым фильтром,
// удар/взрыв — короткие шумовые всплески. Контекст создаётся лениво и
// только после попытки игры: если браузер блокирует автозапуск, звук просто
// появится после первого действия пользователя.
//
// Модуль намеренно необязательный: при любой ошибке возвращает no-op хуки
// из vehiclePhysics, чтобы физика никогда не падала из-за звука.
// ---------------------------------------------------------------------------

import type { EntityId } from '../core/registry';
import { NOOP_VEHICLE_AUDIO } from './vehiclePhysics';
import type { VehicleAudioHooks } from './vehiclePhysics';

type AudioContextCtor = typeof AudioContext;

export function createVehicleAudio(): VehicleAudioHooks {
  let failed = false;
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let engineOsc: OscillatorNode | null = null;
  let engineGain: GainNode | null = null;
  let noise: AudioBuffer | null = null;
  let skidGain: GainNode | null = null;
  let skidOffTimer: ReturnType<typeof setTimeout> | null = null;

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
      master = ctx.createGain();
      master.gain.value = 0.18;
      master.connect(ctx.destination);

      engineOsc = ctx.createOscillator();
      engineOsc.type = 'sawtooth';
      engineOsc.frequency.value = 48;
      engineGain = ctx.createGain();
      engineGain.gain.value = 0;
      engineOsc.connect(engineGain);
      engineGain.connect(master);
      engineOsc.start();

      // Белый шум для шин и ударов — генерируется в рантайме, файлов нет.
      const sampleRate = ctx.sampleRate;
      const length = Math.floor(sampleRate * 0.5);
      noise = ctx.createBuffer(1, length, sampleRate);
      const data = noise.getChannelData(0);
      for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;

      const skidSource = ctx.createBufferSource();
      skidSource.buffer = noise;
      skidSource.loop = true;
      const skidFilter = ctx.createBiquadFilter();
      skidFilter.type = 'bandpass';
      skidFilter.frequency.value = 1100;
      skidFilter.Q.value = 0.8;
      skidGain = ctx.createGain();
      skidGain.gain.value = 0;
      skidSource.connect(skidFilter);
      skidFilter.connect(skidGain);
      skidGain.connect(master);
      skidSource.start();

      if (ctx.state === 'suspended') void ctx.resume();
      return true;
    } catch {
      failed = true;
      ctx = null;
      master = null;
      return false;
    }
  };

  const burst = (power: number, duration: number, cutoff: number): void => {
    if (!ensure() || !ctx || !master || !noise) return;
    try {
      const now = ctx.currentTime;
      const source = ctx.createBufferSource();
      source.buffer = noise;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = cutoff;
      const gain = ctx.createGain();
      const level = Math.min(0.6, 0.06 + power * 0.02);
      gain.gain.setValueAtTime(level, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      source.connect(filter);
      filter.connect(gain);
      gain.connect(master);
      source.start(now);
      source.stop(now + duration);
      source.onended = () => {
        source.disconnect();
        filter.disconnect();
        gain.disconnect();
      };
    } catch {
      failed = true;
    }
  };

  const hooks: VehicleAudioHooks = {
    engineRpm: (_id: EntityId, rpm: number): void => {
      // Ноль — двигатель молчит. Контекст не создаём до первого газа:
      // так браузер не ругается на автозапуск, пока игрок не нажал клавишу.
      if (rpm <= 0.001) {
        if (ctx && engineGain) engineGain.gain.setTargetAtTime(0, ctx.currentTime, 0.05);
        return;
      }
      if (!ensure() || !ctx || !engineOsc || !engineGain) return;
      try {
        const now = ctx.currentTime;
        engineOsc.frequency.setTargetAtTime(48 + rpm * 190, now, 0.06);
        engineGain.gain.setTargetAtTime(0.015 + rpm * 0.05, now, 0.08);
      } catch {
        failed = true;
      }
    },

    skid: (_id: EntityId, slip: number): void => {
      if (!ensure() || !ctx || !skidGain) return;
      try {
        skidGain.gain.setTargetAtTime(Math.min(0.4, 0.08 + slip * 0.3), ctx.currentTime, 0.03);
        if (skidOffTimer !== null) clearTimeout(skidOffTimer);
        skidOffTimer = setTimeout(() => {
          skidOffTimer = null;
          if (ctx && skidGain) skidGain.gain.setTargetAtTime(0, ctx.currentTime, 0.09);
        }, 140);
      } catch {
        failed = true;
      }
    },

    impact: (_id: EntityId, power: number): void => {
      burst(power, 0.16, 240 + power * 12);
    },

    explosion: (_id: EntityId): void => {
      burst(30, 0.7, 160);
    },
  };

  if (typeof window === 'undefined') return NOOP_VEHICLE_AUDIO;
  return hooks;
}
