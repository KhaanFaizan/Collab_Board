const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.header("Authorization");
    
    // Check if Authorization header exists
    if (!authHeader) {
      return res.status(401).json({ 
        error: "Access denied. No token provided." 
      });
    }

    // Check if token starts with "Bearer "
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ 
        error: "Access denied. Invalid token format." 
      });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key");

    // Attach decoded user info to request object
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };

    // Continue to next middleware/route
    next();

  } catch (error) {
    // Handle JWT errors (expired, invalid, etc.)
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ 
        error: "Access denied. Invalid token." 
      });
    }
    
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ 
        error: "Access denied. Token expired." 
      });
    }

    // Handle other errors
    console.error("Auth middleware error:", error);
    return res.status(401).json({ 
      error: "Access denied. Token verification failed." 
    });
  }
};

// Role-based authorization middleware
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Check if user is authenticated (req.user should exist from authMiddleware)
    if (!req.user) {
      return res.status(401).json({ 
        error: "Access denied. Authentication required." 
      });
    }

    // Check if user's role is in the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: "Access denied. Insufficient permissions.",
        required: roles,
        current: req.user.role
      });
    }

    // User has required role, continue to next middleware/route
    next();
  };
};

module.exports = { authMiddleware, authorizeRoles };
