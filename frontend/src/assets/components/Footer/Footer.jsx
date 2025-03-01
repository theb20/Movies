import '../Footer/Footer.css'
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

const Footer = () => {
    const lCustom = "text-gray"
    const rxCustom = "rx-link"
    const size = 25
    return(
        <footer className='d-flex flex-column align-items-center w-100 p-4'>
            <div className="f-top d-flex align-items-center gap-3 pb-3">
                <Link className={rxCustom} ><FaYoutube size={size}/></Link>
                <Link className={rxCustom} ><FaTwitter size={size}/></Link>
                <Link className={rxCustom} ><FaFacebook size={size}/></Link>
                <Link className={rxCustom} ><FaInstagram size={size}/></Link>
            </div>
            <div className="f-center">
                <p style={{color:'var(--color-gray)'}} className='text-center'>Copyright 2024 © Movies . Tous droits réservés</p>
                <div className="f-center-list text-dark gap-3 d-flex flex-row justify-content-center">
                <Link className={lCustom}>Confidentialité</Link>
                <Link className={lCustom}>Politique</Link>
                </div>
            </div>
            <div className="f-bottom gap-5 d-flex">
                <Link className={lCustom}>Gallerie</Link>
                <Link className={lCustom}>Blog</Link>
                <Link className={lCustom}>Contact</Link>
                <Link className={lCustom}>Profil</Link>
            </div>
        </footer>
    )
}
export default Footer;