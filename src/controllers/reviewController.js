import Review from "../models/Review.js";
import Book from "../models/Book.js";

export const getBookReviews = async (req, res) => {
    const { id: bookId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        const reviews = await Review.find({ book: bookId }).skip(skip).limit(limit)
            .populate("user", "name email");
        const total = await Review.countDocuments({ book: bookId });

        res.status(200).json({
            success: true,
            message: "Reviews fetched successfully",
            data: reviews,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};