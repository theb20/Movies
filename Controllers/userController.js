import { connectDB } from "../Config/db.js";
import {mailInscription,mailConnected, sendResetCodeEmail} from "../Config/sendMail.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config();

export const getUser = async (req, res) => {
    try {
        const db = await connectDB();
        const [users] = await db.query("SELECT * FROM user");

        if (!users.length) {
            return res.status(404).json({ message: 'Aucun utilisateur trouvé' });
        }

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erreur interne, veuillez réessayer plus tard' });
    }
};
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
      const { id } = req.params;
      const [users] = await db.query("SELECT * FROM user WHERE id_user = ?", [id]);
      if (!users.length) return res.status(404).json({ error: "Utilisateur non trouvé" });
  
      const u = users[0]; // accès aux données de l'utilisateur
      const data = { // Création d'un objet avec les données modifiées
        name_user: req.body.name_user || u.name_user,
        first_name: req.body.first_name || u.first_name,
        email: req.body.email || u.email,
        role: req.body.role || u.role,
        birthday: req.body.birthday ? new Date(req.body.birthday).toISOString().split('T')[0] : u.birthday,
        pwd_hach: req.body.password ? await bcrypt.hash(req.body.password, 10) : u.pwd_hach
      };

      // Vérification des conditions
      
      // Vérifie si l'email est en cours de modification et s'il n'est pas déjà utilisé par un autre utilisateur
      if (req.body.email && req.body.email !== u.email) {
        const [exists] = await db.query("SELECT id_user FROM user WHERE email = ? AND id_user != ?", [req.body.email, id]);
        // Retourne une erreur si l'email existe déjà
        if (exists.length) return res.status(400).json({ error: "Email déjà utilisé" });
      }
  
      // Valide le rôle s'il est en cours de modification
      if (req.body.role && !["admin", "user", "moderator"].includes(req.body.role)) {
        // Retourne une erreur si le rôle n'est pas l'une des valeurs autorisées
        return res.status(400).json({ error: "Role non valide" });
      }
  
      // Met à jour les informations de l'utilisateur dans la base de données
      const [result] = await db.query(
        "UPDATE user SET name_user=?, first_name=?, birthday=?, email=?, pwd_hach=?, role=? WHERE id_user=?",
        [data.name_user, data.first_name, data.birthday, data.email, data.pwd_hach, data.role, id]
      );
  
      // Vérifie si la mise à jour a réussi
      if (!result.affectedRows) return res.status(404).json({ error: "Utilisateur non trouvé" });
      res.status(200).json({ message: "Utilisateur modifié", user: data });
    } catch (err) {
      console.error("Erreur update:", err);
      res.status(500).json({ error: "Erreur interne" });
    }
}; 
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
            { expiresIn: '2d' }
        );

        // Set secure cookie in production
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 2 * 60 * 60 * 1000, // 2jours
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
export const sendResetCode = async (req, res) => {
    try {
        const db = await connectDB();
        const { email } = req.body; 
        console.log('1')
        const [user] = await db.query("SELECT * FROM user WHERE email =?", [email]);
        if (!user.length) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        console.log('2')
        const resetCode = Math.floor(100000 + Math.random()*900000); 
        console.log('3')// code a 6 chiffres
        await db.query("UPDATE user SET reset_code =? WHERE email =?", [resetCode, email]);

        console.log('4')
        await sendResetCodeEmail(email, user[0].first_name, resetCode)

        res.status(200).json({ message: "Code de réinitialisation envoyé par email" });
        
    }catch (error) {
        console.error("Erreur lors de l'envoi du code de réinitialisation:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
}
export const verifyResetCode = async (req, res) => {
   try{
    const db = await connectDB();
    const { email, resetCode } = req.body;
    console.log("Vérification pour :", email, resetCode);
    if (!email || !resetCode) {
      console.log("Email ou code manquant");
      return res.status(400).json({ message: "Email ou code manquant" })
      
    }
    
    const [user] = await db.query("SELECT * FROM user WHERE email =? AND reset_code =?", [email, resetCode]);
    if (!user.length) {
        return res.status(404).json({ message: "Code invalide" });
    }
    res.status(200).json({ message: "Code valide" });
   }catch (error) {
    console.error("Erreur lors de la vérification du code de réinitialisation:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
   }
}
export const resetPassword = async (req, res) => {
    try {
        const db = await connectDB();
        const { email, resetCode, newPassword } = req.body;
        const [user] = await db.query("SELECT * FROM user WHERE email =? AND reset_code =?", [email, resetCode]);
        if (!user.length) {
           res.status(404).json({ message: "Code invalide" });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.query("UPDATE user SET pwd_hach =?, reset_code =? WHERE email =?", [hashedPassword, null, email]);// remise a null du code de reset
        res.status(200).json({ message: "Mot de passe réinitialisé avec succès" });
    } catch (error) {
        console.error("Erreur lors de la réinitialisation du mot de passe:", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
}
export const deleteUser = async (req, res) => {
    try {
      const db = await connectDB();
      const { id } = req.params;
  
      const [result] = await db.query("DELETE FROM user WHERE id_user = ?", [id]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
  
      res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  
    } catch (error) {
      console.error("Erreur suppression utilisateur :", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  };
   