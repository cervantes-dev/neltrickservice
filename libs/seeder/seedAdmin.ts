import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import connectionToDatabase from "../db/index";
import User from "../model/user";
import bcrypt from "bcrypt";

const seedAdmin = async () => {
  try {
    await connectionToDatabase();

    // Check if admin already exists
    const adminExists = await User.findOne({ role: "admin" });
    if (adminExists) {
      console.log("Admin already exists:", adminExists.email);
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("admin123", 10);

    // Create admin
    const admin = await User.create({
      email: "admin@email.com",
      password: hashedPassword,
      role: "admin",
      isVerified: true,
    });

    console.log("Admin created successfully:", admin.email);
    process.exit(0);
  } catch (err) {
    console.error("Seeder failed:", err);
    process.exit(1);
  }
};

seedAdmin();