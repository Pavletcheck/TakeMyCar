# CI-деплой (опционально)

Файл `deploy-workflow.yml` — готовый GitHub Actions workflow для сборки и публикации
на Pages при пуше в `main`.

Сейчас он не подключён: у gh-токена нет scope `workflow`, поэтому GitHub отклоняет
пуш файлов из `.github/workflows/`. Пока используется локальный деплой:

```powershell
npm run deploy
```

## Как включить CI
1. Выдать токену право на workflow:
   ```powershell
   gh auth refresh -s workflow
   ```
2. Скопировать файл на место:
   ```powershell
   New-Item -ItemType Directory -Force .github/workflows
   Copy-Item docs/ci/deploy-workflow.yml .github/workflows/deploy.yml
   ```
3. Закоммитить и запушить. Дальше каждый пуш в `main` будет собирать и деплоить сайт.
4. Убедиться, что Pages source переключён на «GitHub Actions»:
   Settings → Pages → Build and deployment → Source: GitHub Actions.

До включения CI источник Pages — ветка `gh-pages`.
