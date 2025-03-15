import { useState } from 'react';
import { BiHide, BiShow  } from "react-icons/bi";
import { GrValidate } from "react-icons/gr";
import { RiPoliceBadgeLine } from "react-icons/ri";


import Input from '../../components/Input-Form/Input.jsx';
import Button from '../../components/Btn-generique/btn.jsx';
import './Sign_up.css';

const SignUp = () => {
    const LabelForm = 'text-black px-2 fw-bold';
    const classcontainer = 'bg-light rounded w-100'
    const InputFrom = 'border bg-transparent border-0 bg';
    const [showPassword, setShowPassword] = useState(false);

    const size = 20
    const sizeLi = 20

    return (
        <main className="mainSignUp d-flex justify-content-center align-items-center ">
            <div className="container-register z-2 d-flex justify-content-center align-items-center flex-column text-light">
                <h1 className='fs-1'>Déverrouillez un monde de divertissement sans fin</h1>
                <p className='fs-5'>Connectez-vous ou Inscrivez-vous pour découvrir, diffuser et profiter !</p>

                <form className="form-register bg-custom-from text-light py-3 px-5 d-flex justify-content-center align-items-center flex-column gap-3 mt-2 w-100">
                    <h2>Inscription</h2>
                    <div className=" d-flex gap-2 rounded-1 w-100">
                        <Input
                            label="Nom"
                            classcontainer={classcontainer}
                            classlabel={LabelForm}
                            classinput={InputFrom}
                            type="text"
                            placeholder="Entrez votre nom"
                            onChange={""}
                        />
                        <Input
                            label="Prénom(s)"
                            classcontainer={classcontainer}
                            classlabel={LabelForm}
                            classinput={InputFrom}
                            type="text"
                            placeholder="Entrez votre/vos prénom(s)"
                            onChange={""}
                        />
                    </div>
                    <div className="d-flex w-100">
                        <div className="w-100">
                            <div className="d-flex w-100">
                                <div className="w-75">
                                    <p>Basic | Usage personnel</p>
                                    <span className='spanform position-relative fs-1 fw-bold '>Gratuit</span>
                                </div>
                                <RiPoliceBadgeLine  size={60}/>
                            </div>
                            <ul>
                                <li className='d-flex gap-3 align-items-center'><GrValidate className='text-light' size={sizeLi}/>Accès immédiat sans carte bancaire.</li>
                                <li className='d-flex gap-3 align-items-center'><GrValidate className='text-light' size={sizeLi}/>Accessible partout.</li>
                                <li className='d-flex gap-3 align-items-center'><GrValidate className='text-light' size={sizeLi}/>Accès limité aux films .</li>
                                <li className='d-flex gap-3 align-items-center'><GrValidate className='text-light' size={sizeLi}/>Qualité max 720p.</li>
                                <li className='d-flex gap-3 align-items-center'><GrValidate className='text-light' size={sizeLi}/>Notifications pour les nouvelles sorties.</li>
                            </ul>
                        </div>
                        <div className="w-100 gap-3 d-flex flex-column">
                            <div className="rounded-1 w-100 gap-3 d-flex flex-column">
                                <Input
                                    label="Date de naissance"
                                    type="date"
                                    classcontainer={classcontainer}
                                    classlabel={LabelForm}
                                    classinput={InputFrom}
                                    placeholder="+8 Caractères"
                                    onChange={""}
                                />
                                <Input
                                    label="E-mail"
                                    type="email"
                                    classcontainer={classcontainer}
                                    classlabel={LabelForm}
                                    classinput={InputFrom}
                                    placeholder="exemple.email@gmail.com"
                                    onChange={""}
                                />
                            </div>
                            <div className="rounded-1 w-100 position-relative">
                                <Input
                                    label="Crée un mot de passe"
                                    type={showPassword ? "text" : "password"}
                                    classcontainer={classcontainer}
                                    classlabel={LabelForm}
                                    classinput={InputFrom}
                                    placeholder="+8 Caractères min"
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
                        </div>
                    </div>
                    <div className="d-flex align-items-center gap-2 w-100">
                        <input
                            classlabel='d-none'
                            classinput='border border-0 bg-light rounded-0 p-2'
                            type='checkbox'
                            value={''}
                            onChange={''}

                        />
                        <p>En vous inscrivant, vous acceptez nos conditions générales d'utilisation et notre politique de confidentialité.</p>
                    </div>

                    {/* Bouton Connexion */}
                    <Button children="Se connecter" className="s-btn w-100 rounded-1 py-2" type="submit" />
                </form>
            </div>
        </main>
    );
};

export default SignUp;
