// ---------------------------------------------------------------------------
// M6. Локализация ru/en/tr. Словари лежат в assets/i18n/*.json и попадают
// в бандл на сборке (никаких внешних запросов во время игры).
//
// Ключи плоские, строки в HUD и меню не хардкодятся. Смена языка идёт без
// перезагрузки: подписчики onChange перерисовывают свои подписи.
// ---------------------------------------------------------------------------

import enRaw from '../../assets/i18n/en.json';
import ruRaw from '../../assets/i18n/ru.json';
import trRaw from '../../assets/i18n/tr.json';
import { UI_LANGS, localeTag } from '../config/ui';
import type { LangCode } from '../config/ui';

export type Lang = LangCode;
export type Dictionary = Readonly<Record<string, string>>;

type Params = Readonly<Record<string, string | number>>;

/**
 * JSON-модуль объявлен как `unknown` (src/world/json.d.ts). Проверяем словарь
 * один раз при загрузке: битый перевод не должен ломать HUD.
 */
function parseDictionary(raw: unknown, fallback: Dictionary): Dictionary {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return fallback;
  const source = raw as Record<string, unknown>;
  const result: Record<string, string> = {};
  for (const key of Object.keys(source)) {
    const value = source[key];
    if (typeof value === 'string') result[key] = value;
  }
  return Object.keys(result).length > 0 ? result : fallback;
}

const RU = parseDictionary(ruRaw, {});
const DICTIONARIES: Readonly<Record<Lang, Dictionary>> = {
  ru: RU,
  en: parseDictionary(enRaw, RU),
  tr: parseDictionary(trRaw, RU),
};

/** Язык интерфейса по строке: сохранение, navigator.language, платформа. */
export function detectLang(value?: string | null): Lang {
  if (!value) return 'ru';
  const lower = value.toLowerCase();
  if (lower.startsWith('en')) return 'en';
  if (lower.startsWith('tr')) return 'tr';
  if (lower.startsWith('ru')) return 'ru';
  return 'ru';
}

export interface I18n {
  readonly lang: Lang;
  readonly langs: readonly Lang[];
  setLang(lang: Lang): void;
  /** Перевод по ключу; отсутствующий ключ возвращается как есть. */
  t(key: string, params?: Params): string;
  has(key: string): boolean;
  formatNumber(value: number): string;
  formatTime(seconds: number): string;
  onChange(listener: (lang: Lang) => void): () => void;
}

export function createI18n(initial: Lang): I18n {
  let current: Lang = initial;
  const listeners = new Set<(lang: Lang) => void>();
  const numberFormats = new Map<Lang, Intl.NumberFormat>();

  const dictionary = (): Dictionary => DICTIONARIES[current];

  const formatNumber = (value: number): string => {
    let format = numberFormats.get(current);
    if (!format) {
      format = new Intl.NumberFormat(localeTag(current), { maximumFractionDigits: 0 });
      numberFormats.set(current, format);
    }
    return format.format(Math.round(value));
  };

  return {
    get lang() {
      return current;
    },
    get langs() {
      return UI_LANGS;
    },
    setLang(lang: Lang): void {
      if (lang === current) return;
      current = lang;
      for (const listener of listeners) listener(current);
    },
    t(key: string, params?: Params): string {
      const dict = dictionary();
      let text = dict[key];
      if (text === undefined) text = RU[key];
      if (text === undefined) return key;
      if (!params) return text;
      return text.replace(/\{(\w+)\}/g, (match, name: string) => {
        const value = params[name];
        return value === undefined ? match : String(value);
      });
    },
    has(key: string): boolean {
      return dictionary()[key] !== undefined || RU[key] !== undefined;
    },
    formatNumber,
    formatTime(seconds: number): string {
      const total = Math.max(0, Math.ceil(seconds));
      const minutes = Math.floor(total / 60);
      const rest = total % 60;
      return `${minutes}:${rest < 10 ? '0' : ''}${rest}`;
    },
    onChange(listener: (lang: Lang) => void): () => void {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
