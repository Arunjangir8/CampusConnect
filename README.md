# CampusConnect - Complete Full-Stack Platform

A comprehensive college resource and event management platform built with modern web technologies.

## 🚀 Features

### Authentication & Authorization
- ✅ Student/Alumni/Admin registration with email verification
- ✅ JWT-based authentication with role-based access control
- ✅ Secure password hashing with bcrypt

### Event Management
- ✅ Create, view, and manage campus events
- ✅ RSVP functionality with attendance tracking
- ✅ Event categorization (Technical, Cultural, Sports, Academic)
- ✅ Search and filter events by category and date

### Resource Library
- ✅ Upload and download study materials
- ✅ File support for PDF, DOC, PPT, images
- ✅ Search and filter resources by subject
- ✅ Download tracking and analytics

### Project Collaboration
- ✅ Create and join collaborative projects
- ✅ Skill-based project matching
- ✅ Project status management (Open, In Progress, Completed)
- ✅ Team member management

### Mentorship System
- ✅ Students can request mentorship from alumni
- ✅ Alumni can accept/decline mentorship requests
- ✅ Status tracking (Pending, Accepted, Completed)

### Discussion Forums
- ✅ Department-wise discussion threads
- ✅ Comment system with real-time updates
- ✅ Upvoting system for popular discussions
- ✅ Search and filter discussions

### Modern UI/UX
- ✅ Responsive design with Tailwind CSS
- ✅ Classic, professional interface
- ✅ Mobile-first approach
- ✅ Smooth animations and transitions

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + bcrypt
- **File Storage**: Cloudinary
- **Email**: Nodemailer
- **Validation**: express-validator

### Frontend
- **Framework**: React.js 18
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: Context API
- **Build Tool**: Vite

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- Cloudinary account (for file uploads)
- Gmail account (for email verification)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Capstone
```

### 2. Backend Setup

```bash
cd backend
npm install
```

### 3. Environment Configuration

Create `.env` file in the backend directory:
```env
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/campusconnect
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Seed the database
npx prisma db seed
```

### 5. Start Backend Server

```bash
npm run dev
```
Backend will run on `http://localhost:5000`

### 6. Frontend Setup

```bash
cd ../frontend
npm install
```

### 7. Start Frontend Development Server

```bash
npm run dev
```
Frontend will run on `http://localhost:3000`

## 📱 Usage

### For Students:
1. **Sign Up** with student role and verify email
2. **Browse Events** and RSVP to interesting ones
3. **Access Resources** uploaded by peers and seniors
4. **Create/Join Projects** to find collaborators
5. **Request Mentorship** from alumni
6. **Participate in Discussions** in your department

### For Alumni:
1. **Sign Up** with alumni role
2. **Share Resources** and experiences
3. **Mentor Students** by accepting mentorship requests
4. **Join Projects** as experienced contributors
5. **Lead Discussions** and share insights

### For Admins:
1. **Manage Users** and moderate content
2. **Oversee Events** and ensure quality
3. **Monitor Resources** for appropriateness
4. **Facilitate Connections** between students and alumni

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/verify-email/:token` - Verify email
- `GET /api/auth/me` - Get current user

### Events
- `GET /api/events` - Get all events (with filters)
- `POST /api/events` - Create new event
- `POST /api/events/:id/rsvp` - RSVP to event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Resources
- `GET /api/resources` - Get all resources (with filters)
- `POST /api/resources` - Upload new resource
- `GET /api/resources/:id/download` - Download resource
- `DELETE /api/resources/:id` - Delete resource

### Projects
- `GET /api/projects` - Get all projects (with filters)
- `POST /api/projects` - Create new project
- `POST /api/projects/:id/join` - Join project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Mentorship
- `GET /api/mentorship/requests` - Get mentorship requests
- `POST /api/mentorship/requests` - Create mentorship request
- `PUT /api/mentorship/requests/:id/accept` - Accept request
- `PUT /api/mentorship/requests/:id` - Update request status

### Discussions
- `GET /api/discussions` - Get all discussions (with filters)
- `POST /api/discussions` - Create new discussion
- `GET /api/discussions/:id` - Get discussion details
- `POST /api/discussions/:id/comments` - Add comment
- `POST /api/discussions/:id/upvote` - Upvote discussion

## 🎨 Design Features

### Classic Professional Design
- Clean, academic-focused interface
- Consistent color scheme (Blue/Indigo gradients)
- Professional typography with Inter font
- Subtle shadows and rounded corners

### Responsive Layout
- Mobile-first design approach
- Flexible grid systems
- Collapsible navigation for mobile
- Touch-friendly interactive elements

### User Experience
- Intuitive navigation with clear icons
- Loading states and error handling
- Form validation with helpful messages
- Smooth transitions and hover effects

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- File type restrictions for uploads
- Role-based access control
- CORS protection

## 📊 Database Schema

The application uses PostgreSQL with Prisma ORM. Key models include:

- **User**: Authentication and profile information
- **Event**: Campus events with RSVP tracking
- **Resource**: File uploads with metadata
- **Project**: Collaborative projects with team members
- **MentorshipRequest**: Student-alumni connections
- **Discussion**: Forum threads with comments

## 🚀 Deployment

### Backend Deployment (Render/Railway)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy with automatic builds

### Frontend Deployment (Vercel/Netlify)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy with automatic builds

### Database (Railway/Supabase)
1. Create PostgreSQL database
2. Update DATABASE_URL in environment
3. Run migrations in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Developer**: Arun
- **Project Type**: Full-Stack Capstone Project
- **Institution**: College Resource Management Platform

## 🙏 Acknowledgments

- React.js community for excellent documentation
- Tailwind CSS for the utility-first CSS framework
- Prisma for the excellent ORM
- Cloudinary for file storage solutions

---

**CampusConnect** - Connecting students, alumni, and academic resources in one unified platform. 🎓✨