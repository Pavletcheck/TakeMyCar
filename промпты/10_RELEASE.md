# 10 — Релиз на GitHub Pages (release)

## Миссия
Каждый завершённый этап автоматически оказывается играбельным по публичной ссылке.
Никаких «потом задеплоим».

## Репозиторий
- GitHub: `Pavletcheck/TakeMyCar` (публичный — бесплатные Pages).
- Публичный URL: `https://pavletcheck.github.io/TakeMyCar/`
- Ветка релиза: `main`. Каждый пуш в `main` → сборка → деплой.

## Обязательные файлы
- `vite.config.ts`:
  ```ts
  export default defineConfig({
    base: process.env.VITE_BASE ?? '/TakeMyCar/',
    build: { target: 'es2022', assetsInlineLimit: 0 }
  });
  ```
- `.github/workflows/deploy.yml` — Node 22, `npm ci`, `npm run build`,
  `actions/configure-pages` (enablement: true), `upload-pages-artifact`, `deploy-pages`.
- `dist/404.html` — копия `index.html` на случай прямых ссылок (шаг в workflow).
- Права workflow: `pages: write`, `id-token: write`; concurrency `pages`.

## Процедура после каждого этапа (M1…M9)
1. `npm run typecheck && npm run build` — зелёные.
2. Обновить версию в `package.json` (semver: M1 → 0.1.0 и т.д.).
3. Записать `docs/releases/M<N>.md`: что нового, известные проблемы, ссылка.
4. Коммит `release: M<N> — <кратко>` и пуш в `main`.
5. Дождаться зелёного Actions (`gh run watch`), открыть URL.
6. Смоук в браузере: загрузка, управление, отсутствие ошибок в консоли.
7. Отправить заказчику ссылку и 2–3 скриншота.

## Проверка живого сайта
```bash
curl -I https://pavletcheck.github.io/TakeMyCar/
gh run list --workflow=deploy.yml --limit 3
```
Ожидаемо: HTTP 200, последний run — success, в консоли нет 404 по ассетам
(частая ошибка — неверный `base`).

## Откат
- Вернуться к предыдущему тегу/коммиту, запустить workflow вручную
  (`gh workflow run deploy.yml`), либо `git revert` релизного коммита.
- Тег на каждый этап: `git tag m1 && git push --tags`.

## Критерий приёмки
- После каждого этапа URL открывается на десктопе и телефоне.
- Ассеты грузятся без 404, игра стартует с первого экрана.
- В `docs/releases/` есть запись с версией и ссылкой.

## Не делать
- Не пушить секреты и ключи.
- Не деплоить `node_modules`, `outputs`, `.blend`, `*.blend1`.
- Не оставлять красный workflow «на потом».
