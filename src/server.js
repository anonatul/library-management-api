import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import authorRoutes from "./routes/authorRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
// connectDB();

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

// --- Author Routes ---
app.use("/api/authors", authorRoutes);

// --- User Routes ---
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server running on port http://localhost:${PORT}`);
    });
};

startServer();