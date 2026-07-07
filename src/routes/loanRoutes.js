import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { createLoan, getLoans, getLoanById, updateLoan, deleteLoan } from "../controllers/loanController.js";

const router = express.Router();

router.get("/", authenticateToken, getLoans);
router.get("/:id", authenticateToken, getLoanById);
router.post("/", authenticateToken, createLoan);
router.put("/:id", authenticateToken, updateLoan);
router.delete("/:id", authenticateToken, deleteLoan);

export default router;