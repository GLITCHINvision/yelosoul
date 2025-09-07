
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import colors from "colors";
import nodemailer from "nodemailer";


import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import occasionRoutes from "./routes/occasionRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js"; 

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


connectDB();

// CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:3000",
  "http://localhost:5173",
  "https://api.razorpay.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed for this origin"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);


app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(mongoSanitize());
app.use(xss());


const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 200 : 1000,
  message: "Too many requests, please try again later.",
});
app.use("/api", apiLimiter);


app.use(
  "/api/orders/payment",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5000,
  })
);

// Body Parser
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));


if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log(
      `${req.method.yellow} ${req.originalUrl.cyan} - ${new Date().toISOString()}`
    );
    next();
  });
}


app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running smoothly",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});


app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/occasions", occasionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes); 


app.use("/uploads", express.static(path.join(__dirname, "/uploads")));


app.post("/api/send-return", async (req, res) => {
  const { name, email, orderId, reason } = req.body;

  if (!name || !email || !orderId || !reason) {
    return res.status(400).json({
      success: false,
      message: "All fields are required.",
    });
  }

  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "yelosoulstore@gmail.com",
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"YeloSoul Store" <yelosoulstore@gmail.com>`,
      to: "yelosoulstore@gmail.com",
      subject: `Return Request - Order ID: ${orderId}`,
      html: `
        <h3>Return Request</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Reason:</strong> ${reason}</p>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Return request sent successfully.",
    });
  } catch (error) {
    console.error("Email Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
});


app.all("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});


app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON payload, please check your request.",
    });
  }
  next(err);
});


app.use((err, req, res, next) => {
  console.error("Error:".red, err.message);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});


const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.green.bold);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`.yellow);
  console.log(`Health Check: http://localhost:${PORT}/api/health`.cyan);
});


const shutdown = (signal) => {
  console.log(`${signal} received. Shutting down gracefully...`.magenta);
  server.close(() => {
    console.log("Server closed.".red);
    process.exit(0);
  });
};

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:".red, err.message);
  shutdown("UnhandledRejection");
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:".red, err.message);
  shutdown("UncaughtException");
});

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

