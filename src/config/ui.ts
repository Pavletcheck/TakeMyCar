// ---------------------------------------------------------------------------
// M6. Конфиг интерфейса: палитра HUD, размеры, настройки по умолчанию.
//
// UI не хардкодит цвета и размеры: всё читается из этого файла (AGENTS §5).
// Строки здесь не живут — только ключи локализации.
// ---------------------------------------------------------------------------

/** Поддерживаемые языки. Набор фиксирован брифом M6. */
export type LangCode = 'ru' | 'en' | 'tr';

/** Качество графики: влияет на pixelRatio и тени (применяет app/bootstrap). */
export type UiQuality = 'low' | 'medium' | 'high';

/** Режим мобильных контролов: авто по тач-устройству, всегда, никогда. */
export type TouchMode = 'auto' | 'on' | 'off';

export interface UiColors {
  /** Подложка панелей HUD и меню. */
  readonly panel: string;
  /** Рамка панелей. */
  readonly panelBorder: string;
  /** Основной текст. */
  readonly text: string;
  /** Второстепенный текст и подписи. */
  readonly textDim: string;
  /** Акцент интерфейса (кнопки, фокус). */
  readonly accent: string;
  /** Деньги. */
  readonly money: string;
  /** Здоровье в норме. */
  readonly health: string;
  /** Здоровье на исходе и предупреждения. */
  readonly danger: string;
  /** Звёзды розыска. */
  readonly stars: string;
  /** Маркер и панель миссии. */
  readonly mission: string;
  /** Успех. */
  readonly success: string;
  // --- мини-карта ---
  readonly mapBackground: string;
  readonly mapWater: string;
  readonly mapBlock: string;
  readonly mapPark: string;
  readonly mapRoad: string;
  readonly mapRoadArterial: string;
  readonly mapPlayer: string;
  readonly mapCop: string;
  readonly mapBorder: string;
}

export interface UiLayout {
  /** Базовый отступ HUD, px. */
  readonly padding: number;
  /** Сторона мини-карты на десктопе, px. */
  readonly minimapSize: number;
  /** Сторона мини-карты на телефоне, px. */
  readonly minimapSizeMobile: number;
  /** Ширина обзора мини-карты, м (по большей стороне). */
  readonly minimapRange: number;
  /** Базовый кегль HUD, px. */
  readonly fontSize: number;
  /** Кегль HUD на телефоне, px. */
  readonly fontSizeMobile: number;
  /** Минимальный размер тач-цели, px (требование платформ). */
  readonly touchTarget: number;
  /** Радиус мёртвой зоны стика, доля хода. */
  readonly stickDeadzone: number;
  /** Максимальная ширина панели миссии, px. */
  readonly missionPanelWidth: number;
  /** Ширина списка миссий в пейджере, px. */
  readonly pagerWidth: number;
}

export interface UiSettingsDefaults {
  readonly lang: LangCode;
  readonly volume: number;
  readonly muted: boolean;
  readonly quality: UiQuality;
  readonly touch: TouchMode;
  /** Показывать подсказки управления. */
  readonly hints: boolean;
}

export interface UiQualityPreset {
  readonly labelKey: string;
  /** Ограничение devicePixelRatio. */
  readonly pixelRatio: number;
  /** Тени сцены. */
  readonly shadows: boolean;
}

export interface UiConfig {
  readonly colors: UiColors;
  readonly layout: UiLayout;
  readonly settings: UiSettingsDefaults;
  readonly quality: Readonly<Record<UiQuality, UiQualityPreset>>;
}

export const UI_LANGS: readonly LangCode[] = ['ru', 'en', 'tr'];

export const UI: UiConfig = {
  colors: {
    panel: 'rgba(13, 17, 23, 0.78)',
    panelBorder: 'rgba(255, 255, 255, 0.14)',
    text: '#e6edf3',
    textDim: '#9da7b3',
    accent: '#4dabf7',
    money: '#69db7c',
    health: '#ff6b6b',
    danger: '#ff8787',
    stars: '#ffd43b',
    mission: '#ffa94d',
    success: '#51cf66',
    mapBackground: '#0b0f14',
    mapWater: '#12324a',
    mapBlock: '#1d2633',
    mapPark: '#1b3326',
    mapRoad: '#4c5866',
    mapRoadArterial: '#6b7a8c',
    mapPlayer: '#f8f9fa',
    mapCop: '#ff6b6b',
    mapBorder: 'rgba(255, 255, 255, 0.18)',
  },
  layout: {
    padding: 12,
    minimapSize: 176,
    minimapSizeMobile: 112,
    minimapRange: 280,
    fontSize: 14,
    fontSizeMobile: 12,
    touchTarget: 56,
    stickDeadzone: 0.18,
    missionPanelWidth: 300,
    pagerWidth: 420,
  },
  settings: {
    lang: 'ru',
    volume: 0.7,
    muted: false,
    quality: 'high',
    touch: 'auto',
    hints: true,
  },
  quality: {
    low: { labelKey: 'quality.low', pixelRatio: 1, shadows: false },
    medium: { labelKey: 'quality.medium', pixelRatio: 1.5, shadows: true },
    high: { labelKey: 'quality.high', pixelRatio: 2, shadows: true },
  },
};

/** BCP-47 тег для Intl. Локаль интерфейса и формат чисел связаны. */
export function localeTag(lang: LangCode): string {
  if (lang === 'en') return 'en-US';
  if (lang === 'tr') return 'tr-TR';
  return 'ru-RU';
}
