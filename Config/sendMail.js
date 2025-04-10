import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const mailInscription = async (email, firstName) => {
    try {
        const transporter = nodemailer.createTransport({ //createTransport crée un objet qui est enssuite envoyé
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            }
        });

        const emailContent = {
            from: 'MOVIE',
            to: email,
            subject: 'Bienvenue sur MOVIE',
            html: `
            <div 
                 style="max-width:600px; margin:0 auto; font-family:'Segoe UI', sans-serif; color:#333; background:#ffffff; border:1px solid #e0e0e0; border-radius:8px; overflow:hidden;">
      
                <div style="background-color:#1c1c1c; padding:20px; text-align:center;">
                    <img src="../public/Logo_movies_ft.svg" alt="MOVIE Logo" style="width:120px; height:auto; margin-bottom:10px;" />
                    <h1 style="color:#ffffff; font-size:24px; margin:0;">Bienvenue chez MOVIE</h1>
                </div>

                <div style="padding:30px;">
                    <h2 style="color:#1c1c1c;">Bonjour ${firstName},</h2>
                    <p>Nous sommes ravis de vous accueillir dans l’univers MOVIE.</p>
                    <p>Plongez dès maintenant dans une expérience cinématographique unique avec une large sélection de films, séries, et bien plus encore.</p>
                    <p style="font-weight:bold;">Accédez à votre compte pour découvrir les dernières nouveautés !</p>

                    <div style="text-align:center; margin:30px 0;">
                        <a href="" style="display:inline-block; padding:12px 24px; background-color:#e50914; color:#ffffff; text-decoration:none; border-radius:4px; font-weight:bold;">Se connecter</a>
                    </div>

                <p>Notre équipe est à votre écoute pour toute question ou assistance.</p>
                <p>À très bientôt sur MOVIE !</p>

                <p style="font-style:italic; color:#666;">– L’équipe MOVIE</p>

                <p style="font-size:14px; color:#aaa; text-align:center;">
                    Besoin d’aide ? Notre équipe est disponible 7j/7 pour vous accompagner.<br/>
                    À très bientôt sur <strong>MOVIE</strong> 🍿
                </p>

             </div>
        </div>
            `
        };

        await transporter.sendMail(emailContent);// le await permet d'attendre que l'email soit envoyé de maniere asynchrone
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, message: error.message };
    }
};
// message de connexion
export const mailConnected = async (email, firstName) =>{
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            }
        });

        const emailContent = {
            from: 'MOVIE',
            to: email,
            subject: 'Nouvelle connexion détectée sur votre compte MOVIE 🔐',
            html: `
              <div style="max-width:600px; margin:0 auto; font-family:'Segoe UI', sans-serif; color:#333; background:#ffffff; border:1px solid #e0e0e0; border-radius:8px; overflow:hidden;">
                
                <div style="background-color:#1c1c1c; padding:20px; text-align:center;">
                  <img src="https://i.etsystatic.com/35367581/r/il/53bf97/4463935832/il_570xN.4463935832_3k3g.jpg" alt="MOVIE Logo" style="width:120px; height:auto; margin-bottom:10px;" />
                  <h1 style="color:#ffffff; font-size:22px; margin:0;">Connexion à votre compte MOVIE</h1>
                </div>
          
                <div style="padding:30px;">
                  <h2 style="color:#1c1c1c;">Bonjour ${firstName},</h2>
                  <p>Une nouvelle connexion à votre compte MOVIE a été détectée.</p>
                  
                  <p><strong>Détails de la connexion :</strong></p>
                  <ul style="line-height:1.6;">
                    <li><strong>Appareil :</strong> Navigateur ou appareil inconnu</li>
                    <li><strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}</li>
                  </ul>
          
                  <p>Si vous êtes à l'origine de cette connexion, aucune action n'est requise.</p>
                  <p style="color:#e50914;"><strong>Vous ne reconnaissez pas cette activité ?</strong></p>
                  <p><a href="https://movie.example.com/reset-password" style="color:#e50914; text-decoration:underline;">Réinitialisez immédiatement votre mot de passe</a> pour protéger votre compte.</p>
          
                  <div style="text-align:center; margin:30px 0;">
                    <a href="https://movie.example.com/account" style="display:inline-block; padding:12px 24px; background-color:#e50914; color:#ffffff; text-decoration:none; border-radius:4px; font-weight:bold;">Gérer mon compte</a>
                  </div>
          
                  <p style="font-style:italic; color:#666;">– L’équipe MOVIE</p>
          
                  <p style="font-size:13px; color:#aaa; text-align:center; margin-top:40px;">
                    Ce message vous a été envoyé automatiquement suite à une connexion récente.<br/>
                    Pour toute question, notre support est disponible 7j/7.
                  </p>
                </div>
              </div>
            `
          };          

        await transporter.sendMail(emailContent);// le await permet d'attendre que l'email soit envoyé de maniere asynchrone
        return { success: true, message: 'Email sent successfully' }; // l'attribut success est un booléen qui permet de savoir si l'email a été envoyéou non, si c'est true a été envoyé alors success sinon false
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, message: error.message };
    }
}