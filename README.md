# SynopsisPro - AI Travel Planner

SynopsisPro is an AI-powered travel planning web application that helps users create personalized trip itineraries based on their preferences and constraints.

## Features

- **User Authentication**: Secure signup/login with email verification
- **Password Recovery**: OTP-based password reset via email
- **Trip Planning**: Detailed trip preference forms with AI-powered itinerary generation
- **User Dashboard**: Manage trips and view planning history
- **Responsive Design**: Clean, modern web interface

## Tech Stack

### Backend
- **Node.js** with **Express.js**
- **MongoDB Atlas** for database
- **Nodemailer** for email services
- **Express Session** with MongoDB store

### Frontend
- **Express.js** with **EJS** templating
- **HTML/CSS** for styling
- **JavaScript** for client-side interactions

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account
- Gmail account (for email features)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SynopsisPro
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

4. **Configure Email Service** (Optional)
   - Edit `backend/utils/mailer.js`
   - Add your Gmail credentials:
     ```javascript
     auth: {
       user: "your-email@gmail.com",
       pass: "your-app-specific-password"
     }
     ```

## Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm start
   ```
   - Backend runs on `http://localhost:2376`

2. **Start Frontend Server** (in a new terminal)
   ```bash
   cd frontend
   npm start
   ```
   - Frontend runs on `http://localhost:9876`

3. **Access the Application**
   - Open browser: `http://localhost:9876`

## Usage

1. **Sign Up**: Create a new account with email verification
2. **Log In**: Access your dashboard
3. **Create Trip**: Fill out detailed trip preferences
4. **Generate Itinerary**: Get AI-powered travel recommendations

## Project Structure

```
SynopsisPro/
├── backend/                    # Backend API Server
│   ├── app.js                 # Main server configuration
│   ├── controllers/           # Business logic controllers
│   ├── models/                # Database models
│   ├── routers/               # API route handlers
│   └── utils/                 # Utility functions
├── frontend/                   # Frontend Server & Views
│   ├── start.js               # Frontend server
│   ├── views/                 # EJS templates
│   ├── public/                # Static files
│   └── services/              # API service functions
├── .gitignore                 # Git ignore rules
└── README.md                  # Project documentation
```

## API Endpoints

### Authentication
- `POST /api/signup` - User registration
- `POST /api/login` - User login
- `POST /api/forget` - Password recovery request
- `POST /api/otp` - OTP verification
- `POST /api/newpass/:id` - Password reset

### Trip Planning
- `POST /api/input` - Get user data for trip form
- `POST /api/generatetrip` - Generate trip itinerary

## Development Status

- ✅ User authentication system
- ✅ Password recovery with OTP
- ✅ Trip data collection forms
- ⚠️ AI itinerary generation (in progress)
- ❌ Trip storage and retrieval

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the ISC License.

## Security Notes

- Environment variables should be used for sensitive data
- Password hashing should be implemented
- Database credentials should not be hardcoded
- Consider implementing rate limiting and input validation