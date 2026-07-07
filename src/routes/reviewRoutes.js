import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { getBookReviews, createReview, updateReview, deleteReview } from "../controllers/reviewController.js";

const router = express.Router();

router.get("/:id/reviews", getBookReviews);
router.post("/:id/reviews", authenticateToken, createReview);
router.put("/:id/reviews/:reviewId", authenticateToken, updateReview);
router.delete("/:id/reviews/:reviewId", authenticateToken, deleteReview);

export default router;