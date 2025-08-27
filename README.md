# SpendWise - Personal Finance Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16.x-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.4+-47A248?logo=mongodb)](https://www.mongodb.com/)

A modern, full-stack web application for tracking personal finances, managing expenses, and gaining insights into spending habits.

![SpendWise Dashboard](https://via.placeholder.com/1200x600.png?text=SpendWise+Dashboard+Preview)

## ✨ Features

- **Dashboard Overview**
  - Real-time financial summary
  - Recent transactions
  - Quick add expense/income

- **Transaction Management**
  - Add, edit, and delete transactions
  - Categorize expenses
  - Add notes and attachments
  - Filter and search functionality

- **Analytics & Reports**
  - Visual spending breakdown
  - Monthly/Yearly trends
  - Category-wise analysis
  - Export reports (CSV/PDF)

- **User Experience**
  - Responsive design (mobile, tablet, desktop)
  - Dark/Light theme
  - Intuitive UI/UX with Tailwind CSS
  - Keyboard shortcuts

- **Security**
  - JWT Authentication
  - Password hashing with bcrypt
  - Protected routes
  - Input validation

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
   npm start
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

## 🧪 Testing

### Backend Tests
```bash
cd spendwise-backend
npm test
```

### Frontend Tests
```bash
cd spendwise-client
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Set `NODE_ENV=production` in your environment
2. Configure a process manager (PM2, Forever, etc.)
3. Set up a reverse proxy (Nginx, Apache)
4. Configure SSL (Let's Encrypt)

### Frontend Deployment
1. Build the production bundle:
   ```bash
   cd spendwise-client
   npm run build
   ```
2. Deploy the `build` folder to your hosting service (Vercel, Netlify, etc.)

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please make sure to update tests as appropriate.

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

Prakhar Srivastava - [@your_twitter](https://twitter.com/your_twitter) - your.email@example.com

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
