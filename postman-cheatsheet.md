# Postman Cheat Sheet

Base URL: `http://localhost:4000/api`

## Categories

### Create Category `POST /categories`
```json
{
  "name": "Beverages",
  "image": "https://cdn.example.com/images/beverages.png",
  "description": "Hot and cold drinks",
  "taxApplicability": true,
  "tax": 5,
  "taxType": "GST"
}
```

### Get All Categories `GET /categories`
No body.

### Get Category Details `GET /categories/detail`
- By ID: `?id=<categoryId>`
- By Name: `?name=Snacks`

### Update Category `PATCH /categories/:categoryId`
```json
{
  "description": "Updated description",
  "taxApplicability": false
}
```

## Sub-Categories

### Create Sub-Category `POST /subcategories`
```json
{
  "categoryId": "<categoryId>",
  "name": "Tea",
  "image": "https://cdn.example.com/images/tea.png",
  "description": "Tea selections",
  "taxApplicability": true,
  "tax": 7
}
```

### Get All Sub-Categories `GET /subcategories`
No body.

### Get Sub-Categories by Category `GET /subcategories/category/:categoryId`
No body.

### Get Sub-Category Details `GET /subcategories/detail`
- By ID: `?id=<subCategoryId>`
- By Name: `?name=Tea&categoryId=<categoryId>`

### Update Sub-Category `PATCH /subcategories/:subCategoryId`
```json
{
  "description": "Iced and hot tea options",
  "taxApplicability": false
}
```

## Items

### Create Item `POST /items`
```json
{
  "categoryId": "<categoryId>",
  "subCategoryId": "<subCategoryId>",
  "name": "Masala Chai",
  "image": "https://cdn.example.com/images/masala-chai.png",
  "description": "Spiced Indian tea",
  "taxApplicability": true,
  "tax": 8,
  "baseAmount": 120,
  "discount": 10
}
```

### Get All Items `GET /items`
No body.

### Get Items by Category `GET /items/category/:categoryId`
No body.

### Get Items by Sub-Category `GET /items/subcategory/:subCategoryId`
No body.

### Get Item Details `GET /items/detail`
- By ID: `?id=<itemId>`
- By Name: `?name=Masala%20Chai`

### Update Item `PATCH /items/:itemId`
```json
{
  "name": "Masala Chai (Large)",
  "baseAmount": 150,
  "discount": 15,
  "taxApplicability": true,
  "tax": 10
}
```

### Search Items `GET /items/search`
- Query: `?name=chai&limit=10`

## Headers

Set `Content-Type: application/json` for all POST/PATCH requests.

## Tips

- Use environment variable `{{BASE_URL}}` in Postman for easier switching between environments.
- Copy responses for integration tests or documentation.
- Rate limit: 100 requests per 15 minutes per IP.
