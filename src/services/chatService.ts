import ChatbotMessage from "../models/ChatbotMessage";

export const chatService = {
  async addMessage(userId: number, role: "user" | "bot", message: string) {
    return ChatbotMessage.create({ userId, role, message });
  },

  async getHistoryByUser(userId: number, limit = 50) {
    return ChatbotMessage.findAll({
      where: { userId },
      order: [["createdAt", "ASC"]],
      limit,
    });
  },

  async listUsersWithLastMessage() {
    // اختياري: لو حبيت تعرض لليوزرز اللي عندهم محادثات
    return ChatbotMessage.findAll({
      attributes: ["userId"],
      group: ["userId"],
      order: [["userId", "ASC"]],
    });
  },
};
