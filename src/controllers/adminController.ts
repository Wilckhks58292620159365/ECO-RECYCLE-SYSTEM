import { Request, Response } from "express";
import User from "../models/User";
import Pickup from "../models/Pickup";
import { calculatePoints } from "../utils/pointsCalculator";
// Get all users
export const getAllUsers = async (req:any, res:any) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "firstName", "lastName", "email", "points", "active", "role"],
      include: [
        {
          model: Pickup,
          as: "pickups", // لازم نفس alias اللي في associations.ts
          attributes: ["id", "status", "points", "date"],
        },
      ],
    });

    res.json(users);
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Toggle user active status
export const toggleUserStatus = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const user = await User.findByPk(userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  user.active = !user.active;
  await user.save();

  res.json({ message: "User status updated", user });
};

export const getAllPickups = async (req: Request, res: Response) => {
  try {
    const rows = await Pickup.findAll({
      attributes: [
        "id",
        ["type", "wasteType"],
        ["quantity", "weight"],
        "status",
        "points",
        "image",
        ["date", "pickupDate"],
        "createdAt"
      ],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "firstName", "lastName", "email"]
        }
      ],
      order: [["createdAt", "DESC"]],
    });

    const data = rows.map((r) => {
      const j = r.toJSON() as any;

      let createdAt: string | null = j.createdAt ?? null;
      if (!createdAt && j.pickupDate) {
        createdAt = `${j.pickupDate}T00:00:00.000Z`;
      }

      return {
        ...j,
        createdAt,
        image: j.image, // ✅ بس اسم الملف
      };
    });

    res.json(data);
  } catch (error) {
    console.error("Error in getAllPickups:", error);
    res.status(500).json({ error: "Failed to fetch pickups" });
  }
};

// Confirm pickup & add points
// export const confirmPickup = async (req: Request, res: Response) => {
//   const { pickupId } = req.params;
//   const pickup = await Pickup.findByPk(pickupId);

//   if (!pickup) return res.status(404).json({ error: "Pickup not found" });

//   // تحديث الحالة بدل confirmed boolean
//   pickup.status = "confirmed";
//   await pickup.save();

//   // إضافة النقاط لليوزر
//   const user = await User.findByPk(pickup.userId);
//   if (user) {
//     const pointsToAdd = pickup.quantity * 10; // كل وحدة = 10 نقاط (مثال)
//     user.points += pointsToAdd;
//     await user.save();
//   }

//   res.json({ message: "Pickup confirmed and points updated", pickup });
// };
export const confirmPickup = async (req: Request, res: Response) => {
  try {
    const { pickupId } = req.params; // ✅ جيبه من params مش body
    const pickup = await Pickup.findByPk(pickupId);
    if (!pickup) return res.status(404).json({ message: "Pickup not found" });

    const user = await User.findByPk(pickup.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // حساب النقاط
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
};

export const rejectPickup = async (req: Request, res: Response) => {
  try {
    const pickup = await Pickup.findByPk(req.params.id);
    if (!pickup) {
      return res.status(404).json({ error: "Pickup not found" });
    }

    pickup.status = "rejected";
    await pickup.save();

    res.json({ message: "Pickup rejected successfully", pickup });
  } catch (error) {
    console.error("Error rejecting pickup:", error);
    res.status(500).json({ error: "Failed to reject pickup" });
  }
};
