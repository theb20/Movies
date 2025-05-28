import './Contact.css'
import { useState } from 'react'
import Input from '../../components/Input-Form/Input'
import Button from '../../components/Btn-generique/btn'

const Contact = () => {
   const [message, setMessage] = useState(null)
    return (
        <main className='main-contact d-flex flex-lg-row flex-column text-light'>
            <div className="content-image-contact">         
            </div>
            <div className="p-5 d-flex w-100 flex-column justify-content-center align-items-start">
                <h1 className='w-100 text-center text-lg-start'>Contact</h1>
                <form action="" className="contact-form d-flex flex-column gap-3 w-100 p-4">

                <Input
                    label="Nom & Prénom(s)"
                    placeholder="Entrer votre nom et prénom(s)"
                    type="text"
                />

                <Input
                    label="E-mail"
                    placeholder="Entrer votre adresse e-mail"
                    type="email"
                />

                <div className="message-container d-flex flex-column gap-2">
                    <label htmlFor="message" className="message-label">Message</label>
                    <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Écrivez votre message ici..."
                    className="p-2 message-textarea rounded bg-transparent border text-light border-1"
                    rows="6"
                    required
                    />
                </div>

                {/* Bouton Envoyer */}
                <Button type="submit" className="s-btn">Envoyer</Button>
            </form>
            </div>
        </main>
    )

}
export default Contact;