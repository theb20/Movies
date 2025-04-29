import './Newsletter.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import wallpaper from '../../images/Background/newsletter.jpg';
import Button from '../Btn-generique/btn.jsx';
import Input from '../Input-Form/Input.jsx';

const Newsletter = () => {
    const navigate = useNavigate();
    const [visible, setVisible] = useState(true);
    const [email, setEmail] = useState('');

    useEffect(() => {
        // Vérifie si un token est présent dans le localStorage
        const token = localStorage.getItem('token');
        if (token) {
            setVisible(false); // Ne pas afficher la newsletter si l'utilisateur est connecté
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setVisible(false);
        navigate('/signup', { state: { email } });
    };

    if (!visible) return null;

    return (
        <div className="vh-100 vw-100 d-flex align-items-center justify-content-center p-4 bg-black bg-opacity-50">
            <div className="d-flex shadow rounded overflow-hidden w-100" style={{ maxWidth: '800px', height: '500px' }}>
                
                {/* Image à gauche */}
                <div className="w-100 d-none d-md-block">
                    <img 
                        src={wallpaper} 
                        alt="Newsletter" 
                        className="img-fluid h-100 w-100 object-fit-cover"
                    />
                </div>

                {/* Formulaire à droite */}
                <div className="w-100 w-md-50 bg-dark text-white position-relative p-5 d-flex flex-column justify-content-center">
                    <Button 
                        children="Passer" 
                        className="s-btn position-absolute end-0 top-0 m-3" 
                        onClick={() => setVisible(false)} 
                    />

                    <div className="text-center mb-4">
                        <p className='fs-5'>Rejoignez-nous et ne manquez plus aucune opportunité !</p>
                    </div>

                    <form className="d-flex flex-column gap-3 w-100" onSubmit={handleSubmit}>
                        <Input
                            classlabel="d-none"
                            classinput="bg-dark text-white p-3 w-100"
                            placeholder="Entrez votre mail"
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button
                            type='submit'
                            children="Commencer"
                            className="p-btn w-100"
                        />
                    </form>

                    <p className='position-absolute text-center text-secondary m-2' style={{ bottom: '20px', left: '0' }}>
                        En vous inscrivant, vous acceptez nos conditions générales d'utilisation
                        et notre politique de <Link className='text-danger' to='/terms#section6'>Confidentialité.</Link>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default Newsletter;
