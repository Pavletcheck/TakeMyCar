// ---------------------------------------------------------------------------
// M6. Тема интерфейса: config/ui.ts → CSS-переменные на :root.
// Все стили HUD/меню/мобилки читают var(--tmc-*), поэтому балансировка
// цветов и размеров идёт в одном файле конфига, а не в CSS и не в коде.
// ---------------------------------------------------------------------------

import type { UiConfig } from '../config/ui';

/** Записывает значения конфига в CSS-переменные документа. */
export function applyTheme(config: UiConfig): void {
  const style = document.documentElement.style;
  const colors = config.colors;
  const layout = config.layout;

  style.setProperty('--tmc-panel', colors.panel);
  style.setProperty('--tmc-border', colors.panelBorder);
  style.setProperty('--tmc-text', colors.text);
  style.setProperty('--tmc-text-dim', colors.textDim);
  style.setProperty('--tmc-accent', colors.accent);
  style.setProperty('--tmc-money', colors.money);
  style.setProperty('--tmc-health', colors.health);
  style.setProperty('--tmc-danger', colors.danger);
  style.setProperty('--tmc-stars', colors.stars);
  style.setProperty('--tmc-mission', colors.mission);
  style.setProperty('--tmc-success', colors.success);
  style.setProperty('--tmc-map-bg', colors.mapBackground);
  style.setProperty('--tmc-map-water', colors.mapWater);
  style.setProperty('--tmc-map-block', colors.mapBlock);
  style.setProperty('--tmc-map-park', colors.mapPark);
  style.setProperty('--tmc-map-road', colors.mapRoad);
  style.setProperty('--tmc-map-arterial', colors.mapRoadArterial);
  style.setProperty('--tmc-map-player', colors.mapPlayer);
  style.setProperty('--tmc-map-cop', colors.mapCop);
  style.setProperty('--tmc-map-border', colors.mapBorder);

  style.setProperty('--tmc-padding', `${layout.padding}px`);
  style.setProperty('--tmc-minimap', `${layout.minimapSize}px`);
  style.setProperty('--tmc-minimap-mobile', `${layout.minimapSizeMobile}px`);
  style.setProperty('--tmc-font', `${layout.fontSize}px`);
  style.setProperty('--tmc-font-mobile', `${layout.fontSizeMobile}px`);
  style.setProperty('--tmc-touch', `${layout.touchTarget}px`);
  style.setProperty('--tmc-mission-width', `${layout.missionPanelWidth}px`);
  style.setProperty('--tmc-pager-width', `${layout.pagerWidth}px`);
}
