import { connectDB } from "../Config/db.js";
import bcrypt from "bcrypt";

// Obtenir tous les utilisateurs
export const allUser = async (req, res) => {
  try {
    const db = await connectDB();
    const [users] = await db.query("SELECT * FROM user");
    return users
  } catch (error) {
    console.error("❌ getUser:", error);
    res.status(500).json({ message: "Erreur interne, veuillez réessayer plus tard." });
  }
};
// recherche par email
export const findByEmail = async (email) => {
  try {
    const db = await connectDB();
    const [user] = await db.query("SELECT * FROM user WHERE email = ?", [email]);
    return user[0];
  } catch (error) {
    console.error("❌ getUser:", error);
    throw new Error("Erreur interne, veuillez réessayer plus tard.");
  }
}
// recherche par id
export const findById = async (id) => {
  try {
    const db = await connectDB();
    const [user] = await db.query("SELECT * FROM user WHERE id_user =?", [id]);
    return user[0];
  } catch (error) {
    console.error("❌ getUser:", error);
    throw new Error("Erreur interne, veuillez réessayer plus tard.");
  }
}
// insertion d'un utilisateur
export const insertUser = async (name_user, first_name, birthday, email, hashedPassword, role) => {
  try {
    const db = await connectDB();
    const [result] = await db.query("INSERT INTO user (name_user, first_name, birthday, email, pwd_hach, role, inscription_date) VALUES (?, ?, ?, ?, ?, ?, NOW())",
        [name_user, first_name, birthday, email, hashedPassword, role]);
    return result.insertId;
  } catch (error) {
    console.error("❌ insertUser:", error);
    throw new Error("Erreur interne, veuillez réessayer plus tard.");
  }
}
// mise à jour d'un utilisateur
export const resultUser = async (name_user, first_name, birthday, email, pwd_hach, role, id) => {
    try {
      const db = await connectDB();
      const [result] = await db.query(
        "UPDATE user SET name_user = ?, first_name = ?, birthday = ?, email = ?, pwd_hach = ?, role = ? WHERE id_user = ?",
        [name_user, first_name, birthday, email, pwd_hach, role, id]
      );
      return result; // retourne l'objet complet pour accéder à affectedRows
    } catch (error) {
      console.error("❌ resultUser:", error);
      throw new Error("Erreur interne, veuillez réessayer plus tard.");
    }
};
export const updateResetCode = async (resetCode, email) => {
  try {
    const db = await connectDB();
    const [result] = await db.query("UPDATE user SET reset_code =? WHERE email =?", [resetCode, email]);
    return result;
  } catch (error) {
    console.error("❌ updateResetCode:", error);
    throw new Error("Erreur interne, veuillez réessayer plus tard.");
  }
}
export const verificationCode = async (resetCode, email) => {
  try {
    const db = await connectDB();
    const [result] = await db.query("SELECT * FROM user WHERE reset_code =? AND email =?", [resetCode, email]);
    return result[0];
  } catch (error) {
    console.error("❌ verificationCode:", error);
    throw new Error("Erreur interne, veuillez réessayer plus tard.");
  }
}
export const resetUserPassword = async (newPassword, email) => {
  try {
    const db = await connectDB();
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const [result] = await db.query(
      "UPDATE user SET pwd_hach = ?, reset_code = NULL WHERE email = ?",
      [hashedPassword, email]
    );

    return result[0];
  } catch (error) {
    console.error("❌ resetPassword:", error);
    throw new Error("Erreur interne, veuillez réessayer plus tard.");
  }
};
// Suppression d'un utilisateur
export const deleteByUser = async (id) => {
  try {
    const db = await connectDB();
    const [result] = await db.query("DELETE FROM user WHERE id_user =?", [id]);
    return result;
  } catch (error) {
    console.error("❌ deleteUser:", error);
    throw new Error("Erreur interne, veuillez réessayer plus tard.");
  }
}
