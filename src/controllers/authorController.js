import Author from "../models/Author.js";

export const createAuthor = async (req, res) => {
    const { name, biography, country, dateOfBirth } = req.body;

    if (!name) {
        return res.status(400).json({
            success: false,
            message: "Author name is required"
        });
    };

    try {
        const author = await Author.create({ name, biography, country, dateOfBirth});
        
        res.status(201).json({
            success: true,
            message: "Author created successfully",
            data: author
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    };
};

export const getAuthors = async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.name) {
        filter.name = { $regex: req.query.name, $options: 'i' };
    }

    if (req.query.country) {
        filter.country = req.query.country;
    }

    try {
        const authors = await Author.find(filter).skip(skip).limit(limit);

        const totalAuthors = await Author.countDocuments(filter);

        res.status(200).json({
            success: true,
            message: "Authors fetched successfully",
            data: authors,
            pagination: {
                page,
                limit,
                total: totalAuthors,
                totalPages: Math.ceil(totalAuthors / limit)
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const getAuthorById = async (req, res) => {
    const { id } = req.params;

    try {
        const author = await Author.findById(id);

        if (!author) {
            return res.status(404).json({
                success: false,
                message: "Author not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Author fetched successfully",
            data: author
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const updateAuthor = async (req, res) => {
    const { id } = req.params;
    const { name, biography, country, dateOfBirth } = req.body;

    try {
        const author = await Author.findById(id);

        if (!author) {
            return res.status(404).json({
                success: false,
                message: "Author not found"
            });
        }

        author.name = name || author.name;
        author.biography = biography || author.biography;
        author.country = country || author.country;
        author.dateOfBirth = dateOfBirth || author.dateOfBirth;

        await author.save();

        res.status(200).json({
            success: true,
            message: "Author updated successfully",
            data: author
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const deleteAuthor = async (req, res) => {
    const { id } = req.params;

    try {
        const author = await Author.findById(id);

        if (!author) {
            return res.status(404).json({
                success: false,
                message: "Author not found"
            });
        }

        await author.deleteOne();

        res.status(200).json({
            success: true,
            message: "Author deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
