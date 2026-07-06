import Book from "../models/Book.js";
import Author from "../models/Author.js";

export const createBook = async (req, res) => {
    const { title, author, category, isbn, description, publishedYear, totalCopies, availableCopies, coverImage } = req.body;

    // checking for all required fields
    if (!title || !author || !category || !isbn) {
        return res.status(400).json({
            success: false,
            message: "All required fields are missing"
        });
    };

    if (totalCopies < 0 || availableCopies < 0) {
        return res.status(400).json({
            success: false,
            message: "Copies fields are required"
        });
    };

    try {
        // checking if book already exists
        const bookExists = await Book.findOne({ isbn });

        if (bookExists) {
            return res.status(409).json({
                success: false,
                message: "Book already exists"
            });
        };

        // creating new book in db
        const book = await Book.create({
            title,
            author,
            category,
            isbn,
            description,
            publishedYear,
            totalCopies,
            availableCopies,
            coverImage
        });

        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: book
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    };
};

export const getBooks = async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // filtering books based on query parameters
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.author) filter.author = req.query.author;
    if (req.query.title) filter.title = { $regex: req.query.title, $options: 'i' };
    if (req.query.publishedYear) filter.publishedYear = parseInt(req.query.publishedYear);
    if (req.query.minYear || req.query.maxYear) {
        filter.publishedYear = {};
        if (req.query.minYear) filter.publishedYear.$gte = parseInt(req.query.minYear);
        if (req.query.maxYear) filter.publishedYear.$lte = parseInt(req.query.maxYear);
    };

    try {

        const books = await Book.find(filter).skip(skip).limit(limit).populate("author", "name");
        
        const total = await Book.countDocuments(filter);
        res.status(200).json({
            success: true,
            message: "Books retrieved successfully",
            data: books,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    };
};

export const getBookById = async (req, res) => {
    const { id } = req.params;
    
    try {
        const book = await Book.findById(id).populate("author", "name");
        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Book retrieved successfully",
            data: book
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const updateBook = async (req, res) => {
    const { id } = req.params;
    const { title, author, category, isbn, description, publishedYear, totalCopies, availableCopies, coverImage } = req.body;

    try {
        const book = await Book.findByIdAndUpdate(id, {
            title,
            author,
            category,
            isbn,
            description,
            publishedYear,
            totalCopies,
            availableCopies,
            coverImage
        }, { new: true }).populate("author", "name");

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data: book
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const deleteBook = async (req, res) => {
    const { id } = req.params;

    try {
        const book = await Book.findByIdAndDelete(id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Book deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    };
};