import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import sequelize from "./config/database";
import { applyAssociations } from "./models/associations";
import { seedAdmins } from "./seeds/admin";

import "./models/User";
import "./models/Pickup";
import "./models/PickupLocation";
import "./models/Chatlog"; // ✅ إصلاح حساسية الحروف


import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import waste from "./routes/waste";
import adminRoutes from "./routes/admin";
import locationRoutes from "./routes/locations";
import chatbotRoutes from "./routes/chatbot";


dotenv.config();


const app = express();
const PORT = parseInt(process.env.PORT || "5000", 10);


app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/waste", waste);
app.use("/api/admin", adminRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

applyAssociations();


(async () => {
try {
await sequelize.authenticate();
await sequelize.sync({ alter: true });
await seedAdmins();
console.log("✅ DB connected & synced (SQLite).");
app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Backend running at http://0.0.0.0:${PORT}`));
} catch (e) {
console.error("DB connection failed", e);
process.exit(1);
}
})();


export default app;