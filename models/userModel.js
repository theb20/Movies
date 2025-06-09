import { connectDB } from "../Config/db.js";

// Obtenir tous les utilisateurs
export const getUser = async (req, res) => {
  try {
    const db = await connectDB();
    const [users] = await db.query("SELECT * FROM user");
    res.status(200).json(users);
  } catch (error) {
    console.error("❌ getUser:", error);
    res.status(500).json({ message: "Erreur interne, veuillez réessayer plus tard." });
  }
};

// Trouver un utilisateur par email
export const findUserByEmail = async (email) => {
  try {
    const db = await connectDB();
    const [user] = await db.query("SELECT * FROM user WHERE email = ?", [email]);
    return user;
  } catch (error) {
    console.error("❌ findUserByEmail:", error);
    throw new Error("Erreur interne, veuillez réessayer plus tard.");
  }
};

// Insérer un nouvel utilisateur
export const insertUser = async ({ name_user, first_name, birthday, email, hashedPassword, role }) => {
  try {
    const db = await connectDB();
    await db.query(
      "INSERT INTO user (name_user, first_name, birthday, email, pwd_hach, role, inscription_date) VALUES (?, ?, ?, ?, ?, ?, NOW())",
      [name_user, first_name, birthday, email, hashedPassword, role]
    );
  } catch (error) {
    console.error("❌ insertUser:", error);
    throw new Error("Erreur interne, veuillez réessayer plus tard.");
  }
};

// Trouver un utilisateur par ID
export const findUserById = async (id) => {
  try {
    const db = await connectDB();
    const [user] = await db.query("SELECT * FROM user WHERE id_user = ?", [id]);
    return user;
  } catch (error) {
    console.error("❌ findUserById:", error);
    throw new Error("Erreur interne, veuillez réessayer plus tard.");
  }
};

// Vérifier si l'email existe déjà pour un autre utilisateur
export const checkEmailExists = async (email, userId) => {
  try {
    const db = await connectDB();
    const [user] = await db.query(
      "SELECT id_user FROM user WHERE email = ? AND id_user != ?",
      [email, userId]
    );
    return user;
  } catch (error) {
    console.error("❌ checkEmailExists:", error);
    throw new Error("Erreur interne, veuillez réessayer plus tard.");
  }
};

// Mettre à jour un utilisateur par ID
export const updateUserById = async (data, id) => {
  try {
    const db = await connectDB();
    const [result] = await db.query(
      "UPDATE user SET name_user = ?, first_name = ?, birthday = ?, email = ?, pwd_hach = ?, role = ? WHERE id_user = ?",
      [
        data.name_user,
        data.first_name,
        data.birthday,
        data.email,
        data.pwd_hach,
        data.role,
        id
      ]
    );
    return result;
  } catch (error) {
    console.error("❌ updateUserById:", error);
    throw new Error("Erreur interne, veuillez réessayer plus tard.");
  }
};

// Mettre à jour le code de réinitialisation
export const updateResetCode = async (email, resetCode) => {
  try {
    const db = await connectDB();
    await db.query("UPDATE user SET reset_code = ? WHERE email = ?", [resetCode, email]);
  } catch (error) {
    console.error("❌ updateResetCode:", error);
    throw new Error("Erreur interne, veuillez réessayer plus tard.");
  }
};

// Vérifier le code de réinitialisation
export const resetPassword = async (email, resetCode) => {
  try {
    const db = await connectDB();
    const [user] = await db.query(
      "SELECT * FROM user WHERE email = ? AND reset_code = ?",
      [email, resetCode]
    );
    return user;
  } catch (error) {
    console.error("❌ resetPassword:", error);
    throw new Error("Erreur interne, veuillez réessayer plus tard.");
  }
};

// Mettre à jour le mot de passe (et réinitialiser le code)
export const updatePassword = async (email, hashedPassword) => {
  try {
    const db = await connectDB();
    await db.query("UPDATE user SET pwd_hach = ?, reset_code = NULL WHERE email = ?", [
      hashedPassword,
      email,
    ]);
  } catch (error) {
    console.error("❌ updatePassword:", error);
    throw new Error("Erreur interne, veuillez réessayer plus tard.");
  }
};

// Supprimer un utilisateur
export const deleteUser = async (id) => {
  try {
    const db = await connectDB();
    await db.query("DELETE FROM user WHERE id_user = ?", [id]);
  } catch (error) {
    console.error("❌ deleteUser:", error);
    throw new Error("Erreur interne, veuillez réessayer plus tard.");
  }
};
