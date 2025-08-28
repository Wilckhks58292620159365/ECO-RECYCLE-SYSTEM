import { Request, Response } from "express";
import { chatService } from "../services/chatService";
import { AuthRequest } from "../middleware/auth";

// ردود بسيطة rule-based بالعربي
function generateBotReply(input: string): string {
  const text = (input || "").toLowerCase();

  if (text.includes("تسجيل") || text.includes("register") || text.includes("signup")) {
    return "لتسجيل حساب جديد: افتح صفحة إنشاء الحساب، اكتب الإيميل وكلمة المرور ثم اضغط إنشاء. بعدها هتستلم توكن للتسجيل.";
  }
  if (text.includes("تسجيل دخول") || text.includes("login") || text.includes("signin")) {
    return "لتسجيل الدخول: أدخل الإيميل وكلمة المرور، ولو الحساب موقوف كلم الأدمن لتفعيله.";
  }
  if (text.includes("نقاط") || text.includes("points")) {
    return "النقاط بتتحسب بعد ما الأدمن يعمل تأكيد للـ pickup. كل كمية لها نقاط افتراضية، وقد يتم تعديلها حسب النوع.";
  }
  if (text.includes("رفع صورة") || text.includes("upload") || text.includes("صورة")) {
    return "ارفع صورة واضحة للنفايات، النوع والكمية، ويُفضّل تصويرها على خلفية نظيفة. الأنواع المسموحة: jpg/png/svg/webp بحد أقصى 5MB.";
  }
  if (text.includes("خريطة") || text.includes("map") || text.includes("leaflet")) {
    return "هتلاقي خريطة تفاعلية (Leaflet) بتحدد مواقع الاستلام في الإمارات وموقعك الحالي، وتقدر تفتح الموقع في Google Maps.";
  }
  if (text.includes("ادمن") || text.includes("admin") || text.includes("لوحة")) {
    return "لوحة الأدمن تعرض كل العمليات، وتقدر تعمل Confirm وتوقف/تفعل مستخدمين. الدخول بحساب أدمن فقط.";
  }
  return "أهلاً! اسألني أي حاجة عن التسجيل، تسجيل الدخول، النقاط، أو كيفية إنشاء عملية Pickup.";
}

export const chatbotController = {
  // POST /api/chat/message
  async postMessage(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { message } = req.body as { message: string };

      if (!message || !message.trim()) {
        return res.status(400).json({ error: "message is required" });
      }

      const userMsg = await chatService.addMessage(userId, "user", message.trim());
      const replyText = generateBotReply(message);
      const botMsg = await chatService.addMessage(userId, "bot", replyText);

      return res.status(201).json({
        reply: botMsg.message,
        userMessageId: userMsg.id,
        botMessageId: botMsg.id,
      });
    } catch (err) {
      console.error("Chat post error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // GET /api/chat/history
  async myHistory(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const history = await chatService.getHistoryByUser(userId, 200);
      return res.json(history);
    } catch (err) {
      console.error("Chat history error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // GET /api/chat/history/:userId  (Admins only)
  async historyByUser(req: AuthRequest, res: Response) {
    try {
      const targetUserId = Number(req.params.userId);
      const history = await chatService.getHistoryByUser(targetUserId, 500);
      return res.json(history);
    } catch (err) {
      console.error("Admin chat history error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};
