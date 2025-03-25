import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const mailInscription = async (email, firstName) => {
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
            subject: 'Bienvenue sur MOVIE',
            html: `
                <h2>Bonjour ${firstName},</h2>
                <p>Bienvenue sur notre site !</p>
                <p>Nous sommes ravis de vous compter parmi nous et espérons que vous apprécierez votre expérience.</p>
                <p><strong>Découvrez toutes nos fonctionnalités !</strong></p>
                <p>Notre équipe reste à votre disposition.</p>
                <p>À très bientôt !</p>
                <p><em>L'équipe MOVIE</em></p>
            `
        };

        await transporter.sendMail(emailContent);
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, message: error.message };
    }
};
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
            subject: 'Connexion réussie',
            html: `
                <h2>Bonjour ${firstName},</h2>
                <p>Vous vous êtes connecté avec succès!</p>`
        };

        await transporter.sendMail(emailContent);
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, message: error.message };
    }
}