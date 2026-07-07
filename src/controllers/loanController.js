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

export const getLoans = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.user) filter.user = req.query.user;
    if (req.query.book) filter.book = req.query.book;

    try {
        const loans = await Loan.find(filter).skip(skip).limit(limit)
            .populate("user", "name email")
            .populate("book", "title");
        const total = await Loan.countDocuments(filter);

        res.status(200).json({
            success: true,
            message: "Loans fetched successfully",
            data: loans,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getLoanById = async (req, res) => {
    const { id } = req.params;

    try {
        const loan = await Loan.findById(id)
            .populate("user", "name email")
            .populate("book", "title");

        if (!loan) {
            return res.status(404).json({ success: false, message: "Loan not found" });
        }

        res.status(200).json({ success: true, message: "Loan fetched successfully", data: loan });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const updateLoan = async (req, res) => {
    const { id } = req.params;
    const { dueDate, status } = req.body;

    try {
        const loan = await Loan.findById(id);
        if (!loan) {
            return res.status(404).json({ success: false, message: "Loan not found" });
        }

        if (dueDate) loan.dueDate = dueDate;
        if (status) loan.status = status;

        await loan.save();

        const populatedLoan = await Loan.findById(loan._id)
            .populate("user", "name email")
            .populate("book", "title");

        res.status(200).json({ success: true, message: "Loan updated successfully", data: populatedLoan });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

