import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

// دالة إنشاء التوكن
const generateToken = (user: any) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET || "fallback_secret_key",
    { expiresIn: "7d" }
  );
};

// ✅ Register
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        error: "User already exists" 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: "user",
      points: 0,
    });

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role,
          points: newUser.points,
          createdAt: newUser.createdAt
        }
      }
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ 
      success: false,
      error: "Server error" 
    });
  }
};

// ✅ Login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // البحث عن المستخدم مع استبعاد كلمة المرور من النتيجة
    const user = await User.findOne({ 
      where: { email },
      attributes: { exclude: ['password'] } // استبعاد كلمة المرور من النتيجة
    });

    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: "Invalid email or password" 
      });
    }

    // البحث مرة تانية عشان نجيب كلمة المرور للمقارنة
    const userWithPassword = await User.findOne({ where: { email } });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        error: "Invalid email or password" 
      });
    }

    const token = generateToken(user);

    console.log("🔍 Login successful for user:", user.email);

    return res.status(200).json({
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
          points: user.points,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ 
      success: false,
      error: "Server error during login" 
    });
  }
};

// ✅ دالة للحصول على بيانات المستخدم الحالي (اختيارية)
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    // req.user متوفر من الـ middleware
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "User not authenticated"
      });
    }

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          points: user.points,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });

  } catch (error) {
    console.error("Get current user error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
};