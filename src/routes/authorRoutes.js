import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { createAuthor, getAuthors, getAuthorById, updateAuthor, deleteAuthor } from "../controllers/authorController.js";

const router = express.Router();

router.get("/", getAuthors);
router.post("/", authenticateToken, createAuthor);
router.get("/:id", getAuthorById);
router.put("/:id", authenticateToken, updateAuthor);
router.delete("/:id", authenticateToken, deleteAuthor);

export default router;