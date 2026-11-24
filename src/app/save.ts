// ---------------------------------------------------------------------------
// M6. Сохранение профиля: localStorage сейчас, PlatformAdapter — позже
// через SaveTransport (структурно совпадает с PlatformAdapter.save/load).
//
// Формат версионирован: миграция — чистая функция migrateProfile, поэтому
// старые сохранения не ломают игру и легко тестируются. Ошибки хранилища
// (приватный режим, лимит квоты) не бросаются наружу — игра идёт без сейва.
// ---------------------------------------------------------------------------

import { ECONOMY } from '../config/economy';
import { UI } from '../config/ui';
import type { LangCode, TouchMode, UiQuality } from '../config/ui';
import { detectLang } from '../ui/i18n';

/** Текущая версия формата. Растёт при несовместимых изменениях. */
export const SAVE_VERSION = 1;
const SAVE_KEY = 'tmc.save';

export interface SaveSettings {
  lang: LangCode;
  volume: number;
  muted: boolean;
  quality: UiQuality;
  touch: TouchMode;
  hints: boolean;
}

export interface SaveStats {
  missionsCompleted: number;
  missionsFailed: number;
  playSeconds: number;
}

export interface SaveMissionProgress {
  completed: string[];
  cooldowns: Record<string, number>;
}

export interface SaveProfile {
  version: number;
  money: number;
  upgrades: Record<string, number>;
  missions: SaveMissionProgress;
  settings: SaveSettings;
  stats: SaveStats;
  savedAt: number;
}

/** Конверт платформы: совместим с PlatformAdapter.save/load (§3.5). */
export interface SaveEnvelope {
  readonly version: number;
  readonly profile: unknown;
}

export interface SaveTransport {
  save(data: SaveEnvelope): Promise<void>;
  load(): Promise<SaveEnvelope | null>;
}

type Raw = Record<string, unknown>;

function asRecord(value: unknown): Raw | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;
  return value as Raw;
}

function asNumber(value: unknown, fallback: number, min: number, max: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  return Math.max(min, Math.min(max, value));
}

