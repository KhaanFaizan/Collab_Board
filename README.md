# CollabBoard - Project Collaboration Platform

A modern, full-stack project collaboration platform built with React, Node.js, Express, and MongoDB. Manage projects, tasks, and team collaboration in one place.

## 🚀 Features

### Authentication & Authorization
- User registration and login with JWT tokens
- Role-based access control (Member/Admin)
- Secure password hashing with bcrypt
- Protected routes and middleware

### Project Management
- Create, read, update, and delete projects
- Project deadline management
- Team member management with roles
- Project statistics and overview

### Task Management
- Kanban-style task board (To Do, In Progress, Done)
- Task assignment to team members
- Status updates and progress tracking
- Project-specific task organization

### User Interface
- Modern, responsive design
- Real-time form validation
- Loading states and error handling
- Mobile-friendly interface

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **Axios** - HTTP client
- **CSS3** - Styling with modern features
- **Font Awesome** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Git

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/KhaanFaizan/Collab_Board.git
   cd Collab_Board
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the server directory:
   ```env
   MONGO_URI=mongodb://localhost:27017/collabboard
   JWT_SECRET=your-secret-key-here
   PORT=5000
   ```

4. **Start the application**
   ```bash
   # Start the backend server (from server directory)
   cd server
   npm start
   
   # Start the frontend (from client directory)
   cd client
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🎯 Usage

### Getting Started
1. **Register** a new account or **login** with existing credentials
2. **Create a project** with title, description, and deadline
3. **Add team members** to your project
4. **Create tasks** and assign them to team members
5. **Track progress** using the Kanban board

### User Roles
- **Member**: Can view and work on assigned tasks
- **Admin**: Full access to all features and user management

## 📁 Project Structure

```
Collab_Board/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store and slices
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                # Express backend
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── index.js          # Server entry point
│   └── package.json
├── .gitignore            # Git ignore rules
└── README.md            # Project documentation
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Projects
- `GET /api/projects` - Get user's projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `GET /api/tasks/:projectId` - Get project tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## 🚀 Deployment

### Frontend (Netlify/Vercel)
1. Build the React app: `npm run build`
2. Deploy the `build` folder to your hosting service

### Backend (Heroku/Railway)
1. Set environment variables in your hosting platform
2. Deploy the server directory
3. Update the API URL in the frontend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Faizan Khan**
- GitHub: [@KhaanFaizan](https://github.com/KhaanFaizan)

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js for the robust backend framework
- MongoDB for the flexible database solution
- All open-source contributors

---

**Happy Collaborating! 🎉**
