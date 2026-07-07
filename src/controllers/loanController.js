import Loan from "../models/Loan.js";
import Book from "../models/Book.js";

export const createLoan = async (req, res) => {
    const { book: bookId, dueDate } = req.body;

    if (!bookId) {
        return res.status(400).json({ success: false, message: "Book ID is required" });
    }

    try {
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }

        if (book.availableCopies <= 0) {
            return res.status(400).json({ success: false, message: "No copies available" });
        }

        book.availableCopies -= 1;
        await book.save();

        const loan = await Loan.create({
            user: req.user._id,
            book: bookId,
            dueDate: dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        });

        const populatedLoan = await Loan.findById(loan._id)
            .populate("user", "name email")
            .populate("book", "title");

        res.status(201).json({
            success: true,
            message: "Loan created successfully",
            data: populatedLoan
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};