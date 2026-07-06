import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { getBooks, getBookById, createBook, updateBook, deleteBook, uploadBookCover } from "../controllers/bookController.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getBooks);
router.get("/:id", getBookById);
router.post("/", authenticateToken, createBook);
router.put("/:id", authenticateToken, updateBook);
router.delete("/:id", authenticateToken, deleteBook);
router.patch(
    "/:id/upload-cover",
    authenticateToken,
    (req, res, next) => {
        upload.single("coverImage")(req, res, (err) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: err.message || "File upload failed"
                });
            }
            next();
        });
    },
    uploadBookCover
);

export default router;