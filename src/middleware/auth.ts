import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { id: number; role: "user" | "admin" };
}

export default function auth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required in environment variables');
  }
  // const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret_key") as any; // old verification
  const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch {
    return res.status(403).json({ error: "Invalid token" });
  }
}
