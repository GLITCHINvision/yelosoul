
import express from "express";
import { authUser, registerUser } from "../controllers/userController.js";

const router = express.Router();

//  Register new user
router.post("/", registerUser);

//  Login existing user
router.post("/login", authUser);

export default router;
