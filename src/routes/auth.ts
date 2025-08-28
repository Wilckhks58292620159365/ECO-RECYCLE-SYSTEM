// backend/src/routes/auth.ts
import { Router } from "express";
// import jwt from "jsonwebtoken"; // old import
import User from "../models/User";
import { getCurrentUser } from "../controllers/authController";
import authMiddleware from "../middleware/auth";
import { generateToken } from "../utils/token";

const router = Router();
// const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key"; // Moved to utils/token.ts

// Register
router.post("/register", async (req, res) => {
  console.log("🚀 Register route called");
  try {
    const { firstName, lastName, email, password } = req.body;
    console.log("📥 Register data:", { firstName, lastName, email });

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ 
        success: false,
        error: "Missing fields" 
      });
    }

    const normEmail = String(email).trim().toLowerCase();
    const exists = await User.scope("withPassword").findOne({ where: { email: normEmail } });
    
    if (exists) {
      return res.status(400).json({ 
        success: false,
        error: "User already exists" 
      });
    }

    const user = await User.create({ firstName, lastName, email: normEmail, password });
    console.log("✅ User created:", user.email);

    // const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" }); // old token generation
    const token = generateToken({ id: user.id, role: user.role });

    const response = {
      success: true,
      message: "User registered successfully",
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          points: user.points,
          createdAt: user.createdAt
        }
      }
    };

    console.log("📤 Register response:", JSON.stringify(response, null, 2));
    return res.status(201).json(response);

  } catch (e) {
    console.error("❌ Register error:", e);
    return res.status(500).json({ 
      success: false,
      error: "Server error" 
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  console.log("🚀 Login route called - UPDATED VERSION");
  try {
    const { email, password } = req.body;
    console.log("📥 Login attempt for:", email);

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        error: "Missing credentials" 
      });
    }

    const normEmail = String(email).trim().toLowerCase();
    const user = await User.scope("withPassword").findOne({ where: { email: normEmail } });
    
    if (!user) {
      console.log("❌ User not found");
      return res.status(401).json({ 
        success: false,
        error: "Invalid credentials" 
      });
    }

    console.log("👤 User found:", user.email);

    const ok = await user.checkPassword(password);
    if (!ok) {
      console.log("❌ Password incorrect");
      return res.status(401).json({ 
        success: false,
        error: "Invalid credentials" 
      });
    }

    console.log("✅ Password correct");

    // const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" }); // old token generation
    const token = generateToken({ id: user.id, role: user.role });

    // استخدام نفس المستخدم اللي جبناه أصلاً بس نستبعد كلمة المرور
    const response = {
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          points: user.points || 0,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    };

    console.log("📤 Login response:", JSON.stringify(response, null, 2));
    return res.json(response);

  } catch (e) {
    console.error("❌ Login error:", e);
    return res.status(500).json({ 
      success: false,
      error: "Server error" 
    });
  }
});

// Admin Login
router.post("/admin", async (req, res) => {
  console.log("🚀 Admin login route called");
  try {
    const { email, password } = req.body;
    const normEmail = String(email).trim().toLowerCase();
    
    const user = await User.scope("withPassword").findOne({ where: { email: normEmail } });
    if (!user || user.role !== "admin") {
      return res.status(401).json({ 
        success: false,
        error: "Invalid admin credentials" 
      });
    }

    const ok = await user.checkPassword(password);
    if (!ok) {
      return res.status(401).json({ 
        success: false,
        error: "Invalid admin credentials" 
      });
    }

    // const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" }); // old token generation
    const token = generateToken({ id: user.id, role: user.role });

    // استخدام نفس المستخدم اللي جبناه أصلاً
    const response = {
      success: true,
      message: "Admin login successful",
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          points: user.points || 0,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    };

    return res.json(response);

  } catch (e) {
    console.error("❌ Admin login error:", e);
    return res.status(500).json({ 
      success: false,
      error: "Server error" 
    });
  }
});

// Get current user
// router.get("/me", authMiddleware, getCurrentUser); // moved to users.ts

export default router;