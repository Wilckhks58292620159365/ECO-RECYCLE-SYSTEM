import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token provided" });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret_key");
    const user = await User.findByPk(decoded.id);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    (req as any).user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
