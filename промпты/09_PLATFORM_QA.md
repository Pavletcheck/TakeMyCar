# 09 — Платформы и QA (platform, qa)

## Миссия
Один билд — три площадки: обычный браузер, Яндекс Игры (основная), VK Игры (адаптер).
Плюс контроль качества и производительности.

## Адаптер платформы
`src/app/platform/`:
```ts
interface PlatformAdapter {
  init(): Promise<void>;
  ready(): void;                 // сообщить платформе, что игра загрузилась
  gameplayStart(): void;
  gameplayStop(): void;
  showFullscreenAd(): Promise<void>;
  showRewardedAd(): Promise<boolean>;
  save(data: unknown): Promise<void>;
  load(): Promise<unknown>;
  getLocale(): 'ru'|'en'|'tr';
  haptic(type: 'light'|'heavy'): void;
}
```
Реализации: `WebAdapter` (no-op), `YandexAdapter`, `VKAdapter`. Выбор — по hostname/флагу,
ленивая загрузка SDK, чтобы обычный браузер не тянул лишнее.

## Яндекс Игры
- SDK v2 подключается скриптом с домена Яндекса в `index.html` (единственное разрешённое
  внешнее подключение — только на платформе).
- `YaGames.init()` → `features.LoadingAPI.ready()` после загрузки ассетов.
- `features.GameplayAPI.start()/stop()` на входе/выходе в геймплей и на паузах.
- События `game_api_pause` / `game_api_resume` — обязательно ставить игру на паузу.
- Реклама: `adv.showFullscreenAdv` (между миссиями, с кулдауном), `adv.showRewardedAdv`
  (доп. жизнь/ремонт) — без принудительных вставок в критичный момент.
- Сохранения: `ysdk.getPlayer()` + `setData/getData`, фолбэк в localStorage.
- Язык: `ysdk.environment.i18n.lang` → ru/en/tr.
- Требования: только локальные ассеты, HTTPS, мобильная адаптация, без внешних ссылок.

## VK Игры
- `@vkontakte/vk-bridge`, `VKWebAppInit` до старта.
- Нативная реклама `VKWebAppShowNativeAds`, `VKWebAppShowBannerAd` — по правилам VK.
- `VKWebAppStorageSet/Get` для сохранений, `VKWebAppGetUserInfo` для профиля.
- Безопасная зона и мобильная вёрстка; проверка в iframe VK.

## Сборка и модерация
- Всё в бандле, без CDN, без запросов к сторонним API.
- Архив < 100 МБ, gzip-бандл < 25 МБ.
- Возрастной рейтинг 12+/16+: стилизованное насилие, без крови/наркотиков/брендов.
- Скриншоты и описание без слова GTA и чужих IP.

## QA
- Матрица: Chrome/Firefox/Safari (desktop), Android Chrome, iOS Safari.
- Смоук: загрузка → меню → игра → миссия → пауза → сохранение → перезагрузка.
- Производительность: fps, frame time, draw calls, память; 30-минутный соак без утечек.
- Баг-репорт: шаги, ожидание, факт, сборка/коммит, устройство, скрин/лог.
- Автотесты: Playwright-смоук на загрузку канваса и отсутствие ошибок в консоли.

## Критерий приёмки
- Билд запускается во всех трёх окружениях, SDK не ломает обычный браузер.
- Пауза/резюм и реклама работают по правилам платформ.
- QA-чеклист пройден, критические баги закрыты.
