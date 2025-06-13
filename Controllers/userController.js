import {mailInscription,mailConnected, sendResetCodeEmail} from "../Config/sendMail.js";
import { allUser, findByEmail, findById, insertUser, resultUser, updateResetCode, verificationCode, resetUserPassword, deleteByUser } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config();

export const getAllUser = async (req, res) => {
    try {
        const users = await allUser();
        if (!users.length) {
            return res.status(404).json({ message: 'Aucun utilisateur trouvé' });
        }
        res.status(200).json(users);
    } catch (error) {
        console.error('Error in getAllUser:', error);
        res.status(500).json({ message: 'Erreur interne, veuillez réessayer plus tard' });
    }
};
export const createUser = async (req, res) => {
    try {
       const { name_user, first_name, birthday, email, password, role } = req.body;
       if (!name_user || !first_name || !birthday || !email || !password || !role) {
          return res.status(400).json({ error: "Tous les champs sont requis" });
       }
       const existingUsers = await findByEmail(email);
       if(existingUsers) {
          return res.status(400).json({ error: "Cet email est déjà utilisé" });}
       const roleValide = ["admin", "user", "moderator"];
       if (!roleValide.includes(role)) {
          return res.status(400).json({ error: 'Role non valide' });
       }
       const hashedPassword = await bcrypt.hash(password, 10);
       const result = await insertUser(
          name_user,
          first_name,
          birthday,
          email,
          hashedPassword,
          role
       );
 
       console.log("Nouvel user:", result);
 
       await mailInscription(email, first_name);
 
       res.status(201).json({ message: "Utilisateur créé" });
    } catch (error) {
       console.log('❌', error);
       res.status(500).json({ message: 'Erreur interne veuillez réessayer plus tard' });
    }
}; 
export const updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await findById(id);
      if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
      // Créer un objet avec les nouvelles données
      const data = {
        name_user: req.body.name_user || user.name_user,
        first_name: req.body.first_name || user.first_name,
        email: req.body.email || user.email,
        role: req.body.role || user.role,
        birthday: req.body.birthday
          ? new Date(req.body.birthday).toISOString().split("T")[0]
          : user.birthday,
        pwd_hach: req.body.password
          ? await bcrypt.hash(req.body.password, 10)
          : user.pwd_hach,
      };
      // Vérification du rôle
      if (req.body.role && !["admin", "user", "moderator"].includes(req.body.role)) {
        return res.status(400).json({ error: "Role non valide" });
      }
      // Appel de la fonction qui met à jour l'utilisateur (tu dois adapter selon ta fonction réelle)
      const result = await resultUser(
        data.name_user,
        data.first_name,
        data.birthday,
        data.email,
        data.pwd_hach,
        data.role,
        id
      );
      if (!result.affectedRows) {
        console.log('erreur de mise a jour')
        return res.status(404).json({ error: "Mise à jour échouée" });
      }
      res.status(200).json({ message: "Utilisateur modifié", user: data });
  
    } catch (err) {
      console.error("Erreur update:", err);
      res.status(500).json({ error: "Erreur interne" });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ message: 'Email et mot de passe requis' });
        }
        // Find user by email
        const user = await findByEmail(email);
if (!user || user.length === 0) {
    console.log('Utilisateur non trouvé ❌');
    return res.status(401).json({ message: '❌ Email ou mot de passe incorrect' });
}
// Vérifie le mot de passe
const isValidPassword = await bcrypt.compare(password, user.pwd_hach);
      
        if (!isValidPassword) {
            console.log('MDP incorrect !');
            return res.status(401).json({ message: '❌ Email ou mot de passe incorrect' });
        }
        // Generate JWT token
        const jwtSecret = process.env.JWT;
        console.log('8')
        if (!jwtSecret) {
            throw new Error('JWT secret is not configured');
        }
        const token = jwt.sign(
            {   
                id_user: user.id_user, 
                name_user: user.name_user,
                first_name: user.first_name,
                birthday: user.birthday,
                email: user.email, 
                role: user.role 
            },
            jwtSecret,
            { expiresIn: '2d' }
        );
        // Set secure cookie in production
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 2 * 60 * 60 * 1000, // 2jours
            sameSite: 'lax',
            secure: false,
          });          
        await mailConnected (email, user.first_name);
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
        // Get user ID from authenticated request instead of params
        const id = req.user?.id_user;
        if (!id) {
            return res.status(401).json({ message: "Non authentifié" });
        }
        const user = await findById(id);
        
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        res.status(200).json(user);
    } catch (err) {  
        console.error('erreur dans getMe:', err);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};
export const logout = (req, res) => {
    res.clearCookie('token'); // Supprime le cookie 'token'
    res.status(200).json({ message: 'Déconnexion réussie' });
}
export const sendResetCode = async (req, res) => {
    try {
        const {email}  = req.body; 
        const user = await findByEmail(email);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        const resetCode = Math.floor(100000 + Math.random()*900000); 
        await updateResetCode(resetCode, email);

        await sendResetCodeEmail(email, user.first_name, resetCode)

        res.status(200).json({ message: "Code de réinitialisation envoyé par email" });
        
    }catch (error) {
        console.error("Erreur lors de l'envoi du code de réinitialisation:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
}
export const verifyResetCode = async (req, res) => {
   try{
    const { email, resetCode } = req.body;
    console.log("Vérification pour :", email, resetCode);
    if (!email || !resetCode) {
      console.log("Email ou code manquant");
      return res.status(400).json({ message: "Email ou code manquant" })
      
    }
    console.log('1')
    
    const user = await verificationCode(resetCode, email);
    if (!user) {
        return res.status(404).json({ message: "Code invalide" });
    }
    console.log('2')

    res.status(200).json({ message: "Code valide" });
   }catch (error) {
    console.error("Erreur lors de la vérification du code de réinitialisation:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
   }
}
export const resetPassword = async (req, res) => {
    try {
      const { email, resetCode, newPassword } = req.body;
  
      const user = await verificationCode(resetCode, email);
      if (!user) {
        return res.status(404).json({ message: "Code invalide" });
      }
  
      await resetUserPassword(newPassword, email); // appel de la vraie fonction de reset
  
      res.status(200).json({ message: "Mot de passe réinitialisé avec succès" });
    } catch (error) {
      console.error("Erreur lors de la réinitialisation du mot de passe:", error);
      res.status(500).json({ message: "Erreur interne du serveur" });
    }
  };
export const deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
  
      const result = await deleteByUser(id);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
  
      res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  
    } catch (error) {
      console.error("Erreur suppression utilisateur :", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  };
   