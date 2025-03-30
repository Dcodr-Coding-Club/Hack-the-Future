import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Ensure JWT_KEY is properly loaded
if (!process.env.JWT_KEY) {
    throw new Error("Missing JWT_KEY in .env file");
}

export const generateToken = (user) => {
    return jwt.sign(
        {
            email: user.email,
            id: user._id,
            username: user.username,  // Include username in the token
        },
        process.env.JWT_KEY,
        { expiresIn: "7d" }  // Set expiration time for security
    );
};
