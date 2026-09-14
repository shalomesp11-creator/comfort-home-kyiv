# COMFORT HOME

Автономно восстановленная публичная версия сайта COMFORT HOME. Проект не загружает изображения, видео или шрифты со старого хостинга: публичные материалы сохранены в `public/`.

## Локальный запуск

```powershell
npm install --legacy-peer-deps
npm run dev
```

Vite покажет локальный адрес сайта в терминале.

## Проверка и production-сборка

```powershell
npm run typecheck
npm run build
```

Результат сборки создаётся в `dist/client` и `dist/server`.

## Маршруты

- `/` — главная;
- `/remonty` — ремонты;
- `/budivnytstvo` — строительство;
- `/dyzain` — дизайн;
- `/portfolio` — портфолио с фильтрами;
- `/kontakty` — контакты.

## Лид-форма

Все CTA для записи, консультации, заявки и расчёта открывают одну модальную форму. Форма содержит имя, телефон, тип услуги и комментарий. Заявка отправляется в Telegram через Netlify Function `/.netlify/functions/lead`; секретные переменные `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` задаются только в окружении Netlify и не входят в клиентскую сборку.

## Публикация

Production-метаданные настроены для `https://www.comforthome.kyiv.ua`, а sitemap и robots определяют домен из текущего запроса. Netlify собирает статические страницы в `dist/client`, а Telegram-обработчик работает как серверная Netlify Function. Секреты хранятся только в production-окружении Netlify.

Подробный итог восстановления и QA находятся в `RESTORATION-REPORT.md`.
