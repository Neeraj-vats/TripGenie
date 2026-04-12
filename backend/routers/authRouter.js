const express = require("express");
const authRouther = express.Router();

const authController = require("../controllers/authController");

authRouther.post("/signup", authController.postSignup);
authRouther.post("/login", authController.postLogin);
authRouther.get("/logout", authController.logout);
authRouther.post("/forget", authController.forgetPass);
authRouther.post("/otp", authController.enterOtp);
authRouther.post("/newpass/:id", authController.newpass);

module.exports = authRouther;