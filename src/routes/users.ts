import { Router } from "express";
import auth, { AuthRequest } from "../middleware/auth";
import User from "../models/User";


const router = Router();


router.get("/me", auth, async (req: AuthRequest, res) => {
const user = await User.findByPk(req.user!.id);
if (!user) return res.status(404).json({ error: "User not found" });
return res.json({
id: user.id,
email: user.email,
firstName: user.firstName,
lastName: user.lastName,
role: user.role,
points: user.points,
active: user.active,
});
});


export default router;