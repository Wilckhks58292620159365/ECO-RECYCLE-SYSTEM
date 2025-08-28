// backend/src/routes/chatbot.ts
import { Router } from "express";
import auth from "../middleware/auth";
import { chatbotController } from "../controllers/chatbotController";

const router = Router();
router.post("/", auth, chatbotController.postMessage);
router.get("/history", auth, chatbotController.historyByUser);
export default router;
