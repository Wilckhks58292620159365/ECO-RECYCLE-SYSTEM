import User from "./User";
import Pickup from "./Pickup";
import ChatLog from "./Chatlog"; // ✅ إصلاح حساسية الحروف


export function applyAssociations() {
User.hasMany(Pickup, { foreignKey: "userId", as: "pickups", onDelete: "CASCADE" });
Pickup.belongsTo(User, { foreignKey: "userId", as: "user" });


User.hasMany(ChatLog, { foreignKey: "userId", as: "chatLogs", onDelete: "CASCADE" });
ChatLog.belongsTo(User, { foreignKey: "userId", as: "user" });
}