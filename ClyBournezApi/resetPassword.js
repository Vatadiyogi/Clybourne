const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user.model"); // make sure the path is correct

// Replace this with the admin email you want to reset
const ADMIN_EMAIL = "sandeep@vmail.in"; 
const NEW_PASSWORD = "123456"; // choose your new password

mongoose.connect("mongodb+srv://vishnu:741374666@devdexaadiyogi.gtsxnin.mongodb.net/clybourne")
  .then(async () => {
    console.log("✅ Connected to MongoDB Atlas");

    // 1️⃣ Find admin
    const admin = await User.findOne({ email: ADMIN_EMAIL });
    if (!admin) {
      console.log("❌ Admin not found!");
      process.exit();
    }

    console.log("Admin found:", admin.email);

    // 2️⃣ Hash the new password
    const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 10);

    // 3️⃣ Update the correct field
    admin.adminPassword = hashedPassword;

    // 4️⃣ Save to DB
    await admin.save();

    console.log("✅ Admin password reset successful!");
    console.log(`👉 New password: ${NEW_PASSWORD}`);
    process.exit();
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
  });
