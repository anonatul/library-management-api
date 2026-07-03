import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        required: true
    },
    category: {
        type: String,
        required: true
    },
    isbn: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    publishedYear: {
        type: Number
    },
    totalCopies: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    availableCopies: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    coverImage: {
        type: String,
        default: ""
    }
}, { timestamps: true });        

export default mongoose.model('Book', bookSchema);