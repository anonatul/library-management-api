import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    profilePicture: {
        type: String,
        default: null
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
},
{
        timestamps: true
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))  return next();

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);