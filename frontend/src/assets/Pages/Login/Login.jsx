import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BiHide, BiShow  } from "react-icons/bi";

import Input from '../../components/Input-Form/Input.jsx';
import Button from '../../components/Btn-generique/btn.jsx';
import './Login.css';

const Login = () => {
    const LabelForm = 'text-black px-2 fw-bold';
    const InputFrom = 'border bg-transparent border-0 bg';
    const [showPassword, setShowPassword] = useState(false);

    const size = 20

    return (
        <main className="mainLogin d-flex justify-content-center align-items-center vh-100">
            <div className="container-login z-2 d-flex justify-content-center align-items-center flex-column text-light">
                <h1 className='fs-1'>Déverrouillez un monde de divertissement sans fin</h1>
                <p className='fs-5'>Connectez-vous ou Inscrivez-vous pour découvrir, diffuser et profiter !</p>

                <form className="form-login bg-custom-from text-light py-5 px-5 w-45 d-flex justify-content-center align-items-center flex-column gap-3 mt-2">
                    <h2>Connexion</h2>

                    {/* Champ Email */}
                    <div className="bg-light rounded-1 w-100">
                        <Input
                            label="E-mail"
                            classlabel={LabelForm}
                            classinput={InputFrom}
                            type="email"
                            placeholder="Entrez votre adresse e-mail"
                            onChange={""}
                        />
                    </div>

                    {/* Champ Mot de passe avec bouton "afficher/cacher" */}
                    <div className="bg-light rounded-1 w-100 position-relative">
                        <Input
                            label="Mot de passe"
                            type={showPassword ? "text" : "password"}
                            classlabel={LabelForm}
                            classinput={InputFrom}
                            placeholder="+8 Caractères"
                            onChange={""}
                        />
                        <Button
                            type="button"
                            className=" position-absolute  end-0 bottom-0 translate-middle-y me-2 p-0"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <BiHide className='text-black' size={size}/> : <BiShow className='text-black' size={size}/>}
                        </Button>
                    </div>

                    {/* Liens */}
                    <div className="d-flex justify-content-between align-items-center gap-2 w-100">
                        <p className="fs-8">
                            Nouveau sur Movies ?{' '}
                            <Link to="/signup" className="text-decoration-underline">
                                Inscrivez-vous maintenant
                            </Link>
                        </p>
                        <Link to="/reset">
                            <p className="fs-8">Mot de passe oublié ?</p>
                        </Link>
                    </div>

                    {/* Bouton Connexion */}
                    <Button children="Se connecter" className="s-btn w-100 rounded-1 py-2" type="submit" />
                </form>
            </div>
        </main>
    );
};

export default Login;
