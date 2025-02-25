import { connectDB } from "../Config/db.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config();

export const getUser = async (req, res) => {
    try {
        const db = await connectDB();
        const [user] = await db.query ("SELECT * FROM user WHERE id_user = ?", [req.params.id]);
        if(!user.length){
            return res.status(404).json({message: '❌ Utilisateur impossible a trouver'})
        }
        console.log("+1 req save !⏺️");
        res.status(200).json(user[0])
    }catch (error){
        console.log('❌', error)
        res.status(500).json({message:'Erreur interne veuillez réessayer plus tard'})
    }
}

export const createUser = async (req, res) => {
   try{
    const db = await connectDB();

    const { name_user, first_name, birthday, email, password, role } = req.body;
         if (!name_user || !first_name || !birthday || !email || !password || !role) {
            return res.status(400).json({ error: "Tous les champs sont requis" });
    }

    const [existingUsers] =await db.query('SELECT id_user FROM user WHERE email = ?', [email])
    if (existingUsers.length > 0) {
        return res.status(400).json({error:'Ce mail est déjà utilisé'})
    }

    const roleValide = ["admin", "user", "moderator"];
    if(!roleValide.includes(role)){
        return res.status(400).json({error: 'Role non valide'})
    }

    const hashedPassword = await bcrypt.hash(password,10);
    await db.query(
        "INSERT INTO user (name_user, first_name, birthday, email, pwd_hach, role, inscription_date) VALUES (?, ?, ?, ?, ?, ?, NOW())",
        [name_user, first_name, birthday, email, hashedPassword, role]
      );
      res.status(201).json({ message: "Utilisateur créé" });
   }catch (error){
    console.log('❌', error)
    res.status(500).json({message:'Erreur interne veuillez réessayer plus tard'})
}

};

export const login = async (req, res) => {
    try {
        const db = await connectDB();
        const { email, password } = req.body;

        const [user] = await db.query("SELECT * FROM user WHERE email = ?", [email]);
        if (!user.length) {
            console.log('Utilisateur non trouvé ❌');
            return res.status(404).json({ message: '❌ Utilisateur impossible a trouver'})
        }

        const isValiPassword = await bcrypt.compare(password, user[0].pwd_hach);
        if(!isValiPassword){
            console.log('MDP incorrect !')
            return res.status(404).json({message:'❌ Mot de passe incorrect' })
        }

        const reqJWT= process.env.JWT
        const token = jwt.sign(
            {   id_user: user[0].id_user, 
                email: user[0].email, 
                role: user[0].role 
            },
            reqJWT,
            { expiresIn: '1h' }
        );
        console.log('Token envoyé');
        res.status(200).json({ token });

    }catch(error){
        console.error('❌Erreur interne veuillez réessayer plus tard', error);
        res.status(500).json({error:'❌Erreur interne veuillez réessayer plus tard'})

    }
}