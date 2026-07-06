import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { getUsers, getUserById, uploadProfilePicture, updateUser } from "../controllers/userController.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", authenticateToken, getUsers);
router.patch(
    "/upload-profile-picture",
    authenticateToken,
    (req, res, next) => {
        upload.single("profilePicture")(req, res, (err) => {
            if (err) return res.status(400).json({ success: false, message: err.message });
            next();
        });
    },
    uploadProfilePicture
);
router.get("/:id", authenticateToken, getUserById);
router.put("/:id", authenticateToken, updateUser);

export default router;