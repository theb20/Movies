import './Popup.css'
import { Link } from 'react-router-dom'
import bg from '../../images/Background/bg-popup.jpeg'
import Input from '../../components/Input-Form/Input'
import Button from '../Btn-generique/btn'
const popup = () => {
    return (
        <div className="container-pop-up d-flex vh-100 justify-content-center align-items-center">
            <div className='bg-dark d-flex position-fixed rounded-5'>
                <div className="pop-up-left">
                    <img src={bg} className='w-100 h-100 bg-cover rounded-5' alt="" />
                </div>

                <div className="pop-up-right text-light flex-column justify-content-center p-4 align-items-center d-flex">
                    <Button children={'Passer'} className='position-absolute top-0 right-0 m-3 end-0 s-btn' />
                    <h4 className='text-center'>Rejoignez-nous et ne manquez plus aucune opportunité !</h4>
                    <form action="" method='GET' className='d-flex flex-column mt-5 align-items-center gap-2 justify-content-center'>
                                <Input         
                                    classlabel='d-none' 
                                    classinput='p-2 w-100 rounded-2'
                                    placeholder={'Entrez votre mail'}
                                />
                                <Button status='primary-btn' className='w-100 mx-3'  children={"s'inscrire"}/>

                    </form>
                    <div className="">
                    <p className='text-center mt-5'>
                        <Link className='text-danger'>Obtenir de l&apos;aide.</Link>{' '}
                    En m&apos;inscrivant, j&apos;accepte les{' '}
                    <Link
                        to='/terms#confifential'
                        className='text-danger'
                    >
                        Conditions d&apos;utilisation
                    </Link>{' '}
                    et la{' '}
                    <Link to='/terms#politique' className='text-danger'>
                        Politique de confidentialité
                    </Link>
                    . 
                    </p>
                </div>
                </div>

            </div>
        </div>
    )
}
export default popup;