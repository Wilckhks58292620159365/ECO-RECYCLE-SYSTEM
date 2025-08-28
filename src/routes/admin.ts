import { Router } from "express";
import { adminMiddleware } from "../middleware/adminMiddleware";
import { getAllUsers, toggleUserStatus, getAllPickups, confirmPickup,rejectPickup } from "../controllers/adminController";
const router = Router();

router.get("/users", adminMiddleware, getAllUsers);
router.put("/users/:userId/toggle", adminMiddleware, toggleUserStatus);
router.get("/pickups", adminMiddleware, getAllPickups);
router.put("/pickups/:pickupId/confirm", adminMiddleware, confirmPickup);
router.put("/pickups/:id/reject", adminMiddleware, rejectPickup);

export default router;
