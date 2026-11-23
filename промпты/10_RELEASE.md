# 10 — Релиз на GitHub Pages (release)

## Миссия
Каждый завершённый этап автоматически оказывается играбельным по публичной ссылке.
Никаких «потом задеплоим».

## Репозиторий
- GitHub: `Pavletcheck/TakeMyCar` (публичный — бесплатные Pages).
- Публичный URL: `https://pavletcheck.github.io/TakeMyCar/`
- `main` — исходники. `gh-pages` — собранный `dist` (создаётся `gh-pages`).
- Настройка Pages: source = ветка `gh-pages`, папка `/`.

## Обязательные файлы
- `vite.config.ts`: `base: process.env.VITE_BASE ?? '/TakeMyCar/'` в production.
- `package.json`: скрипт `"deploy": "npm run build && gh-pages -d dist --dotfiles"`.
- `.gitignore`: `dist/`, `node_modules/`, `outputs/`.

## Процедура после каждого этапа (M1…M9)
1. `npm run typecheck && npm run build` — зелёные.
2. Обновить версию в `package.json` (M1 → 0.1.0 и т.д.).
3. Записать `docs/releases/M<N>.md`: что нового, известные проблемы, ссылка.
4. `npm run deploy` — публикация в `gh-pages`.
5. Проверить, что Pages собрался: `gh api repos/Pavletcheck/TakeMyCar/pages/builds/latest`.
6. Открыть URL в браузере: HTTP 200, нет 404 ассетов, игра стартует, консоль чистая.
7. Коммит `release: M<N> — <кратко>`, пуш в `main`, тег `m<N>`.
8. Отправить заказчику ссылку и 2–3 скриншота.

## Проверка живого сайта
```powershell
Invoke-WebRequest -Uri 'https://pavletcheck.github.io/TakeMyCar/' -UseBasicParsing | Select-Object StatusCode
gh api repos/Pavletcheck/TakeMyCar/pages/builds/latest --jq '.status'
```
Частая ошибка — неверный `base`: ассеты дают 404. Проверять `<script src>` в исходнике страницы.

## CI (опционально)
Готовый workflow лежит в `docs/ci/deploy-workflow.yml`.
Он включится, когда у gh-токена появится scope `workflow`:
```powershell
gh auth refresh -s workflow
# затем скопировать файл в .github/workflows/deploy.yml и запушить
```
До этого деплой идёт локально командой `npm run deploy` — это штатный путь.

## Откат
- `git checkout <предыдущий тег> -- .` и `npm run deploy`, либо
  `git revert <релизный коммит>` + повторный деплой.
- Тег на каждый этап: `git tag m<N> && git push --tags`.

## Критерий приёмки
- После каждого этапа URL открывается на десктопе и телефоне.
- Ассеты грузятся без 404, игра стартует с первого экрана.
- В `docs/releases/` есть запись с версией и ссылкой.

## Не делать
- Не пушить секреты и ключи.
- Не деплоить `node_modules`, `outputs`, `.blend`, `*.blend1`.
- Не оставлять красный деплой «на потом».
