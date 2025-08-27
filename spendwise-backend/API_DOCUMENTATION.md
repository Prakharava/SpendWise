# SpendWise API Documentation

## Base URL
`http://localhost:5000/api`

## Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### Authentication

#### Register a New User
- **URL:** `/users`
- **Method:** `POST`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "123456"
  }
  ```
- **Success Response (201):**
  ```json
  {
    "_id": "68890fe4bbff5af720310c6b",
    "name": "John Doe",
    "email": "john@example.com",
    "isAdmin": false,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

#### Login User
- **URL:** `/users/login`
- **Method:** `POST`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "123456"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "_id": "68890fe4bbff5af720310c6b",
    "name": "John Doe",
    "email": "john@example.com",
    "isAdmin": false,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

### User Profile

#### Get User Profile
- **URL:** `/users/profile`
- **Method:** `GET`
- **Access:** Private
- **Success Response (200):**
  ```json
  {
    "_id": "68890fe4bbff5af720310c6b",
    "name": "John Doe",
    "email": "john@example.com",
    "isAdmin": false
  }
  ```

#### Update User Profile
- **URL:** `/users/profile`
- **Method:** `PUT`
- **Access:** Private
- **Request Body (any of the following fields):**
  ```json
  {
    "name": "John Updated",
    "email": "john.updated@example.com",
    "password": "newpassword123"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "_id": "68890fe4bbff5af720310c6b",
    "name": "John Updated",
    "email": "john.updated@example.com",
    "isAdmin": false,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

### Transactions

#### Get All Transactions
- **URL:** `/transactions`
- **Method:** `GET`
- **Access:** Private
- **Query Parameters (optional):**
  - `type`: Filter by type (`income` or `expense`)
  - `category`: Filter by category
  - `startDate`: Start date (YYYY-MM-DD)
  - `endDate`: End date (YYYY-MM-DD)
  - `sort`: Sort field (e.g., `-date` for descending)
  - `limit`: Number of results per page
  - `page`: Page number
- **Success Response (200):**
  ```json
  [
    {
      "_id": "68890fe4bbff5af720310c6c",
      "user": "68890fe4bbff5af720310c6b",
      "description": "Grocery Shopping",
      "amount": 125.75,
      "type": "expense",
      "category": "food",
      "date": "2025-07-29T18:23:00.000Z"
    }
  ]
  ```

#### Add New Transaction
- **URL:** `/transactions`
- **Method:** `POST`
- **Access:** Private
- **Request Body:**
  ```json
  {
    "description": "Salary",
    "amount": 3000,
    "type": "income",
    "category": "salary",
    "date": "2025-07-30"
  }
  ```
- **Success Response (201):**
  ```json
  {
    "_id": "68890fe4bbff5af720310c6d",
    "user": "68890fe4bbff5af720310c6b",
    "description": "Salary",
    "amount": 3000,
    "type": "income",
    "category": "salary",
    "date": "2025-07-30T00:00:00.000Z"
  }
  ```

#### Get Transaction by ID
- **URL:** `/transactions/:id`
- **Method:** `GET`
- **Access:** Private
- **Success Response (200):**
  ```json
  {
    "_id": "68890fe4bbff5af720310c6c",
    "user": "68890fe4bbff5af720310c6b",
    "description": "Grocery Shopping",
    "amount": 125.75,
    "type": "expense",
    "category": "food",
    "date": "2025-07-29T18:23:00.000Z"
  }
  ```

#### Update Transaction
- **URL:** `/transactions/:id`
- **Method:** `PUT`
- **Access:** Private
- **Request Body (any of the following fields):**
  ```json
  {
    "description": "Updated Grocery Shopping",
    "amount": 150.50,
    "type": "expense",
    "category": "groceries",
    "date": "2025-07-29"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "_id": "68890fe4bbff5af720310c6c",
    "user": "68890fe4bbff5af720310c6b",
    "description": "Updated Grocery Shopping",
    "amount": 150.50,
    "type": "expense",
    "category": "groceries",
    "date": "2025-07-29T00:00:00.000Z"
  }
  ```

#### Delete Transaction
- **URL:** `/transactions/:id`
- **Method:** `DELETE`
- **Access:** Private
- **Success Response (200):**
  ```json
  {
    "success": true,
    "data": {}
  }
  ```

#### Get Transaction Summary
- **URL:** `/transactions/summary`
- **Method:** `GET`
- **Access:** Private
- **Query Parameters (optional):**
  - `startDate`: Start date (YYYY-MM-DD)
  - `endDate`: End date (YYYY-MM-DD)
- **Success Response (200):**
  ```json
  {
    "income": {
      "total": 3000,
      "count": 1
    },
    "expense": {
      "total": 276.25,
      "count": 2
    },
    "balance": 2723.75
  }
  ```

#### Get Category-wise Summary
- **URL:** `/transactions/category-summary`
- **Method:** `GET`
- **Access:** Private
- **Query Parameters (optional):**
  - `type`: Filter by type (`income` or `expense`)
  - `startDate`: Start date (YYYY-MM-DD)
  - `endDate`: End date (YYYY-MM-DD)
- **Success Response (200):**
  ```json
  [
    {
      "_id": "salary",
      "total": 3000,
      "count": 1
    },
    {
      "_id": "food",
      "total": 150.50,
      "count": 1
    },
    {
      "_id": "transportation",
      "total": 125.75,
      "count": 1
    }
  ]
  ```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Please include all required fields"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Transaction not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Server error"
}
```

## Data Types

### Transaction
```typescript
{
  _id: string;
  user: string;        // User ID
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;        // ISO date string
  createdAt: string;   // ISO date string
  updatedAt: string;   // ISO date string
}
```

### User
```typescript
{
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;   // ISO date string
  updatedAt: string;   // ISO date string
}
```

## Rate Limiting
- 100 requests per 10 minutes per IP address

## Version
- API Version: 1.0.0
