# Telegram-авторизация: сохранённые модули

Перенесено из `example`. Пока авторизация выключена на уровне подключения:
`TelegramProvider`, `AuthResetGuard` и `AuthScreen` не импортируются действующими
layouts и маршрутами. Приложение не делает запросов авторизации и не вызывает SDK.

## Файлы

- `src/lib/telegram.ts` — Telegram SDK, определение среды, инициализация Mini App,
  получение настоящего `initData` и локальный `MOCK_INIT_DATA`.
- `src/lib/telegram-context.tsx` — `TelegramProvider`, `useTelegramContext`,
  клиентские данные пользователя и признак готовности SDK. Эти данные не являются
  подтверждённой авторизацией: подпись `initData` проверяется бэкендом.
- `src/api/client.ts` — Axios-клиент, сохранение/чтение/удаление access token
  в cookie, заголовок Bearer, сброс авторизации при 401/403.
- `src/api/auth/auth.ts` — `POST /auth/telegram`, body `{ initData }`,
  ответ `{ access_token, token_type: "Bearer" }`.
- `src/api/auth/hooks.ts` — мутация TanStack Query `useTelegramAuth`.
- `src/components/AuthResetGuard/index.tsx` — перенесённая проверка токена
  при монтировании и переход на `/`, если токена нет.
- `src/screens/auth/index.tsx` — экран входа; после успеха сохраняет токен
  и переходит на `/`. Старый путь `/main` заменён, потому что в Diony его нет.
- `src/components/QueryProvider/index.tsx` — существующий провайдер TanStack Query,
  повторно переносить его не требуется.
- `.env.local` — локальное значение `NEXT_PUBLIC_MOCK_INIT_DATA`, перенесённое
  из старого проекта; файл игнорируется Git.
- `package.json`, `pnpm-lock.yaml` — зависимости `axios` и `@telegram-apps/sdk`.

## Переменные окружения

```dotenv
NEXT_PUBLIC_API_BASE_URL=<адрес бэкенда с нужным API-префиксом>
NEXT_PUBLIC_MOCK_INIT_DATA=<исходная строка initData для локальной разработки>
```

Мок используется только вне Telegram при `NODE_ENV=development`.
В production вне Telegram `getRawInitData()` возвращает `undefined`.
Скопированная строка не обновляет подпись и дату: бэкенд может отклонить её
как просроченную. Это не автономная имитация успешного входа без бэкенда.
`NEXT_PUBLIC_*` доступно клиенту, это не место для токена бота.

## Подключение в будущем

1. Настроить `NEXT_PUBLIC_API_BASE_URL` и проверить контракт `/auth/telegram`.
2. В `src/app/layout.tsx` подключить `TelegramProvider` вокруг приложения,
   сохранив существующий `QueryProvider`.
3. Создать маршрут входа, например `/auth`, который рендерит `AuthScreen`.
   После входа экран уже направляет пользователя на главную `/`.
4. Перед подключением `AuthResetGuard` изменить его адрес редиректа с `/`
   на новый маршрут входа и подключать только к защищённым маршрутам.
   Сейчас проверка однократная, не является серверной защитой доступа.
5. Согласовать с бэкендом срок жизни токена и обработку 401/403.
   Сейчас сохранено поведение старого проекта: cookie на 24 часа и сброс
   токена на оба статуса; refresh-токен в исходнике отсутствует.

Папка `example` оставлена без изменений и исключена из Git, ESLint и TypeScript.
