# Практическая работа № 6 — GraphQL API «Библиотека»

## Бизнес-задача
Каталог книг и авторов: чтение, фильтрация, добавление книги/автора и изменение доступности книги.

## Стек
Node.js, Express, GraphQL.js, express-graphql, GraphiQL, HTML/CSS/JavaScript.

## Требования
Node.js 18+ и npm.

## Запуск
```bash
npm install
npm start
```
Откройте клиент: http://localhost:1234, GraphiQL: http://localhost:1234/graphql, проверка сервера: http://localhost:1234/health.

Данные хранятся в массивах JavaScript в памяти процесса и сбрасываются после перезапуска сервера. Это учебный прототип, соответствующий демонстрации тестовых массивов в задании.

## Структура
- `src/index.js` — Express и единственная GraphQL-точка `/graphql`.
- `src/schema.js` — типы `Book`/`Author`, корневые `Query` и `Mutation`, резольверы.
- `src/data.js` — тестовые данные.
- `public/index.html` — веб-клиент.
- `public/client.js` — GraphQL-запросы через POST.
- `package.json` — зависимости и команды запуска.

## Запросы GraphiQL
Список книг и авторов:
```graphql
query { books { id name author { name } } }
```
Поиск:
```graphql
query { books(search: "Мастер") { name genre } }
```
Добавление:
```graphql
mutation { addBook(id: "b4", name: "Новая книга", genre: "Фантастика", authorId: "a1", publishedYear: 2024) { id name author { name } } }
```
Изменение доступности:
```graphql
mutation { setBookAvailability(id: "b1", available: false) { id name available } }
```
