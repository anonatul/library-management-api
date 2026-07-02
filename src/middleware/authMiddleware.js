import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';

export const autheticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: 'Authorization header is missing'
        });
    };

    const token = authHeader.split(' ')[1];

    if(!token) {
        return res.status(401).json({
            success: false,
            message: "Token is missing"
        });
    };

    try {
        const decoded = verifyToken(token);
       
        const user = await User.findById(decoded.id).select('-password');
       
        if(!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        };
       
        req.user = user;
       
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    };
};