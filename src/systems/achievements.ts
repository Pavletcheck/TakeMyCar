// ---------------------------------------------------------------------------
// M8. Достижения и статистика.
//
// Система хранит разблокированные ачивки и снимок статистики, который app
// обновляет раз в HUD-тик (10 Гц). Проверка 20 условий — дешёвая, в кадре
// нет аллокаций: массивы и объекты созданы в конструкторе.
//
// Награду выдаёт app по колбэку onUnlock (экономика + тост), поэтому система
// не знает ни про деньги, ни про интерфейс.
// ---------------------------------------------------------------------------

import { ACHIEVEMENTS, emptyAchievementStats } from '../config/achievements';
import type { AchievementDef, AchievementStat, AchievementStats } from '../config/achievements';

export interface AchievementView {
  readonly id: string;
  readonly titleKey: string;
  readonly descKey: string;
  readonly glyph: string;
  readonly unlocked: boolean;
  readonly progress: number;
  readonly target: number;
  readonly reward: number;
}

export interface AchievementsSaveState {
  readonly unlocked: string[];
  readonly stats: Record<string, number>;
}

export interface AchievementSystemOptions {
  readonly unlocked?: readonly string[];
  readonly stats?: Partial<Record<AchievementStat, number>>;
  onUnlock?: (def: AchievementDef, reward: number) => void;
}

const STAT_KEYS: readonly AchievementStat[] = [
  'packages',
  'ramps',
  'uniqueCars',
  'jobs',
  'jobKinds',
  'events',
  'maxStars',
  'missions',
  'earned',
  'wrecks',
  'raceWins',
];

const MAX_STAT_VALUE = 1_000_000_000;

export class AchievementSystem {
  readonly stats: AchievementStats = emptyAchievementStats();

  private readonly defs: readonly AchievementDef[];
  private readonly unlocked = new Set<string>();
  private readonly onUnlockHook: AchievementSystemOptions['onUnlock'] | null;
  private readonly views: AchievementView[] = [];
  private dirty = true;

  constructor(options: AchievementSystemOptions = {}) {
    this.defs = ACHIEVEMENTS;
    this.onUnlockHook = options.onUnlock ?? null;
    if (options.unlocked) {
      for (let i = 0; i < options.unlocked.length; i += 1) {
        const id = options.unlocked[i];
        for (let k = 0; k < this.defs.length; k += 1) {
          if (this.defs[k].id === id) {
            this.unlocked.add(id);
            break;
          }
        }
      }
    }
    if (options.stats) {
      for (let i = 0; i < STAT_KEYS.length; i += 1) {
        const key = STAT_KEYS[i];
        const value = options.stats[key];
        if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
          this.stats[key] = Math.min(MAX_STAT_VALUE, value);
        }
      }
    }
  }

  get found(): number {
    return this.unlocked.size;
  }

  get total(): number {
    return this.defs.length;
  }

  get maxStars(): number {
    return this.stats.maxStars;
  }

  isUnlocked(id: string): boolean {
    return this.unlocked.has(id);
  }

  /** Установить текущее значение стата (без проверки). */
  setStat(key: AchievementStat, value: number): void {
    if (!Number.isFinite(value)) return;
    const next = Math.max(0, Math.min(MAX_STAT_VALUE, Math.round(value)));
    if (this.stats[key] === next) return;
    this.stats[key] = next;
    this.dirty = true;
  }

  /** Проверить условия и выдать новые достижения. Вызывать после обновления статов. */
  sync(): void {
    for (let i = 0; i < this.defs.length; i += 1) {
      const def = this.defs[i];
      if (this.unlocked.has(def.id)) continue;
      if (this.stats[def.stat] < def.target) continue;
      this.unlocked.add(def.id);
      this.dirty = true;
      if (this.onUnlockHook) this.onUnlockHook(def, def.reward);
    }
  }

  /** Снимок для экрана прогресса в паузе. */
  list(): readonly AchievementView[] {
    if (!this.dirty) return this.views;
    this.views.length = 0;
    for (let i = 0; i < this.defs.length; i += 1) {
      const def = this.defs[i];
      this.views.push({
        id: def.id,
        titleKey: def.titleKey,
        descKey: def.descKey,
        glyph: def.glyph,
        unlocked: this.unlocked.has(def.id),
        progress: Math.min(def.target, this.stats[def.stat]),
        target: def.target,
        reward: def.reward,
      });
    }
    this.dirty = false;
    return this.views;
  }

  save(): AchievementsSaveState {
    const stats: Record<string, number> = {};
    for (let i = 0; i < STAT_KEYS.length; i += 1) {
      const key = STAT_KEYS[i];
      const value = this.stats[key];
      if (value > 0) stats[key] = Math.round(value);
    }
    return { unlocked: Array.from(this.unlocked), stats };
  }

  restore(state: AchievementsSaveState): void {
    this.unlocked.clear();
    for (let i = 0; i < state.unlocked.length; i += 1) {
      const id = state.unlocked[i];
      for (let k = 0; k < this.defs.length; k += 1) {
        if (this.defs[k].id === id) {
          this.unlocked.add(id);
          break;
        }
      }
    }
    for (let i = 0; i < STAT_KEYS.length; i += 1) {
      const key = STAT_KEYS[i];
      const raw = state.stats[key];
      this.stats[key] = typeof raw === 'number' && Number.isFinite(raw) && raw > 0 ? Math.round(raw) : 0;
    }
    this.dirty = true;
  }

  reset(): void {
    this.unlocked.clear();
    const empty = emptyAchievementStats();
    for (let i = 0; i < STAT_KEYS.length; i += 1) {
      const key = STAT_KEYS[i];
      this.stats[key] = empty[key];
    }
    this.dirty = true;
  }
}
