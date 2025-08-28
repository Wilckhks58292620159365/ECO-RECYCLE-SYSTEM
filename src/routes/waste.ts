import { Router } from "express";
import auth, { AuthRequest } from "../middleware/auth";
import { upload } from "../middleware/upload";
import Pickup from "../models/Pickup";

const router = Router();

// 🟢 1. Get all pickups for logged in user
router.get("/", auth, async (req: AuthRequest, res) => {
  try {
    const records = await Pickup.findAll({
      where: { userId: req.user!.id },
      order: [["createdAt", "DESC"]],
    });
    return res.json(records);
  } catch (err) {
    console.error("Error fetching pickups:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// 🟢 2. Create new pickup (user)
router.post("/", auth, upload.single("image"), async (req: AuthRequest, res) => {
  try {
    const { description, weight, wasteType, location } = req.body as {
      description: string;
      weight: number;
      wasteType: string;
      location: string;
    };

    if (!weight || !wasteType) {
      return res
        .status(400)
        .json({ error: "weight and wasteType are required" });
    }

    const created = await Pickup.create({
      userId: req.user!.id,
      description,
      quantity: Number(weight),
      date: new Date().toISOString(),
      type: wasteType,
      status: "pending",
      image: req.file?.filename || null
    });

    return res.status(201).json({ id: created.id, status: created.status });
  } catch (err) {
    console.error("Error creating pickup:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// 🟢 3. Admin confirm pickup & assign points
router.put("/:id/confirm", auth, async (req: AuthRequest, res) => {
  try {
    // هنا هتتأكد إن الـ user اللي بيعمل request هو admin
    if (req.user!.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Admins only" });
    }

    const { points } = req.body as { points: number };
    const pickup = await Pickup.findByPk(req.params.id);

    if (!pickup) return res.status(404).json({ error: "Pickup not found" });

    pickup.status = "confirmed";
    pickup.points = points || 0;
    await pickup.save();

    return res.json({ message: "Pickup confirmed", pickup });
  } catch (err) {
    console.error("Error confirming pickup:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
