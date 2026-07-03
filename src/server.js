import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Library Management API is running.."
    })
});

// --- Auth Routes ---
app.use("/api/auth", authRoutes);

// --- Book Routes ---
app.use("/api/books", bookRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});