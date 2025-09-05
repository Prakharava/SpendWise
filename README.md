# SpendWise - Personal Finance Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16.x-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-47A248?logo=mongodb)](https://www.mongodb.com/)

A modern, full-stack web application for tracking personal finances, managing expenses, and gaining insights into spending habits.


## ✨ Features

- **Dashboard Overview**
  - Real-time balance with totals for income and expenses
  - Recent transactions list with categories and notes
  - Quick-add for income/expense

- **Transaction Management**
  - Add, edit, and delete transactions (income and expenses)
  - Categorize transactions (e.g., Food, Rent, Salary, etc.)
  - Optional notes to describe transactions
  - Filter and basic search functionality

- **Analytics & Reports**
  - Visual spending breakdown by category
  - Monthly trends of income vs expenses
  - Category-wise charts (doughnut and line charts)

- **User Experience**
  - Responsive design (mobile, tablet, desktop)
  - Dark/Light theme throughout
  - Polished UI/UX with Tailwind CSS, Headless UI, and Heroicons

- **Security**
  - JWT authentication
  - Password hashing with bcrypt
  - Protected routes (frontend guards + backend middleware)
  - Input validation on server

## 🚀 Tech Stack

### Frontend
- **Framework**: React 18 with Hooks
- **State Management**: React Context API
- **Routing**: React Router v6
- **UI Components**: Headless UI, Heroicons
- **Styling**: Tailwind CSS
- **Data Visualization**: Chart.js, React Chart.js 2
- **Form Handling**: React Hook Form
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Morgan, Winston
- **Environment Management**: dotenv

## 🗄️ Data Storage in MongoDB (MongoDB Compass)

All persisted data is stored in MongoDB. You can view and manage it using MongoDB Compass. Typical collections and document shapes:

- __Database__: `spendwise` (or the database name in your `MONGODB_URI`)

- __Collection__: `users`
  - Example document
    ```json
    {
      "_id": "ObjectId(...)",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "password": "$2b$10$hash...", // bcrypt hashed
      "createdAt": "2025-09-05T00:00:00.000Z",
      "updatedAt": "2025-09-05T00:00:00.000Z"
    }
    ```
  - Indexes: unique index on `email`

- __Collection__: `transactions`
  - Stores both income and expense items.
  - Example document
    ```json
    {
      "_id": "ObjectId(...)",
      "user": "ObjectId(<users._id>)",
      "type": "expense", // or "income"
      "amount": 1299.5,
      "category": "Food",
      "note": "Dinner with friends",
      "date": "2025-09-05T00:00:00.000Z",
      "createdAt": "2025-09-05T00:00:00.000Z",
      "updatedAt": "2025-09-05T00:00:00.000Z"
    }
    ```
  - Common indexes: `{ user: 1, date: -1 }`, `{ user: 1, category: 1 }`

In MongoDB Compass, you’ll see these collections under your database. Income and expense data are differentiated by the `type` field within `transactions`. Authentication data (hashed passwords, emails, names) is stored in the `users` collection.

## 🛠️ Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account or local MongoDB instance

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/Prakharava/SpendWise.git
   cd SpendWise
   ```

2. **Backend Setup**
   ```bash
   cd spendwise-backend
   npm install
   cp .env.example .env
   # Update .env with your configuration
   ```

3. **Frontend Setup**
   ```bash
   cd ../spendwise-client
   npm install
   cp .env.example .env
   # Update .env with your configuration
   ```

4. **Start Development Servers**
   ```bash
   # In spendwise-backend
   npm run dev

   # In a new terminal, from spendwise-client
   npm run dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/api-docs (if using Swagger)

## 🔧 Environment Variables

### Backend (spendwise-backend/.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Security
RATE_LIMIT_WINDOW_MS=15 * 60 * 1000  # 15 minutes
RATE_LIMIT_MAX=100

# Logging
LOG_LEVEL=info
```

### Frontend (spendwise-client/.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_ANALYTICS_ID=your_ga_id  # Optional
```

## 📁 Project Structure

```
SpendWise/
├── spendwise-backend/          # Backend (Node.js/Express)
│   ├── config/                # Configuration files
│   │   ├── db.js             # Database configuration
│   │   ├── passport.js       # Passport strategies
│   │   └── swagger.js        # API documentation
│   │
│   ├── controllers/           # Route controllers
│   │   ├── auth.controller.js
│   │   ├── transaction.controller.js
│   │   └── user.controller.js
│   │
│   ├── middleware/            # Custom middleware
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── validation.middleware.js
│   │
│   ├── models/                # Mongoose models
│   │   ├── Transaction.js
│   │   └── User.js
│   │
│   ├── routes/                # API routes
│   │   ├── auth.routes.js
│   │   ├── transaction.routes.js
│   │   └── user.routes.js
│   │
│   ├── services/              # Business logic
│   ├── utils/                 # Utility functions
│   ├── .env                   # Environment variables
│   └── server.js              # Entry point
│
└── spendwise-client/          # Frontend (React)
    ├── public/                # Static files
    │   ├── index.html
    │   ├── favicon.ico
    │   └── assets/
    │
    └── src/
        ├── assets/            # Images, fonts, etc.
        │   └── images/
        │
        ├── components/         # Reusable UI components
        │   ├── common/
        │   ├── layout/
        │   └── ui/
        │
        ├── context/           # React context providers
        │   └── AuthContext.jsx
        │
        ├── hooks/             # Custom React hooks
        │   └── useAuth.js
        │
        ├── pages/             # Page components
        │   ├── Dashboard/
        │   ├── Analytics/
        │   ├── Transactions/
        │   ├── Settings/
        │   └── Auth/
        │
        ├── services/          # API services
        │   ├── api.js
        │   └── auth.service.js
        │
        ├── styles/            # Global styles
        │   └── index.css
        │
        ├── utils/             # Utility functions
        ├── App.jsx            # Main component
        └── main.jsx           # Entry point
```

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

Prakhar Srivastava - prakhar.srivastava_cs22@gla.ac.in

Project Link: [https://github.com/Prakharava/SpendWise](https://github.com/Prakharava/SpendWise)

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Express](https://expressjs.com/)
- [Chart.js](https://www.chartjs.org/)
- [Heroicons](https://heroicons.com/)
- [date-fns](https://date-fns.org/)

## 📚 Resources

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Express Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

Developed with ❤️ by [Prakhar Srivastava](https://github.com/Prakharava)
