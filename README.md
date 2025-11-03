# CampusConnect - College Resource & Event Management Platform

A full-stack web application that helps college students stay connected with campus events, resources, and mentorship opportunities.

## Features

- **Authentication System**: Complete signup/login with email verification
- **Role-based Access**: Student, Alumni, and Admin roles
- **Dashboard**: Personalized user dashboard
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

### Backend
- Node.js + Express.js
- MongoDB with Mongoose
- JWT Authentication
- Email verification with Nodemailer
- bcryptjs for password hashing

### Frontend
- React.js with Vite
- React Router for navigation
- Context API for state management
- Axios for API calls
- Responsive CSS

## Setup Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/campusconnect
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
CLIENT_URL=http://localhost:3000
```

4. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

### Database Setup

1. Install MongoDB locally or use MongoDB Atlas
2. Update the `MONGODB_URI` in your `.env` file
3. The application will automatically create the database and collections

### Email Configuration

1. Enable 2-factor authentication on your Gmail account
2. Generate an app password for your Gmail account
3. Update `EMAIL_USER` and `EMAIL_PASS` in your `.env` file

## API Endpoints

### Authentication Routes
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/verify-email/:token` - Verify email address
- `GET /api/auth/me` - Get current user profile

## Usage

1. **Sign Up**: Create a new account with email verification
2. **Login**: Access your dashboard after email verification
3. **Dashboard**: View profile and access platform features
4. **Logout**: Securely end your session

## Project Structure

```
CampusConnect/
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── utils/
    │   └── App.jsx
    └── public/
```

## Future Enhancements

- Event management system
- Resource sharing platform
- Project collaboration tools
- Mentorship matching
- Discussion forums
- Real-time notifications
- Admin dashboard

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.