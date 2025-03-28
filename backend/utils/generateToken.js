import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config();
console.log(process.env.JWT_KEY)
if (!process.env.JWT_KEY) {
    throw new Error("Missing JWT_KEY in .env file");
}
export const generateToken = (user) => {
 
    return jwt.sign({email: user.email, id:user._id}, process.env.JWT_KEY);
}