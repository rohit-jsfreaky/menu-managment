# Menu Management API

Production-ready REST API for managing menu categories, sub-categories, and items using Node.js, Express, and MongoDB Atlas (or any MongoDB deployment).

## Features

- CRUD for categories, sub-categories, and menu items with strict validation
- Consistent API responses (`success`, `message`, optional `data` / `errors`)
- Inline comments in controllers and middleware explaining key business rules
- Security hardening with Helmet, CORS, express-rate-limit, and request size caps
- Request validation using Joi, reusable middlewares, and MongoDB/Mongoose models

## Tech Stack

- Node.js 18+
- Express.js
- MongoDB with Mongoose ODM
- Joi for schema validation
- Nodemon for local development

## Project Structure

```
├── app.js                # Express app configuration, middleware, routes
├── index.js              # App bootstrap + MongoDB connection
├── config/
│   └── database.js       # Mongoose connection helper
├── controllers/          # Route handlers with inline comments
├── middlewares/          # Error, validation, and utility middleware
├── models/               # Mongoose schemas for Category, SubCategory, Item
├── routes/               # Express routers for each resource
├── utils/                # Shared helpers (response formatter, etc.)
└── validations/          # Joi schemas for request validation
```

## Prerequisites

- Node.js v18 or later (`node -v`)
- MongoDB connection string; create `.env` from the example below

```properties
# .env
MONGO_URL=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority
PORT=4000 # optional override
ENABLE_API_LOGS=false # set to true to force verbose logging in production
```

## Installation & Local Run

```bash
npm install              # installs dependencies
npm run dev              # starts nodemon for local development
# npm start              # optional: runs once with node for production-like mode
```

The API listens on `http://localhost:4000` by default (`PORT` env var overrides).

## API Usage Summary

All endpoints are prefixed with `/api`. JSON requests must send `Content-Type: application/json`.

```json
{
  "success": true,
  "message": "Readable status message",
  "data": {}
}
```

Error example:

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    { "path": "name", "message": "\"name\" is required" }
  ]
}
```

### Categories `/api/categories`

- `POST /` – create category
- `GET /` – list categories
- `GET /detail?id={id}` or `GET /detail?name={name}` – fetch category + sub-categories + items
- `PATCH /:categoryId` – update attributes

### Sub-Categories `/api/subcategories`

- `POST /` – create under a category (inherits tax when omitted)
- `GET /` – list all
- `GET /category/:categoryId` – filter by category
- `GET /detail?id={id}` or `GET /detail?name={name}` (`categoryId` optional) – detailed lookup
- `PATCH /:subCategoryId` – update attributes

### Items `/api/items`

- `POST /` – create under category/sub-category (auto-calculates totals)
- `GET /` – list all
- `GET /category/:categoryId` – filter by category
- `GET /subcategory/:subCategoryId` – filter by sub-category
- `GET /detail?id={id}` or `GET /detail?name={name}` – detailed lookup
- `PATCH /:itemId` – update attributes and totals
- `GET /search?name={term}&limit=20` – partial-name search

Detailed Postman-ready payloads are available in the [API reference cheat sheet](./postman-cheatsheet.md) if you generate one, or use the examples from the scripting notes.

## Testing the API (Postman / curl)

1. **Set up environment** – add `BASE_URL` variable pointing to `http://localhost:4000/api`.
2. **Create a category** – send the payload from the documentation to `POST {{BASE_URL}}/categories`.
3. **Chain requests** – use returned IDs for sub-category and item creation.
4. **Validate rate limiting** – exceed 100 requests in 15 minutes to observe 429 response.

## Error Handling & Logging

- Centralized error middleware returns consistent JSON shape.
- Inline comments in controllers explain branching logic for tax inheritance and pricing.
- Morgan logs HTTP requests in combined format; disable by removing the middleware if necessary.
- Toggle `ENABLE_API_LOGS=true` in the environment when you need verbose error logging in production (e.g., Vercel).

## Deployment Notes

- Set `NODE_ENV=production` to suppress stack traces in responses.
- Ensure MongoDB indexes are created automatically by Mongoose ( unique constraints defined in schemas ).
- Use process manager (PM2, systemd) to run `npm start` in production.
