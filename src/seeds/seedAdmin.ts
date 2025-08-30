import bcrypt from "bcryptjs";
import  sequelize  from "../config/database";
import User from "../models/User";

async function seedAdmins() {
  try {
    await sequelize.sync();

    const admins = [
      {
          firstName: "Admin",
        lastName: "One",
        name: "Admin One",
        email: "admin1@example.com",
        password: "Ab123456", // تقدر تغير الباسورد
        role: "admin",
      },
      {
          firstName: "Admin",
        lastName: "Two",
        name: "Admin Two",
        email: "admin2@example.com",
        password: "Ab123456",
        role: "admin",
      },
    ];

    for (const adminData of admins) {
      const existing = await User.findOne({ where: { email: adminData.email } });
      if (!existing) {
        const hashedPassword = await bcrypt.hash(adminData.password, 10);
        await User.create({
          ...adminData,
          password: hashedPassword,
        });
        console.log(`✅ Created admin: ${adminData.email}`);
      } else {
        console.log(`ℹ️ Admin already exists: ${adminData.email}`);
      }
    }

    console.log("✅ Admin seeding complete.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admins:", error);
    process.exit(1);
  }
}

seedAdmins();
