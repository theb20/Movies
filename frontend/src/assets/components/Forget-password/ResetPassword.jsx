import './ResetPassword.css' 
import { GrLinkNext } from "react-icons/gr";
import { BiHide, BiShow  } from "react-icons/bi";
import { useState } from 'react';
import Input from '../Input-Form/Input'
import Button from '../Btn-generique/btn'

const ResetPassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const sizenext = 130
    return (
        <div className="reset-password-container bg-light text-dark p-5 d-flex flex-column justify-content-center align-items-center vh-100">
            <h1 className='text-left w-100'>Renouvellement de mot de passe</h1>
            <p className='text-left w-100'>Pour sécuriser votre compte, veuillez suivre les étapes ci-dessous :</p>
            <form className="container-step align-items-center justify-content-center mt-5 gap-5 d-flex">
                <div className="w-100 h-custom-reset">
                    <h2>Etape 01</h2>
                    <h4>E-mail de récupperation</h4>
                    <p className='p-h-custom'>Entrez votre adresse e-mail de récupération. Un code de confirmation vous sera envoyé.</p>
                    <Input
                    type={'email'}
                    placeholder="Entrez votre email ici"
                    classlabel='d-none'
                    classinput='bg-transparent border-3'
                    value={''}
                    onChange={''}
                    />
                    <div className="text-end mt-3">
                        <Button children="Suivant" type="button" className="s-btn" />
                    </div>
                </div>
                <GrLinkNext className='' size={sizenext}/>
                <div className="w-100 h-custom-reset">
                    <h2>Etape 02</h2>
                    <h4>Code de confirmation</h4>
                    <p className='p-h-custom'>Saisissez le code de confirmation reçu par e-mail.</p>
                    <Input
                    type={'text'}
                    placeholder="Entrez le code ici"
                    classlabel='d-none'
                    classinput='bg-transparent border-3'
                    value={''}
                    onChange={''}
                    />
                    <div className="text-end mt-3">
                        <Button children="Suivant" type="button" className="s-btn" />
                    </div>
                </div>
                <GrLinkNext className='' size={sizenext}/>
                <div className="w-100 h-custom-reset">
                    <h2>Etape 03</h2>
                    <h4>Nouveau mot de passe</h4>
                    <p className='p-h-custom'>Choisissez un nouveau mot de passe sécurisé et confirmez-le.</p>
                    <div className="w-100 position-relative">
                    <Input
                            type={showPassword ? "text" : "password"}
                            classlabel='d-none'
                            classinput='bg-transparent border-3'
                            placeholder="8 Caractères min"
                            onChange={""}
                        />
                        <Button
                            type="button"
                            className="top-custom position-absolute  end-0 translate-middle-y me-2 p-0"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <BiHide className='text-dark-' size={30}/> : <BiShow className='text-dark' size={30}/>}
                        </Button></div>
                        <div className="text-end mt-3">
                            <Button children="Suivant" type="submit" className="s-btn" />
                        </div>
                </div>
            </form>
        </div>
    )
}
export default ResetPassword;