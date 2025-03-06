# Shop Management API Documentation

## Base URL 
http://localhost:3000/api

## Authentication
All endpoints except `/auth/login` and `/auth/register` require JWT authentication.

Include the JWT token in the Authorization header:

Authorization: Bearer <your_jwt_token>

## API Endpoints

### 1. Authentication

#### Register
POST /auth/register
Content-Type: application/json
{
"username": "shopkeeper",
"password": "secure_password"
}

#### Login
POST /auth/login
Content-Type: application/json

{
  "username": "shopkeeper",
  "password": "secure_password"
}

### 2. Items

#### List Items
GET /items?page=1&limit=10

#### Create Item
POST /items
Content-Type: application/json

{
  "name": "Product Name",
  "price": 19.99,
  "category": "Category",
  "stock": 100
}

#### Update Item
PUT /items/:id
Content-Type: application/json

{
  "name": "Updated Name",
  "price": 24.99,
  "category": "Category",
  "stock": 150
}

#### Delete Item
DELETE /items/:id

### 3. Transactions

#### Create Transaction
POST /transactions
Content-Type: application/json

{
  "items": [
    {
      "item_id": 1,
      "quantity": 2
    }
  ],
  "customer_id": 1  // optional
}

#### Get Receipt
GET /transactions/:id/receipt

#### List Transactions
GET /transactions?page=1&limit=10&start_date=2024-01-01&end_date=2024-12-31&customer_id=1

### 4. Customers

#### Create Customer
POST /customers
Content-Type: application/json

{
  "name": "Customer Name",
  "phone": "1234567890",
  "email": "customer@example.com"
}

#### Get Customer Details
GET /customers/:id

#### Search Customers
GET /customers?search=name&page=1&limit=10

### 5. Analytics

#### Daily Sales
GET /analytics/daily?start_date=2024-01-01&end_date=2024-01-31

#### Best Sellers
GET /analytics/best-sellers?limit=10&period=30

#### Category Sales
GET /analytics/category-sales?start_date=2024-01-01&end_date=2024-01-31

#### Revenue Trends
GET /analytics/revenue-trends?period=weekly

#### Stock Alerts
GET /analytics/stock-alerts?threshold=10

### 6. Data Export

#### Export Sales
GET /analytics/export/sales?start_date=2024-01-01&end_date=2024-01-31
Downloads a CSV file with transaction details.

#### Export Inventory
GET /analytics/export/inventory
Downloads a CSV file with current inventory status.

## Response Formats

### Success Response
{
  "status": "success",
  "data": {
    // Response data
  }
}

### Error Response
{
  "status": "error",
  "message": "Error description"
}

## Common HTTP Status Codes

| Code | Description |
|------|-------------|
| 200  | Success |
| 201  | Created |
| 400  | Bad Request |
| 401  | Unauthorized |
| 403  | Forbidden |
| 404  | Not Found |
| 500  | Server Error |

## Pagination
Endpoints supporting pagination accept:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

Example paginated response:
{
  "status": "success",
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "pages": 10
    }
  }
}
