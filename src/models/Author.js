import mongoose from 'mongoose';

const authorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        biography: {
            type: String,
            default: ""
        },
        country: {
            type: String,
            trim: true,
            default: ""
        },
        dateOfBirth: {
            type: Date
        }
    }, { timestamps: true }
);

export default mongoose.model('Author', authorSchema);