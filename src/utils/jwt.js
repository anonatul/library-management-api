import jwt from 'jsonwebtoken';

export  const generateToken = (userId) => {
    if (!process.env.JWT_SECRET || !process.env.JWT_EXPIRES_IN) {
        throw new Error('Error generating token: Missing environment variables');
    };

    const payload = { id: userId };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    return token;
};