function asBool(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function asLang(value: unknown, fallback: LangCode): LangCode {
  if (value === 'ru' || value === 'en' || value === 'tr') return value;
  if (typeof value === 'string') return detectLang(value);
  return fallback;
}

function asQuality(value: unknown, fallback: UiQuality): UiQuality {
  return value === 'low' || value === 'medium' || value === 'high' ? value : fallback;
}

function asTouch(value: unknown, fallback: TouchMode): TouchMode {
  return value === 'auto' || value === 'on' || value === 'off' ? value : fallback;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const out: string[] = [];
  for (const item of value) {
    if (typeof item === 'string' && item.length > 0 && !out.includes(item)) out.push(item);
  }
  return out;
}

function asNumberRecord(value: unknown): Record<string, number> {
  const source = asRecord(value);
  const out: Record<string, number> = {};
  if (!source) return out;
  for (const key of Object.keys(source)) {
    const raw = source[key];
    if (typeof raw === 'number' && Number.isFinite(raw) && raw > 0) out[key] = raw;
  }
  return out;
}

/** Профиль новой игры. settings подмешиваются из уже известных настроек. */
export function createDefaultProfile(settings?: Partial<SaveSettings>): SaveProfile {
  return {
    version: SAVE_VERSION,
    money: ECONOMY.startMoney,
    upgrades: {},
    missions: { completed: [], cooldowns: {} },
    settings: {
      lang: settings?.lang ?? UI.settings.lang,
      volume: settings?.volume ?? UI.settings.volume,
      muted: settings?.muted ?? UI.settings.muted,
      quality: settings?.quality ?? UI.settings.quality,
      touch: settings?.touch ?? UI.settings.touch,
      hints: settings?.hints ?? UI.settings.hints,
    },
    stats: { missionsCompleted: 0, missionsFailed: 0, playSeconds: 0 },
    savedAt: Date.now(),
  };
}

/**
 * Миграция и санитизация: принимает любой JSON (включая прототип M5 без
 * версии) и возвращает валидный профиль либо null, если это не сохранение.
 */
export function migrateProfile(raw: unknown): SaveProfile | null {
  const source = asRecord(raw);
  if (!source) return null;
  const defaults = createDefaultProfile();

  // Версия 0 — прототип до M6: { money } или { version: 0, money }.
  const version = typeof source.version === 'number' && Number.isFinite(source.version)
    ? Math.floor(source.version)
    : source.money !== undefined
      ? 0
      : null;
  if (version === null || version > SAVE_VERSION) return null;

  const settingsRaw = asRecord(source.settings);
  const statsRaw = asRecord(source.stats);
  const missionsRaw = asRecord(source.missions);

  const moneyFallback = typeof source.money === 'number' ? source.money : defaults.money;

  return {
    version: SAVE_VERSION,
    money: asNumber(source.money ?? moneyFallback, defaults.money, 0, ECONOMY.maxMoney),
    upgrades: asNumberRecord(source.upgrades),
    missions: {
      completed: asStringArray(missionsRaw?.completed),
      cooldowns: asNumberRecord(missionsRaw?.cooldowns),
    },
    settings: {
      lang: asLang(settingsRaw?.lang, defaults.settings.lang),
      volume: asNumber(settingsRaw?.volume, defaults.settings.volume, 0, 1),
      muted: asBool(settingsRaw?.muted, defaults.settings.muted),
      quality: asQuality(settingsRaw?.quality, defaults.settings.quality),
      touch: asTouch(settingsRaw?.touch, defaults.settings.touch),
      hints: asBool(settingsRaw?.hints, defaults.settings.hints),
    },
    stats: {
      missionsCompleted: Math.round(
        asNumber(statsRaw?.missionsCompleted, 0, 0, 1_000_000),
      ),
      missionsFailed: Math.round(asNumber(statsRaw?.missionsFailed, 0, 0, 1_000_000)),
      playSeconds: asNumber(statsRaw?.playSeconds, 0, 0, 100_000_000),
    },
    savedAt: asNumber(source.savedAt, Date.now(), 0, Number.MAX_SAFE_INTEGER),
  };
}

/** Хранилище может быть недоступно (приватный режим, запрет cookies). */
function safeStorage(): Storage | null {
  try {
    if (typeof window === 'undefined') return null;
    const storage = window.localStorage;
    const probe = '__tmc_probe__';
    storage.setItem(probe, '1');
    storage.removeItem(probe);
    return storage;
  } catch {
    return null;
  }
}

export class SaveService {
  private readonly storage: Storage | null;
  private transport: SaveTransport | null = null;

  constructor(storage: Storage | null = safeStorage()) {
    this.storage = storage;
  }

  /** Есть ли сохранение в localStorage. */
  get hasSave(): boolean {
    if (!this.storage) return false;
    try {
      return this.storage.getItem(SAVE_KEY) !== null;
    } catch {
      return false;
    }
  }

  /** Синхронная загрузка (старт игры). Битое сохранение игнорируется. */
  load(): SaveProfile | null {
    if (!this.storage) return null;
    try {
      const text = this.storage.getItem(SAVE_KEY);
      if (!text) return null;
      return migrateProfile(JSON.parse(text) as unknown);
    } catch {
      return null;
    }
  }

  /** Сохранить локально и, если есть, отправить на платформу. */
  save(profile: SaveProfile): boolean {
    const payload: SaveProfile = { ...profile, version: SAVE_VERSION, savedAt: Date.now() };
    let ok = false;
    if (this.storage) {
      try {
        this.storage.setItem(SAVE_KEY, JSON.stringify(payload));
        ok = true;
      } catch {
        ok = false;
      }
    }
    if (this.transport) {
      // Платформа не должна задерживать кадр: сохранение идёт «в фоне».
      void this.transport.save({ version: SAVE_VERSION, profile: payload }).catch(() => undefined);
    }
    return ok;
  }

  clear(): void {
    if (!this.storage) return;
    try {
      this.storage.removeItem(SAVE_KEY);
    } catch {
      // Ничего: очистить не удалось, игра продолжается.
    }
  }

  /** Подключить адаптер платформы (M8). */
  setTransport(transport: SaveTransport | null): void {
    this.transport = transport;
  }

  /** Асинхронная загрузка из платформы: localStorage имеет приоритет. */
  async loadRemote(): Promise<SaveProfile | null> {
    if (!this.transport) return null;
    try {
      const envelope = await this.transport.load();
      if (!envelope) return null;
      return migrateProfile(envelope.profile);
    } catch {
      return null;
    }
  }
}

export function createSaveService(): SaveService {
  return new SaveService();
}
