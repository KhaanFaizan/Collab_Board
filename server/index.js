const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const http = require("http");
const socketIo = require("socket.io");
const User = require("./models/User");
const Project = require("./models/Project");
const Task = require("./models/Task");
const ChatMessage = require("./models/ChatMessage");
const File = require("./models/File");
const { authMiddleware, authorizeRoles } = require("./middleware/authMiddleware");
const { storage } = require("./config/cloudinary");
const multer = require("multer");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ✅ Test route to create a user
app.post("/api/test-user", async (req, res) => {
  try {
    const user = new User({
      name: "Faizan Tester",
      email: "faizan@example.com",
      password: "123456"
    });

    await user.save();
    res.json({ message: "✅ Test user saved successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Test route to fetch all users
app.get("/api/test-users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Signup route
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password, role = "member" } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: "Name, email, and password are required" 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        error: "User with this email already exists" 
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Login route
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        error: "Email and password are required" 
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        error: "Invalid email or password" 
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: "Invalid email or password" 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Protected route example (requires authentication)
app.get("/api/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Access granted to protected route",
    user: req.user
  });
});

// ✅ Admin-only route (requires admin role)
app.get("/api/admin/users", authMiddleware, authorizeRoles("admin"), (req, res) => {
  res.json({
    message: "Admin access granted",
    user: req.user,
    data: "This is admin-only data"
  });
});

// ✅ Manager and Admin route (requires manager or admin role)
app.get("/api/management/dashboard", authMiddleware, authorizeRoles("admin", "manager"), (req, res) => {
  res.json({
    message: "Management access granted",
    user: req.user,
    data: "This is management-level data"
  });
});

// ✅ Member-only route (requires member role)
app.get("/api/member/content", authMiddleware, authorizeRoles("member"), (req, res) => {
  res.json({
    message: "Member access granted",
    user: req.user,
    data: "This is member-only content"
  });
});

// ==================== PROJECT ROUTES ====================

// ✅ Create project (auth required)
app.post("/api/projects", authMiddleware, async (req, res) => {
  try {
    const { title, description, deadline } = req.body;

    // Validate required fields
    if (!title || !description || !deadline) {
      return res.status(400).json({
        error: "Title, description, and deadline are required",
      });
    }

    // Validate deadline is in the future
    const deadlineDate = new Date(deadline);
    if (deadlineDate <= new Date()) {
      return res.status(400).json({
        error: "Deadline must be in the future",
      });
    }

    // Create new project
    const project = new Project({
      title,
      description,
      deadline: deadlineDate,
      createdBy: req.user.id,
    });

    await project.save();

    // Populate the project with user details
    await project.populate([
      { path: "createdBy", select: "name email" },
      { path: "members.user", select: "name email" },
    ]);

    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (err) {
    console.error("Create project error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Get all projects user is part of
app.get("/api/projects", authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { createdBy: req.user.id },
        { "members.user": req.user.id },
      ],
    })
      .populate("createdBy", "name email")
      .populate("members.user", "name email")
      .sort({ createdAt: -1 });

    res.json({
      message: "Projects retrieved successfully",
      projects,
    });
  } catch (err) {
    console.error("Get projects error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Get single project details
app.get("/api/projects/:id", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      $or: [
        { createdBy: req.user.id },
        { "members.user": req.user.id },
      ],
    })
      .populate("createdBy", "name email")
      .populate("members.user", "name email");

    if (!project) {
      return res.status(404).json({
        error: "Project not found or access denied",
      });
    }

    res.json({
      message: "Project retrieved successfully",
      project,
    });
  } catch (err) {
    console.error("Get project error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Update project (only creator/manager)
app.put("/api/projects/:id", authMiddleware, async (req, res) => {
  try {
    const { title, description, deadline } = req.body;

    // Find project and check permissions
    const project = await Project.findOne({
      _id: req.params.id,
      $or: [
        { createdBy: req.user.id },
        { "members.user": req.user.id, "members.role": "manager" },
      ],
    });

    if (!project) {
      return res.status(404).json({
        error: "Project not found or insufficient permissions",
      });
    }

    // Update fields if provided
    if (title) project.title = title;
    if (description) project.description = description;
    if (deadline) {
      const deadlineDate = new Date(deadline);
      if (deadlineDate <= new Date()) {
        return res.status(400).json({
          error: "Deadline must be in the future",
        });
      }
      project.deadline = deadlineDate;
    }

    await project.save();

    // Populate the updated project
    await project.populate([
      { path: "createdBy", select: "name email" },
      { path: "members.user", select: "name email" },
    ]);

    res.json({
      message: "Project updated successfully",
      project,
    });
  } catch (err) {
    console.error("Update project error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Delete project (only creator/manager)
app.delete("/api/projects/:id", authMiddleware, async (req, res) => {
  try {
    // Find project and check permissions
    const project = await Project.findOne({
      _id: req.params.id,
      $or: [
        { createdBy: req.user.id },
        { "members.user": req.user.id, "members.role": "manager" },
      ],
    });

    if (!project) {
      return res.status(404).json({
        error: "Project not found or insufficient permissions",
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({
      message: "Project deleted successfully",
    });
  } catch (err) {
    console.error("Delete project error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ==================== TASK ROUTES ====================

// ✅ Create task (auth required)
app.post("/api/tasks", authMiddleware, async (req, res) => {
  try {
    const { title, description, assignedTo, projectId } = req.body;

    // Validate required fields
    if (!title || !description || !assignedTo || !projectId) {
      return res.status(400).json({
        error: "Title, description, assignedTo, and projectId are required",
      });
    }

    // Verify project exists and user has access to it
    const project = await Project.findOne({
      _id: projectId,
      $or: [
        { createdBy: req.user.id },
        { "members.user": req.user.id },
      ],
    });

    if (!project) {
      return res.status(404).json({
        error: "Project not found or access denied",
      });
    }

    // Verify assigned user exists and is a member of the project
    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser) {
      return res.status(400).json({
        error: "Assigned user not found",
      });
    }

    // Check if assigned user is a member of the project
    const isMember = project.members.some(
      (member) => member.user.toString() === assignedTo
    );
    if (!isMember) {
      return res.status(400).json({
        error: "Assigned user is not a member of this project",
      });
    }

    // Create new task
    const task = new Task({
      title,
      description,
      assignedTo,
      projectId,
    });

    await task.save();

    // Populate the task with user and project details
    await task.populate([
      { path: "assignedTo", select: "name email" },
      { path: "projectId", select: "title" },
    ]);

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (err) {
    console.error("Create task error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Get tasks by project ID
app.get("/api/tasks/:projectId", authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.params;

    // Verify project exists and user has access to it
    const project = await Project.findOne({
      _id: projectId,
      $or: [
        { createdBy: req.user.id },
        { "members.user": req.user.id },
      ],
    });

    if (!project) {
      return res.status(404).json({
        error: "Project not found or access denied",
      });
    }

    // Get all tasks for the project
    const tasks = await Task.find({ projectId })
      .populate("assignedTo", "name email")
      .populate("projectId", "title")
      .sort({ createdAt: -1 });

    res.json({
      message: "Tasks retrieved successfully",
      tasks,
    });
  } catch (err) {
    console.error("Get tasks error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Update task
app.put("/api/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const { title, description, status, assignedTo } = req.body;
    const { id } = req.params;

    // Find task and verify user has access to the project
    const task = await Task.findById(id).populate("projectId");
    if (!task) {
      return res.status(404).json({
        error: "Task not found",
      });
    }

    // Check if user has access to the project
    const project = await Project.findOne({
      _id: task.projectId._id,
      $or: [
        { createdBy: req.user.id },
        { "members.user": req.user.id },
      ],
    });

    if (!project) {
      return res.status(404).json({
        error: "Project not found or access denied",
      });
    }

    // Update fields if provided
    if (title) task.title = title;
    if (description) task.description = description;
    if (status) {
      if (!["todo", "in-progress", "done"].includes(status)) {
        return res.status(400).json({
          error: "Status must be one of: todo, in-progress, done",
        });
      }
      task.status = status;
    }
    if (assignedTo) {
      // Verify assigned user exists and is a member of the project
      const assignedUser = await User.findById(assignedTo);
      if (!assignedUser) {
        return res.status(400).json({
          error: "Assigned user not found",
        });
      }

      const isMember = project.members.some(
        (member) => member.user.toString() === assignedTo
      );
      if (!isMember) {
        return res.status(400).json({
          error: "Assigned user is not a member of this project",
        });
      }

      task.assignedTo = assignedTo;
    }

    await task.save();

    // Populate the updated task
    await task.populate([
      { path: "assignedTo", select: "name email" },
      { path: "projectId", select: "title" },
    ]);

    res.json({
      message: "Task updated successfully",
      task,
    });
  } catch (err) {
    console.error("Update task error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Delete task
app.delete("/api/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Find task and verify user has access to the project
    const task = await Task.findById(id).populate("projectId");
    if (!task) {
      return res.status(404).json({
        error: "Task not found",
      });
    }

    // Check if user has access to the project
    const project = await Project.findOne({
      _id: task.projectId._id,
      $or: [
        { createdBy: req.user.id },
        { "members.user": req.user.id },
      ],
    });

    if (!project) {
      return res.status(404).json({
        error: "Project not found or access denied",
      });
    }

    await Task.findByIdAndDelete(id);

    res.json({
      message: "Task deleted successfully",
    });
  } catch (err) {
    console.error("Delete task error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Configure Multer
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt|zip|rar/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, documents, and archives are allowed.'));
    }
  }
});

// File upload route
app.post("/api/files/upload", authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const { projectId } = req.body;
    
    console.log("File upload request:", { projectId, userId: req.user.id });
    
    if (!projectId) {
      return res.status(400).json({ error: "Project ID is required" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("File received:", {
      originalname: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });

    // Verify user has access to the project
    const project = await Project.findOne({
      _id: projectId,
      $or: [
        { createdBy: req.user.id },
        { "members.user": req.user.id },
      ],
    });

    if (!project) {
      return res.status(403).json({ error: "Access denied to this project" });
    }

    // Create file record in database
    const fileRecord = new File({
      projectId,
      uploadedBy: req.user.id,
      fileUrl: req.file.path,
      filename: req.file.filename,
      originalName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      cloudinaryId: req.file.public_id,
    });

    await fileRecord.save();

    // Populate user info
    await fileRecord.populate('uploadedBy', 'name email');

    res.status(201).json({
      message: "File uploaded successfully",
      file: fileRecord
    });
  } catch (err) {
    console.error("File upload error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get files for a project
app.get("/api/files/:projectId", authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.params;

    // Verify user has access to the project
    const project = await Project.findOne({
      _id: projectId,
      $or: [
        { createdBy: req.user.id },
        { "members.user": req.user.id },
      ],
    });

    if (!project) {
      return res.status(403).json({ error: "Access denied to this project" });
    }

    // Get files for the project
    const files = await File.find({ projectId })
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ files });
  } catch (err) {
    console.error("Get files error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete file
app.delete("/api/files/:fileId", authMiddleware, async (req, res) => {
  try {
    const { fileId } = req.params;

    // Find the file and verify access
    const file = await File.findById(fileId).populate('projectId');
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Check if user has access to the project
    const project = await Project.findOne({
      _id: file.projectId._id,
      $or: [
        { createdBy: req.user.id },
        { "members.user": req.user.id },
      ],
    });

    if (!project) {
      return res.status(403).json({ error: "Access denied to this project" });
    }

    // Delete from Cloudinary
    const { cloudinary } = require('./config/cloudinary');
    await cloudinary.uploader.destroy(file.cloudinaryId);

    // Delete from database
    await File.findByIdAndDelete(fileId);

    res.json({ message: "File deleted successfully" });
  } catch (err) {
    console.error("Delete file error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Calendar API - Get user's calendar data
app.get("/api/calendar/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Verify user can access this calendar data
    if (req.user.id !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Get all projects where user is a member or creator
    const projects = await Project.find({
      $or: [
        { createdBy: userId },
        { "members.user": userId }
      ]
    }).populate('createdBy', 'name email');

    // Get all tasks assigned to the user
    const tasks = await Task.find({
      assignedTo: userId
    }).populate('projectId', 'title deadline');

    // Combine project deadlines and task deadlines
    const calendarEntries = [];

    // Add project deadlines
    projects.forEach(project => {
      calendarEntries.push({
        id: `project-${project._id}`,
        type: 'project',
        title: project.title,
        taskTitle: null,
        deadline: project.deadline,
        projectId: project._id,
        projectTitle: project.title,
        createdAt: project.createdAt
      });
    });

    // Add task deadlines
    tasks.forEach(task => {
      calendarEntries.push({
        id: `task-${task._id}`,
        type: 'task',
        title: task.title,
        taskTitle: task.title,
        deadline: task.projectId?.deadline || new Date(),
        projectId: task.projectId?._id,
        projectTitle: task.projectId?.title || 'Unknown Project',
        createdAt: task.createdAt
      });
    });

    // Sort by deadline
    calendarEntries.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    res.json({
      success: true,
      calendarEntries,
      totalProjects: projects.length,
      totalTasks: tasks.length
    });

  } catch (err) {
    console.error("Calendar API error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.io
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.io authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");
    const user = await User.findById(decoded.userId).select("name email role");
    
    if (!user) {
      return next(new Error("Authentication error: User not found"));
    }

    socket.userId = user._id.toString();
    socket.user = user;
    next();
  } catch (err) {
    next(new Error("Authentication error: Invalid token"));
  }
});

// Socket.io connection handling
io.on("connection", (socket) => {
  console.log(`👤 User connected: ${socket.user.name} (${socket.id})`);

  // Join project room
  socket.on("joinRoom", async (projectId) => {
    try {
      // Verify user has access to the project
      const project = await Project.findOne({
        _id: projectId,
        $or: [
          { createdBy: socket.userId },
          { "members.user": socket.userId },
        ],
      });

      if (!project) {
        socket.emit("error", { message: "Access denied to this project" });
        return;
      }

      socket.join(projectId);
      console.log(`👤 User ${socket.user.name} joined project room: ${projectId}`);
      
      // Send recent messages to the user
      const recentMessages = await ChatMessage.find({ projectId })
        .populate("senderId", "name email")
        .sort({ timestamp: -1 })
        .limit(50);

      socket.emit("recentMessages", recentMessages.reverse());
    } catch (error) {
      console.error("Error joining room:", error);
      socket.emit("error", { message: "Failed to join project room" });
    }
  });

  // Send message
  socket.on("sendMessage", async (data) => {
    try {
      const { projectId, message } = data;

      // Verify user has access to the project
      const project = await Project.findOne({
        _id: projectId,
        $or: [
          { createdBy: socket.userId },
          { "members.user": socket.userId },
        ],
      });

      if (!project) {
        socket.emit("error", { message: "Access denied to this project" });
        return;
      }

      // Create and save message
      const chatMessage = new ChatMessage({
        projectId,
        senderId: socket.userId,
        message: message.trim(),
      });

      await chatMessage.save();

      // Populate sender info
      await chatMessage.populate("senderId", "name email");

      // Broadcast message to all users in the project room
      io.to(projectId).emit("newMessage", {
        _id: chatMessage._id,
        projectId: chatMessage.projectId,
        senderId: chatMessage.senderId,
        message: chatMessage.message,
        timestamp: chatMessage.timestamp,
        sender: {
          _id: chatMessage.senderId._id,
          name: chatMessage.senderId.name,
          email: chatMessage.senderId.email,
        },
      });

      console.log(`💬 Message sent in project ${projectId} by ${socket.user.name}`);
    } catch (error) {
      console.error("Error sending message:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  // Update task
  socket.on("updateTask", async (data) => {
    try {
      const { taskId, newStatus, newTitle, newDescription, newAssignedTo } = data;

      // Find the task and verify user has access to the project
      const task = await Task.findById(taskId).populate('projectId');
      if (!task) {
        socket.emit("error", { message: "Task not found" });
        return;
      }

      const project = await Project.findOne({
        _id: task.projectId._id,
        $or: [
          { createdBy: socket.userId },
          { "members.user": socket.userId },
        ],
      });

      if (!project) {
        socket.emit("error", { message: "Access denied to this project" });
        return;
      }

      // Update the task
      const updateData = {};
      if (newStatus) updateData.status = newStatus;
      if (newTitle) updateData.title = newTitle;
      if (newDescription) updateData.description = newDescription;
      if (newAssignedTo) updateData.assignedTo = newAssignedTo;

      const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        updateData,
        { new: true }
      ).populate([
        { path: "assignedTo", select: "name email" },
        { path: "projectId", select: "title" },
      ]);

      // Broadcast updated task to all users in the project room
      io.to(task.projectId._id.toString()).emit("taskUpdated", {
        taskId: updatedTask._id,
        projectId: task.projectId._id,
        updatedTask: updatedTask,
        updatedBy: {
          _id: socket.userId,
          name: socket.user.name,
          email: socket.user.email,
        },
      });

      console.log(`📝 Task ${taskId} updated by ${socket.user.name} in project ${task.projectId._id}`);
    } catch (error) {
      console.error("Error updating task:", error);
      socket.emit("error", { message: "Failed to update task" });
    }
  });

  // Create task
  socket.on("createTask", async (data) => {
    try {
      const { projectId, title, description, assignedTo } = data;

      // Verify user has access to the project
      const project = await Project.findOne({
        _id: projectId,
        $or: [
          { createdBy: socket.userId },
          { "members.user": socket.userId },
        ],
      });

      if (!project) {
        socket.emit("error", { message: "Access denied to this project" });
        return;
      }

      // Create the task
      const task = new Task({
        title,
        description,
        assignedTo,
        projectId,
      });

      await task.save();
      await task.populate([
        { path: "assignedTo", select: "name email" },
        { path: "projectId", select: "title" },
      ]);

      // Broadcast new task to all users in the project room
      io.to(projectId).emit("taskCreated", {
        taskId: task._id,
        projectId: projectId,
        newTask: task,
        createdBy: {
          _id: socket.userId,
          name: socket.user.name,
          email: socket.user.email,
        },
      });

      console.log(`➕ Task created by ${socket.user.name} in project ${projectId}`);
    } catch (error) {
      console.error("Error creating task:", error);
      socket.emit("error", { message: "Failed to create task" });
    }
  });

  // Delete task
  socket.on("deleteTask", async (data) => {
    try {
      const { taskId } = data;

      // Find the task and verify user has access to the project
      const task = await Task.findById(taskId).populate('projectId');
      if (!task) {
        socket.emit("error", { message: "Task not found" });
        return;
      }

      const project = await Project.findOne({
        _id: task.projectId._id,
        $or: [
          { createdBy: socket.userId },
          { "members.user": socket.userId },
        ],
      });

      if (!project) {
        socket.emit("error", { message: "Access denied to this project" });
        return;
      }

      // Delete the task
      await Task.findByIdAndDelete(taskId);

      // Broadcast task deletion to all users in the project room
      io.to(task.projectId._id.toString()).emit("taskDeleted", {
        taskId: taskId,
        projectId: task.projectId._id,
        deletedBy: {
          _id: socket.userId,
          name: socket.user.name,
          email: socket.user.email,
        },
      });

      console.log(`🗑️ Task ${taskId} deleted by ${socket.user.name} in project ${task.projectId._id}`);
    } catch (error) {
      console.error("Error deleting task:", error);
      socket.emit("error", { message: "Failed to delete task" });
    }
  });

  // Leave project room
  socket.on("leaveRoom", (projectId) => {
    socket.leave(projectId);
    console.log(`👤 User ${socket.user.name} left project room: ${projectId}`);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`👤 User disconnected: ${socket.user.name} (${socket.id})`);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔌 Socket.io server ready for connections`);
});