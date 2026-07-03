import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { getBooks, getBookById, createBook, updateBook, deleteBook } from "../controllers/bookController.js";

const router = express.Router();

router.get("/", getBooks);
router.get("/:id", getBookById);
router.post("/", authenticateToken, createBook);
router.put("/:id", authenticateToken, updateBook);
router.delete("/:id", authenticateToken, deleteBook);

export default router;