import jwt from 'jsonwebtoken';

export  const generateToken = (userId) => {
    if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN) {
        throw new Error('Error generating token: Missing environment variables');
    };

    const payload = { id: userId };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    return token;
};

export const verifyToken = (token) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('Error verifying token: Missing environment variable JWT_SECRET');
    };

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!decoded || !decoded.id) {
            throw new Error('Error verifying token: Invalid token');
        };
        
        return decoded;
    } catch (error) {
        throw new Error('Error verifying token: Invalid token');
    };
};