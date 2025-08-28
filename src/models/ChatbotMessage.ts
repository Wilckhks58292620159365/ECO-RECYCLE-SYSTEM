import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

export interface ChatbotMessageAttributes {
  id: number;
  userId: number;
  role: "user" | "bot";
  message: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type ChatbotMessageCreation = Optional<ChatbotMessageAttributes, "id" | "createdAt" | "updatedAt">;

class ChatbotMessage
  extends Model<ChatbotMessageAttributes, ChatbotMessageCreation>
  implements ChatbotMessageAttributes
{
  public id!: number;
  public userId!: number;
  public role!: "user" | "bot";
  public message!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ChatbotMessage.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    role: { type: DataTypes.ENUM("user", "bot"), allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
  },
  {
    sequelize,
    modelName: "ChatbotMessage",
    tableName: "chatbot_messages",
  }
);

export default ChatbotMessage;
