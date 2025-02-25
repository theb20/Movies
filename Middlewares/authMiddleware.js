import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const verifyToken = (req, res, next) => {
    console.log("🔍 Headers reçus :", req.headers);

    const authHeader = req.headers.authorization; 
    if (!authHeader || !authHeader.startsWith("Bearer ")) { 
        console.error('⚠️ Token manquant ou mal formaté');
        return res.status(401).json({ message: '⚠️ Token manquant ou mal formaté' });
    }

    try {
        const token = authHeader.split(" ")[1]; 
        req.user = jwt.verify(token, process.env.JWT); 
        console.log('✅ Token valide', req.user);
        next();
    } catch (error) {
        console.error('❌ Token invalide:', error.message);
        return res.status(403).json({ message: '❌ Token invalide' });
    }
};


export default verifyToken;
