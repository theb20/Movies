import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) { 
        return res.status(401).json({ message: 'Missing or malformed token' });
    }

    try {
        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT);        
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token' });
    }
};


export default verifyToken;
