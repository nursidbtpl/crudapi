# CRUD API

A simple and robust CRUD (Create, Read, Update, Delete) API built with Express.js for managing items.

## Features

- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Input validation
- ✅ Error handling
- ✅ Filtering and search capabilities
- ✅ CORS enabled
- ✅ Security headers with Helmet
- ✅ Request logging with Morgan
- ✅ RESTful API design
- ✅ JSON responses

## Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in the `PORT` environment variable).

## API Endpoints

### Base URL
```
http://localhost:3000/api
```

### 1. Get API Information
- **GET** `/`
- **Description**: Get API information and available endpoints
- **Response**:
  ```json
  {
    "message": "Welcome to the CRUD API",
    "version": "1.0.0",
    "endpoints": {
      "GET /api/items": "Get all items",
      "GET /api/items/:id": "Get item by ID",
      "POST /api/items": "Create new item",
      "PUT /api/items/:id": "Update item by ID",
      "DELETE /api/items/:id": "Delete item by ID"
    }
  }
  ```

### 2. Get All Items
- **GET** `/api/items`
- **Description**: Retrieve all items with optional filtering
- **Query Parameters**:
  - `category` (string): Filter by category
  - `minPrice` (number): Filter by minimum price
  - `maxPrice` (number): Filter by maximum price
  - `search` (string): Search in name and description
- **Example**: `/api/items?category=electronics&minPrice=50&search=sample`
- **Response**:
  ```json
  {
    "success": true,
    "count": 3,
    "data": [
      {
        "id": 1,
        "name": "Sample Item 1",
        "description": "This is a sample item",
        "category": "electronics",
        "price": 99.99,
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
  ```

### 3. Get Item by ID
- **GET** `/api/items/:id`
- **Description**: Retrieve a specific item by its ID
- **Parameters**: `id` (number) - Item ID
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "name": "Sample Item 1",
      "description": "This is a sample item",
      "category": "electronics",
      "price": 99.99,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

### 4. Create New Item
- **POST** `/api/items`
- **Description**: Create a new item
- **Request Body**:
  ```json
  {
    "name": "New Item",
    "description": "Description of the new item",
    "category": "electronics",
    "price": 149.99
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Item created successfully",
    "data": {
      "id": 4,
      "name": "New Item",
      "description": "Description of the new item",
      "category": "electronics",
      "price": 149.99,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

### 5. Update Item
- **PUT** `/api/items/:id`
- **Description**: Update an existing item
- **Parameters**: `id` (number) - Item ID
- **Request Body**:
  ```json
  {
    "name": "Updated Item Name",
    "description": "Updated description",
    "category": "books",
    "price": 29.99
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Item updated successfully",
    "data": {
      "id": 1,
      "name": "Updated Item Name",
      "description": "Updated description",
      "category": "books",
      "price": 29.99,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T01:00:00.000Z"
    }
  }
  ```

### 6. Delete Item
- **DELETE** `/api/items/:id`
- **Description**: Delete an item by its ID
- **Parameters**: `id` (number) - Item ID
- **Response**:
  ```json
  {
    "success": true,
    "message": "Item deleted successfully",
    "data": {
      "id": 1,
      "name": "Deleted Item",
      "description": "This item was deleted",
      "category": "electronics",
      "price": 99.99,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Name is required",
    "Price must be a valid positive number"
  ]
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "message": "Item not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Something went wrong!",
  "error": "Internal server error"
}
```

## Testing with cURL

### Get all items
```bash
curl -X GET http://localhost:3000/api/items
```

### Get item by ID
```bash
curl -X GET http://localhost:3000/api/items/1
```

### Create new item
```bash
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Item",
    "description": "A test item",
    "category": "test",
    "price": 25.99
  }'
```

### Update item
```bash
curl -X PUT http://localhost:3000/api/items/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Test Item",
    "description": "An updated test item",
    "category": "updated",
    "price": 35.99
  }'
```

### Delete item
```bash
curl -X DELETE http://localhost:3000/api/items/1
```

## Data Model

Each item has the following structure:

```javascript
{
  id: number,           // Unique identifier (auto-generated)
  name: string,         // Item name (required)
  description: string,  // Item description (required)
  category: string,     // Item category (required)
  price: number,        // Item price (required, must be positive)
  createdAt: string,    // ISO timestamp (auto-generated)
  updatedAt: string     // ISO timestamp (auto-updated)
}
```

## Technologies Used

- **Express.js** - Web framework
- **CORS** - Cross-Origin Resource Sharing
- **Helmet** - Security headers
- **Morgan** - HTTP request logger
- **Node.js** - Runtime environment

## Development

### Project Structure
```
yeasty-pink/
├── index.js          # Main application file
├── package.json      # Dependencies and scripts
├── README.md         # Documentation
└── node_modules/     # Dependencies
```

### Adding Database Support

This API currently uses in-memory storage. To add database support:

1. Install a database driver (e.g., `mongoose` for MongoDB, `pg` for PostgreSQL)
2. Replace the in-memory `items` array with database operations
3. Add connection configuration
4. Update the helper functions to use database queries

### Environment Variables

You can configure the following environment variables:

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode (development/production)

## License

ISC 