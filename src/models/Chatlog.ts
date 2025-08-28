import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

interface ChatLogAttributes {
  id: number;
  userId: number;
  message: string;
  reply: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type ChatLogCreationAttributes = Optional<
  ChatLogAttributes,
  "id" | "createdAt" | "updatedAt"
>;

class ChatLog
  extends Model<ChatLogAttributes, ChatLogCreationAttributes>
  implements ChatLogAttributes
{
  public id!: number;
  public userId!: number;
  public message!: string;
  public reply!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ChatLog.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    reply: { type: DataTypes.TEXT, allowNull: false },
  },
  {
    sequelize,
    modelName: "ChatLog",
    tableName: "chat_logs",
  }
);

export default ChatLog;