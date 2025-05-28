import './NotFound.css'
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Btn-generique/btn'
import { IoIosArrowBack } from "react-icons/io";
import { GrUpdate } from "react-icons/gr";


const NotFound = () => {
    const navigate = useNavigate()
    const goBack = () => {
        navigate(-1)
        }
    const updated = () => {
        window.location.reload()
    }
    return (
        <main className='main-NotFound min-vh-100 d-flex flex-column flex-lg-row text-light'>
            <div className="content-image-notFound w-100 d-flex flex-column justify-content-center align-items-center p-5">
                <h1 className='z-2 h1-custom'>404</h1>
                <p className='z-2 w-50 d-none d-lg-block text-center'>
                    Désolé, la page que vous recherchez est introuvable. Elle a peut-être été supprimée, déplacée ou son URL est incorrecte.
                </p>
            </div>
            <div className="p-5 d-flex flex-column justify-content-center align-items-center gap-5">
                <h2 className=''>Oups, page introuvable!</h2>
                <p className='w-50 text-center mb-4 mt-2'>Il semble que la page que vous recherchez n’existe pas ou a été déplacée. Retournez à l’accueil ou explorez nos contenus !</p>
                <div className="d-flex gap-3">
                        <Button onClick={goBack} className='s-btn mb-0 '><IoIosArrowBack size={30}/>Retour </Button>

                        <Button onClick={updated} className='text-light border mb-0 '><GrUpdate size={20}/>{' '}Actualiser</Button>
                </div>
            </div>
        </main>
    )
}
export default NotFound;