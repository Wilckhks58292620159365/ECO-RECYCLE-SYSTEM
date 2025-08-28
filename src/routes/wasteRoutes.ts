import { Router } from "express";
import { wasteController } from "../controllers/wasteController";
import auth from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();

// user: يعمل عملية pickup
router.post("/", auth, upload.single("image"), wasteController.create);

// user: يشوف كل العمليات بتاعته
router.get("/me", auth, wasteController.myPickups);

// admin: يشوف كل العمليات
router.get("/", wasteController.allPickups);

// admin: يعمل confirm لعملية ويدي نقاط
router.post("/confirm", wasteController.confirm);

export default router;
