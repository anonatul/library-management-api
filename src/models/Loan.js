import mongoose from "mongoose";

const loanSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true
    },
    loanDate: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: true
    },
    returnedDate: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ["active", "returned", "overdue"],
        default: "active"
    }
}, { timestamps: true });

export default mongoose.model("Loan", loanSchema);