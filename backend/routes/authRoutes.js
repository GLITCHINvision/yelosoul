import express from "express";
import { signup, login } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);  //  Signup Route
router.post("/login", login);    //  Login Route

export default router;

