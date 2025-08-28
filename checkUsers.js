// checkUsers.js
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");

// افتح قاعدة البيانات (تأكد من اسم الملف)
const db = new sqlite3.Database("./database.sqlite");

db.serialize(() => {
  db.all("SELECT id, firstName, lastName, email, password, role, active, points FROM Users", async (err, rows) => {
    if (err) {
      console.error("❌ DB error:", err);
      return;
    }

    if (rows.length === 0) {
      console.log("⚠️ لا يوجد أي مستخدمين في قاعدة البيانات.");
      return;
    }

    console.log("📋 Users in DB:");
    for (const u of rows) {
      console.log(`- ID: ${u.id}, Email: ${u.email}, Role: ${u.role}, Points: ${u.points}, Active: ${u.active}`);
      console.log(`  Hashed password: ${u.password}`);

      // جرب تحقق من الباسورد "123456"
      const testPassword = "123456";
      try {
        const isMatch = await bcrypt.compare(testPassword, u.password);
        console.log(`  Compare with "${testPassword}": ${isMatch ? "✅ match" : "❌ no match"}`);
      } catch (err) {
        console.error("bcrypt error:", err);
      }
    }
  });
});

// اقفل الاتصال لما يخلص
db.close();
