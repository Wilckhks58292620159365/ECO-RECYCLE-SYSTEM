// backend/src/seeds/admin.ts
import User from "../models/User";

export async function seedAdmins() {
  const admins = [
    {
      firstName: "Ahmed",
      lastName: "Admin",
      email: "ahmedsadek2879@gmail.com",
      password: "Ab123456",
      role: "admin" as const,
    },
    {
      firstName: "Ali",
      lastName: "Admin",
      email: "alielramithy@gmail.com",
      password: "Ab123456",
      role: "admin" as const,
    },
  ];

  for (const a of admins) {
    const exists = await User.scope("withPassword").findOne({ where: { email: a.email.toLowerCase() } });
    if (!exists) await User.create(a); // الـ hook هيهشفر الباسورد
  }
}
