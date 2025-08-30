import { Request, Response } from "express";
import { wasteService } from "../services/wasteService";
import { calculatePoints } from "../utils/pointsCalculator";
import User from "../models/User";
import Pickup from "../models/Pickup";
export const wasteController = {
  async create(req: any, res: any) {
    try {
      const { description, quantity, date, type }:any = req.body;
      const BASE_URL = process.env.REPLIT_DEV_DOMAIN 
        ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
        : (process.env.BASE_URL || "http://localhost:5000");
      const imageUrl = req.file ? `${BASE_URL}/uploads/images/${req.file.filename}` : undefined;

      if (!description || !quantity || !date) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const pickup:any = await wasteService.create({
        userId: req.user.id, // جاي من الـ authMiddleware
        description,
        quantity: Number(quantity),
        date: new Date(date).toISOString(),
        imageUrl,
        type,
      });

      res.status(201).json(pickup);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to create pickup" });
    }
  },

  async myPickups(req: any, res: any) {
    try {
      const pickups = await wasteService.findAllByUser(req.user.id);
      res.json(pickups);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch pickups" });
    }
  },

  async allPickups(req: any, res: any) {
    try {
      const pickups = await wasteService.findAll();
      res.json(pickups);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch pickups" });
    }
  },

  async confirm(req: any, res: any) {
      try {
    const { pickupId } = req.body;
    const pickup = await Pickup.findByPk(pickupId);
    if (!pickup) return res.status(404).json({ message: "Pickup not found" });

    const user = await User.findByPk(pickup.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const points = calculatePoints(pickup.type, pickup.quantity);

    pickup.status = "confirmed";
    pickup.points = points;
    await pickup.save();

    user.points += points;
    await user.save();

    res.json({ message: "Pickup confirmed", pickup, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
  }
};

export const createPickup = async (req: any, res: any) => {
  try {
    const { wasteType, weight, description, location }:any = req.body;
    const BASE_URL = process.env.REPLIT_DEV_DOMAIN 
      ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
      : (process.env.BASE_URL || "http://localhost:5000");

    // احسب النقاط
    const points = calculatePoints(wasteType, Number(weight));

    const pickup:any = await Pickup.create({
      wasteType,
      weight,
      description,
      location,
      imageUrl: req.file ? `${BASE_URL}/uploads/images/${req.file.filename}` : null,
      userId: req.user.id,
      points // خزّن النقاط هنا
    });

    // زوّد نقاط المستخدم
    const user = await User.findByPk(req.user.id);
    if (user) {
      user.points += points;
      await user.save();
    }

    res.json(pickup);
  } catch (err) {
    res.status(500).json({ message: "Failed to create pickup" });
  }
};
