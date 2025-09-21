# 🚀 CollabBoard - Project Collaboration Platform

<div align="center">
  <img src="client/public/favicon.svg" alt="CollabBoard Logo" width="120" height="120">
  
  **The ultimate collaboration platform for modern teams**
  
  [![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Database-green.svg)](https://mongodb.com/)
  [![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
  
  [🌐 Live Demo](https://collab-board-hxcw.onrender.com/dashboard) • [📚 Documentation](https://docs.collabboard.com)

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📦 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [🎨 UI/UX Features](#-uiux-features)
- [🔐 Authentication](#-authentication)
- [📱 Responsive Design](#-responsive-design)
- [🧪 Testing](#-testing)
- [📚 API Documentation](#-api-documentation)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👥 Team](#-team)

---

## 🌐 Live Demo

**🎉 Try CollabBoard right now!**

👉 **[https://collab-board-hxcw.onrender.com/dashboard](https://collab-board-hxcw.onrender.com/dashboard)**

- ✅ **Fully Functional** - All features working in production
- 🚀 **Real-time Updates** - Live collaboration and notifications
- 📱 **Mobile Responsive** - Works on all devices
- 🔐 **Secure Authentication** - JWT-based user management
- 📊 **Complete Dashboard** - Project management and analytics

*No registration required to explore the interface!*

---

## ✨ Features

### 🎯 **Core Functionality**
- **📊 Project Management** - Create, organize, and track projects with deadlines
- **✅ Task Management** - Kanban-style task board with drag-and-drop functionality
- **👥 Team Collaboration** - Real-time team coordination and member management
- **📅 Calendar Integration** - Visual timeline and deadline tracking
- **🔔 Real-time Notifications** - Instant updates and alerts
- **📈 Analytics Dashboard** - Project insights and team performance metrics

### 🎨 **Modern UI/UX**
- **🌙 Dark/Light Theme** - Toggle between themes with persistent preferences
- **📱 Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- **✨ Smooth Animations** - Professional micro-interactions and transitions
- **🎯 Intuitive Design** - Clean, modern interface with excellent usability
- **♿ Accessibility** - WCAG compliant with keyboard navigation support

### 🔐 **Security & Authentication**
- **🔑 JWT Authentication** - Secure token-based authentication
- **👤 Role-based Access Control** - Admin and Member roles with different permissions
- **🔒 Password Security** - bcrypt hashing for secure password storage
- **🛡️ Protected Routes** - Secure access to authenticated features

### 📊 **Admin Features**
- **👥 User Management** - Add, edit, and manage team members
- **📈 System Analytics** - Comprehensive dashboard with usage statistics
- **⚙️ Project Administration** - Full control over projects and tasks
- **🔍 Advanced Search** - Powerful filtering and search capabilities

---

## 🛠️ Tech Stack

### **Frontend**
- **React 19** - Modern UI library with hooks and functional components
- **Redux Toolkit** - Predictable state management
- **React Router** - Client-side routing and navigation
- **Axios** - HTTP client for API communication
- **CSS3** - Modern styling with Flexbox and Grid
- **Font Awesome** - Comprehensive icon library

### **Backend**
- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, unopinionated web framework
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - Elegant MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing and security
- **CORS** - Cross-origin resource sharing

### **Development Tools**
- **ESLint** - Code linting and quality assurance
- **Prettier** - Code formatting and consistency
- **Nodemon** - Development server with auto-restart
- **Concurrently** - Run multiple commands simultaneously

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local or cloud instance)
- **Git** (for version control)

### One-Command Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/CollabBoard.git
cd CollabBoard

# Install all dependencies (root, server, and client)
npm run install-all

# Start the development environment
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

---

## 📦 Installation

### 1. **Clone the Repository**
```bash
git clone https://github.com/yourusername/CollabBoard.git
cd CollabBoard
```

### 2. **Install Dependencies**

#### Option A: Install All at Once
```bash
npm run install-all
```

#### Option B: Install Manually
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

### 3. **Environment Setup**
Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/collabboard
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/collabboard

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# CORS Configuration
CLIENT_URL=http://localhost:3000
```

### 4. **Start the Application**

#### Development Mode
```bash
# Start both frontend and backend
npm run dev

# Or start individually:
npm run server    # Backend only
npm run client    # Frontend only
```

#### Production Mode
```bash
# Build the client
npm run build

# Start production server
npm start
```

---

## ⚙️ Configuration

### **Environment Variables**

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | 5000 | No |
| `NODE_ENV` | Environment mode | development | No |
| `MONGODB_URI` | MongoDB connection string | - | Yes |
| `JWT_SECRET` | JWT signing secret | - | Yes |
| `JWT_EXPIRE` | JWT expiration time | 7d | No |
| `CLIENT_URL` | Frontend URL for CORS | http://localhost:3000 | No |

### **MongoDB Setup**

#### Local MongoDB
```bash
# Install MongoDB locally
# macOS with Homebrew
brew install mongodb-community

# Ubuntu/Debian
sudo apt-get install mongodb

# Start MongoDB service
sudo systemctl start mongod
```

#### MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in your `.env` file

---

## 🎨 UI/UX Features

### **Landing Page**
- **Hero Section** - Compelling introduction with animated elements
- **Feature Showcase** - Interactive feature cards with smooth transitions
- **Statistics Counter** - Animated counters showing platform metrics
- **Testimonials** - Customer reviews and social proof
- **Pricing Plans** - Clear pricing tiers with feature comparison
- **Call-to-Action** - Multiple conversion points for user engagement

### **Dashboard**
- **Project Overview** - Visual project cards with progress indicators
- **Quick Actions** - Easy access to common tasks
- **Recent Activity** - Timeline of team activities
- **Statistics Cards** - Key metrics with hover animations
- **Theme Toggle** - Dark/light mode switching

### **Project Management**
- **Project Cards** - Beautiful project visualization
- **Progress Tracking** - Visual progress indicators
- **Team Assignment** - Easy member management
- **Deadline Management** - Color-coded deadline status
- **File Sharing** - Drag-and-drop file uploads

### **Task Management**
- **Kanban Board** - Drag-and-drop task organization
- **Status Tracking** - To Do, In Progress, Done columns
- **Priority Levels** - Visual priority indicators
- **Due Dates** - Calendar integration
- **Comments** - Task-specific discussions

---

## 🔐 Authentication

### **User Registration**
```javascript
// Registration endpoint
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "member" // or "admin"
}
```

### **User Login**
```javascript
// Login endpoint
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### **Protected Routes**
- All dashboard routes require authentication
- JWT tokens are automatically refreshed
- Role-based access control for admin features

---

## 📱 Responsive Design

### **Breakpoints**
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### **Mobile Features**
- Touch-friendly interface
- Swipe gestures for navigation
- Optimized form inputs
- Collapsible navigation menu

---

## 🧪 Testing

### **Run Tests**
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### **Test Structure**
```
tests/
├── unit/           # Unit tests
├── integration/    # Integration tests
├── e2e/           # End-to-end tests
└── fixtures/      # Test data
```

---

## 📚 API Documentation

### **Authentication Endpoints**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/auth/me` | Get current user |

### **Project Endpoints**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | Get all projects |
| POST | `/api/projects` | Create new project |
| GET | `/api/projects/:id` | Get project by ID |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |

### **Task Endpoints**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create new task |
| GET | `/api/tasks/:id` | Get task by ID |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

---

## 🚀 Deployment

### **Frontend Deployment (Vercel)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

### **Backend Deployment (Heroku)**
```bash
# Install Heroku CLI
# Create Heroku app
heroku create collabboard-api

# Set environment variables
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret

# Deploy
git push heroku main
```

### **Docker Deployment**
```bash
# Build and run with Docker Compose
docker-compose up -d
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### **1. Fork the Repository**
```bash
# Fork on GitHub, then clone your fork
git clone https://github.com/yourusername/CollabBoard.git
cd CollabBoard
```

### **2. Create a Feature Branch**
```bash
git checkout -b feature/amazing-feature
```

### **3. Make Your Changes**
- Write clean, readable code
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

### **4. Commit Your Changes**
```bash
git commit -m "Add amazing feature"
```

### **5. Push to Your Fork**
```bash
git push origin feature/amazing-feature
```

### **6. Create a Pull Request**
- Open a pull request on GitHub
- Describe your changes clearly
- Link any related issues

### **Development Guidelines**
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation
- Ensure all tests pass

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 CollabBoard

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👥 Team

<div align="center">
  
**CollabBoard Development Team**

[![Developer](https://img.shields.io/badge/Developer-Your%20Name-blue.svg)](https://github.com/yourusername)
[![Email](https://img.shields.io/badge/Email-contact@collabboard.com-red.svg)](mailto:contact@collabboard.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue.svg)](https://linkedin.com/in/yourusername)

</div>

---

## 🙏 Acknowledgments

- **React Team** - For the amazing framework
- **MongoDB** - For the flexible database
- **Express.js** - For the robust backend framework
- **Font Awesome** - For the comprehensive icon library
- **Open Source Community** - For inspiration and support

---

<div align="center">
  
**⭐ Star this repository if you found it helpful!**

[![GitHub stars](https://img.shields.io/github/stars/yourusername/CollabBoard.svg?style=social&label=Star)](https://github.com/yourusername/CollabBoard)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/CollabBoard.svg?style=social&label=Fork)](https://github.com/yourusername/CollabBoard/fork)

Made with ❤️ by the CollabBoard Team

</div>