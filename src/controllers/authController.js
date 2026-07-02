import User from "../models/User.js";
import { generateToken } from "../utils/jwt.js";

export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    // checking for all required fields
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    };
    
    try {
        
        // checking if user already exists
        const userExists = await User.findOne({
            email: email.toLowerCase()
        });
    
        if (userExists) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        };

        // creating new user in db
        const user = await User.create({
            name: name,
            email: email,
            password: password
        });

        // generating token for the new user
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    profilePicture: user.profilePicture,
                    role: user.role,
                    createdAt: user.createdAt
                },
                token: token
            }
        });
    } catch (error) {
        console.error(`Error registering user: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    };
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // checking for all required fields
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    };

    try {
        // checking if user exists
        const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        };

        // checking if password is correct or not
        const isCorrectPassword = await user.comparePassword(password);
        
        if (!isCorrectPassword) {
             return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        };

        // generating token for the user
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: "User logged in successfully", 
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    profilePicture: user.profilePicture,
                    role: user.role,
                    createdAt: user.createdAt
                },
                token: token
            }
        });
    } catch (error) {
        console.error(`Error logging in user: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    };
};