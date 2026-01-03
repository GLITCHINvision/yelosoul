
import express from "express";
import { authUser, registerUser, forgotPassword, resetPassword } from "../controllers/userController.js";

const router = express.Router();

//  Register new user
router.post("/", registerUser);

//  Login existing user
router.post("/login", authUser);

// Forgot & Reset Password
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
