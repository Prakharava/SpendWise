# SpendWise - Personal Expense Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application for tracking personal expenses and visualizing spending patterns.

## Features

- **User Authentication**
  - Secure user registration and login
  - JWT-based authentication
  - Protected routes

- **Expense Management**
  - Add, edit, and delete transactions
  - Categorize expenses
  - Track income and expenses

- **Analytics Dashboard**
  - Visualize spending by category
  - Monthly expense trends
  - Income vs. expenses comparison
  - Custom date range filtering

- **Responsive Design**
  - Works on desktop and mobile devices
  - Modern UI with Tailwind CSS

## Tech Stack

- **Frontend**: React.js, Redux, React Router, Chart.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Deployment**: (To be configured)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Prakharava/SpendWise.git
   cd SpendWise
   ```

2. **Install backend dependencies**
   ```bash
   cd spendwise-backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../spendwise-client
   npm install
   ```

4. **Environment Setup**
   - Create a `.env` file in the `spendwise-backend` directory:
     ```
     PORT=5000
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     NODE_ENV=development
     ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd spendwise-backend
   npm run dev
   ```

2. **Start the frontend development server**
   ```bash
   cd ../spendwise-client
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
SpendWise/
├── spendwise-backend/     # Backend (Node.js/Express)
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── .env              # Environment variables
│   └── server.js         # Entry point
│
└── spendwise-client/     # Frontend (React)
    ├── public/           # Static files
    └── src/
        ├── assets/       # Images, fonts, etc.
        ├── components/   # Reusable UI components
        ├── context/      # React context providers
        ├── pages/        # Page components
        ├── styles/       # Global styles
        └── App.js        # Main component
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Create React App](https://github.com/facebook/create-react-app)
- [Chart.js](https://www.chartjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)

---

Developed with ❤️ by [Prakhar Srivastava](https://github.com/Prakharava)
