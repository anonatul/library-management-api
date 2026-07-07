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

export const createReview = async (req, res) => {
    const { id: bookId } = req.params;
    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });
    }

    try {
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }

        const existing = await Review.findOne({ user: req.user._id, book: bookId });
        if (existing) {
            return res.status(409).json({ success: false, message: "You already reviewed this book" });
        }

        const newReview = await Review.create({
            user: req.user._id,
            book: bookId,
            rating,
            review
        });

        const populatedReview = await Review.findById(newReview._id).populate("user", "name email");

        res.status(201).json({ success: true, message: "Review created successfully", data: populatedReview });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};