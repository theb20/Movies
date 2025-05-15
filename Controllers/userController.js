import { connectDB } from "../Config/db.js";
import {mailInscription,mailConnected} from "../Config/sendMail.js";
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
    await mailInscription (email, first_name);
    console.log('Utilisateur créé avec succès!');
    res.status(201).json({ message: "Utilisateur créé" });
   }catch (error){
    console.log('❌', error)
    res.status(500).json({message:'Erreur interne veuillez réessayer plus tard'})
}

};

export const updateUser = async (req, res) => {
    try {
        const db = await connectDB();
        const { name_user, first_name, birthday, email, password, role } = req.body;
        const { id } = req.params;
        if (!name_user ||!first_name ||!birthday ||!email ||!password ||!role) {
            return res.status(400).json({ error: "Tous les champs sont requis" });  
        }
        const [result] = await db.query(
            "UPDATE user SET name_user =?, first_name =?, birthday =?, email =?, pwd_hach =?, role =? WHERE id_user =?",
            [name_user, first_name, birthday, email, password, role, id]
        )
        if (result.affectedRows === 0) return res.status(404).json({ error: "❌ Utilisateur non trouvé" });
        res.status(200).json({ message: "✅ Utilisateur modifié avec succès!" });
    } catch (error) {
        console.error('❌ Erreur lors de la modification:', error);
        res.status(500).json({ error: "Erreur interne" });
    }
}

export const login = async (req, res) => {
    try {
        const db = await connectDB();
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ message: 'Email et mot de passe requis' });
        }

        // Find user by email
        const [user] = await db.query("SELECT * FROM user WHERE email = ?", [email]);
        if (!user.length) {
            console.log('Utilisateur non trouvé ❌');
            return res.status(401).json({ message: '❌ Email ou mot de passe incorrect' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user[0].pwd_hach);
        if (!isValidPassword) {
            console.log('MDP incorrect !');
            return res.status(401).json({ message: '❌ Email ou mot de passe incorrect' });
        }

        // Generate JWT token
        const jwtSecret = process.env.JWT;
        if (!jwtSecret) {
            throw new Error('JWT secret is not configured');
        }

        const token = jwt.sign(
            {   
                id_user: user[0].id_user, 
                name_user: user[0].name_user,
                first_name: user[0].first_name,
                birthday: user[0].birthday,
                email: user[0].email, 
                role: user[0].role 
            },
            jwtSecret,
            { expiresIn: '1h' }
        );

        // Set secure cookie in production
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 3600000,
            sameSite: 'lax',
            secure: false,
          });          

        console.log('Token envoyé');
        await mailConnected (email, user[0].first_name);
        console.log('Utilisateur créé avec succès!');
        res.status(200).json({ 
            message: 'Connexion réussie',
            token 
        });

    } catch (error) {
        console.error('❌ Erreur lors de la connexion:', error);
        res.status(500).json({ message: '❌ Erreur interne veuillez réessayer plus tard' });
    }
};

export const getMe = async (req, res) => {
    try {
        const db = await connectDB();
        const [user] = await db.query("SELECT * FROM user WHERE id_user = ?", [req.user.id_user]);
        
        if (!user.length) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.status(200).json(user[0]);
    } catch (err) {  // Changez 'error' en 'err' ici
        console.error('erreur dans getMe:', err);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

export const logout = (req, res) => {
    res.clearCookie('token'); // Supprime le cookie 'token'
    res.status(200).json({ message: 'Déconnexion réussie' });
}