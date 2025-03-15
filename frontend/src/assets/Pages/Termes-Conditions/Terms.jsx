import './Terms.css'
import bgicon from '../../images/Background/terms-removebg-preview.png'
import Button from '../../components/Btn-generique/btn'
import { useState } from 'react'

const Terms = () => {
    const mainTerms='text-white'
    const termsOne =' termsOne vh-75 px-5   d-flex justify-content-between align-items-center'
    const termsTwo ='d-flex'

    const [visible, setVisible] = useState(`section1`)
    const sections = {
        section1: "Bienvenue sur notre plateforme. Nous nous engageons à vous offrir un service de qualité, sécurisé   et transparent. L'utilisation de notre site est soumise aux présentes Conditions Générales d’Utilisation (CGU) et à notre Politique de Confidentialité.En accédant à notre site et en utilisant nos services, vous reconnaissez avoir lu, compris et accepté sans réserve ces conditions. Celles-ci visent à établir un cadre clair quant aux droits et responsabilités des utilisateurs ainsi que ceux de notre entreprise. Si vous n’acceptez pas ces conditions, nous vous invitons à ne pas utiliser notre plateforme.Notre priorité est de garantir une expérience fluide et agréable tout en respectant la réglementation en vigueur en matière de protection des données et de droits numériques.",
        section2: "L'utilisation de Movies est soumise aux conditions suivantes : Création d’un compte utilisateur Pour accéder à l’ensemble des fonctionnalités, vous devez créer un compte avec une adresse e-mail valide. L’abonnement est fixé à 5€ par mois.Accès aux contenus Movies vous permet de streamer du contenu légalement. Vous ne devez pas télécharger ni redistribuer nos films sans autorisation. Toute tentative de pirat Movies est disponible sur PC, tablettes, smartphones et TV con En tant qu'utilisateur, vous vous engagez à : Ne pas partager votre compte avec des tiers, Ne pas contourner les restrictions de sécurité, Respecter les droits d’auteur des œuvres diffusées.",
        section3:"Chez Movies, la protection de vos informations personnelles est une priorité absolue. Nous nous engageons à :Collecter uniquement les données nécessaires, telles que votre nom, votre adresse e-mail et vos préférences de visionnage. Sécuriser vos informations via des protocoles de cryptage avancés. Ne pas revendre ni partager vos données avec des tiers sans votre consentement. Vous offrir la possibilité de modifier ou supprimer vos informations personnelles à tout moment. Nos serveurs sont hébergés via XAMPP, et nous utilisons SSL/TLS pour sécuriser les échanges de données.", 
        section4:"Vos droits Vous avez le droit d’accéder à l’ensemble des fonctionnalités de Movies après souscription.Vous pouvez demander la suppression de votre compte et de vos données personnelles. Vous pouvez nous contacter pour signaler du contenu inapproprié ou une violation de vos droits. Vos responsabilités Ne pas utiliser Movies à des fins frauduleuses ou illégales. les autres utilisateurs et ne pas publier de commentaires offensants. Ne pas tenter de modifier ou de pirater notre plateforme.",    
        section5: "Movies s’efforce d’offrir une expérience fluide et sans interruption, mais nous ne garantissons pas une disponibilité permanente des services. Nous pouvons être amenés à : Mettre à jour la plateforme pour améliorer l’expérience utilisateur, Modifier les tarifs des abonnements, Ajouter ou retirer des films selon les droits de diffusion, Suspendre un compte en cas de non-respect des conditions d’utilisation. Toute modification sera communiquée aux utilisateurs via e-mail et sur notre site.",    
        section6: "Nous nous engageons à respecter votre vie privée et à protéger vos informations personnelles. Résumé de notre politique de confidentialité : Vos données sont collectées uniquement pour améliorer votre expérience sur Movies. Vous pouvez désactiver le suivi publicitaire dans les paramètres de votre compte.Nous utilisons des cookies pour optimiser la navigation et personnaliser le contenu. Vous pouvez consulter notre politique complète ici : [Lien vers la politique de confidentialité]",    
        section7: " Pour toute question ou assistance, vous pouvez nous contacter via : 📧 Email : support@movies.com  📞 Téléphone : +33 1 23 45 67 89 💬 Support en ligne : Chat disponible 24/7 Nous nous engageons à répondre sous 48 heures ouvrées.",
        section8:"Découvrez nos articles sur le cinéma, les critiques de films et les tendances du streaming sur notre blog officiel : [Lien vers le blog Movies] Nos thématiques incluent : 🎬 Les coulisses des grands films, 🍿 Les meilleures recommandations, 📢 Les dernières actualités du streaming. Rejoignez notre communauté et partagez votre passion du cinéma !"
    }

    return (
        <main className={mainTerms}>
            <section className={termsOne}>
                <div className="container-terms-left z-2">
                    <h1>Termes & Conditions</h1>
                    <p>
                    Cette page décrit les règles d&apos;utilisation de notre plateforme pour vous garantir une expérience sécurisée et de qualité. <br/> En l&apos;acceptant, vous utilisez notre service en toute confiance.
                    </p>
                </div>
                <div className="container-terms-right z-2">
                    <img src={bgicon} className='' alt="" />
                </div>
            </section>
            <section className={termsTwo}>
                <div className="sidebar ">
                <nav className='bg-transparent p-5'>
                    <h2 className='px-5'>Architecture</h2>
                    <ul className="list-group list-group-numbered py-5 width-custom" style={{ borderRight: "2px solid var(--color-red)" }}>

                        {Object.keys(sections).map((section, index) => (
                            <li key={index} className={`list-group-item text-light bg-transparent border-0 py-2 ${visible === section ? "active" : ""}`}>
                                <Button 
                                    children={[
                                        "Introduction", "Utilisation de nos services", "Protection des données", "Droits et responsabilités", "Limitations et mises à jour", "Confidentialité", "Contact", "Blog"][index]
                                    } 
                                    onClick={() => setVisible(section)}
                                    className='t-btn'
                                />
                            </li>
                        ))}
                    </ul>
                </nav>

                </div>
                <div className="content-termsTwo p-5">
                    <p className="py-5 fs-6" style={{textAlign: 'justify', lineHeight:'4em'}}>{sections[visible]}</p>
                </div>
                .
            </section>

        </main>
    )
}
export default Terms;