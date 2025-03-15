import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { SiInfiniti } from "react-icons/si";
import { BiSupport } from "react-icons/bi";
import { RiAdvertisementLine, RiShoppingBag4Line } from "react-icons/ri";
import netflixL from '../../images/Logos/netflix.webp'
import canalL from '../../images/Logos/canal.webp'
import disneyL from '../../images/Logos/disney.webp'
import plutottv from '../../images/Logos/plutottv.webp'
import primeL from '../../images/Logos/primevideo.webp'
import rakuL from '../../images/Logos/raku.webp'
import tubiL from '../../images/Logos/tubi.webp'


import './Home.css'

import Input from "../../components/Input-Form/Input.jsx"
import Button from "../../components/Btn-generique/btn.jsx"
import IconPopcorn from "../../images/Icons/popcorn_time_macos_bigsur_icon_189462.ico"
import fichierErreur from '../../images/Background/$_57.jpeg'
import fichierErreur1 from '../../images/Background/b22d9b8e4948c66c00e3724f1d2ef9d5.jpg'


const Home = () => {
    const currentTrends = Array(12).fill(null).map((_,index) => ({
        id: index, 
        image: fichierErreur,
    }));
    const size = 60
    const navigate = useNavigate();
    const handleNavigate = () => {
        navigate('/catalogue')
    }


    const mainHome ='mainHome text-light vw-100 overflow-hidden'
    const homeOne = 'homeOne vh-100 d-flex align-items-center justify-content-center text-center';
    const homeTwo ='homeTwo d-flex px-5 py-3 justify-content-center text-left';
    const homeThree ='vh-custom';
    const homeFour ='px-5';
    const homeFive ='homeFive d-flex flex-row flex-column-md align-items-center justify-content-between p-custom bg-danger mx-2 my-4 mx-md-5'

    const homeSix ='d-flex align-items-center justify-content-center flex-column gap-4';
    const homeSeven ='px-5';
    const popcorn = {width:'70px', height:'70px'};
    const contentR ="d-flex align-items-center justify-center gap-3"
    const iconFour= 'bg-danger-custom py-1 px-3 rounded-5'

    return (
        <main className={mainHome}>
            <section className={homeOne}>
                <div className="container-one w-50 text-center z-2">
                    
                        <h1 className="fs-1 lh-1">Films en illimité, à tout moment et ou que vous soyez</h1>

                        <p>Partir de 5 €. Annulable à tout moment.
                        Découvrez une vaste sélection de films, disponibles à tout moment. Profitez de l'expérience cinématographique ultime, où que vous soyez</p>

                        <form action="" method='GET' className='d-flex mt-5 align-items-center gap-2 justify-content-center'>
                            <Input         
                                classlabel='d-none' 
                                classinput='w-100 p-2 rounded-2'
                                placeholder={'Entrez votre mail'}
                            />
                            <Button status='primary-btn'  children={"s'inscrire"}/>

                        </form>
                </div>
            </section>
            <section className={homeTwo}>
                
                    <div className="container-two d-flex align-items-center">
                        <img src={IconPopcorn} alt="icon popcorn" style={popcorn} />

                        <div className="container-two-right lh-0 m-0 px-2 py-1 rounded">
                            <h5 className=' mb-0'>Vos films préférés pour seulement 5 €.</h5>
                            <p className=' mb-0'>Découvrez notre offre sans publicité, la plus avantageuse.</p>
                            <Link className='border-bottom border-1 mb-0' to={'/'}>
                                En savoir plus
                            </Link>
                        </div>
                    </div>
            </section>
            <section className={homeThree}>
                <div className="container-three overflow-visible">
                    <div className="container-three-title px-5 d-flex justify-content-between align-items-center">
                        <h5 className="fs-bold lh-1 m-0">Top 10</h5>
                        <Button onClick={handleNavigate} status='primary-btn' children={'Tout voir'}/>
                    </div>
                    <div className="container-card bg-custom px-5 py-5 d-flex gap-3 position-absolute z-2 overflow-auto flex-nowrap w-100">
                        {currentTrends.map((trends) => (
                        <Link to="/" key={trends.id}>
                            <div className="card custom-card bg-dark align-items-center justify-content-center"
                                style={{ minWidth: "200px" }}>
                            <span className="text-light fs-custom position-absolute bottom-custom text-white-50 fw-bold z-1 start-0">
                                {trends.id}
                            </span>
                            <img src={trends.image} alt="image" className="card-img-top" />
                            </div>
                        </Link>
                        ))}
                    </div>
                </div>
            </section>
            <section className={homeFour}>
                <div className="container-four">

                    <div className="container-four-title  d-flex justify-content-between align-items-center mb-5">
                            <h5 className="fs-bold lh-1 m-0">Encore plus de raison de vous abonner</h5>
                    </div>

                    <div className="container-four-content d-flex flex-wrap justify-content-around gap-3">
                        <div className="container-four-content-left overflow-auto rounded-5" style={{ height: '400px', width: '400px' }}>
                            <span className='position-absolute bg-danger-custom rounded-custom px-3'>En ce moment</span>
                            <img src={fichierErreur1} className="w-100 h-100 object-fit-cover rounded-5" alt="film le mieux noté" />
                        </div>
                        <div className="container-four-content-right d-flex flex-column gap-4 justify-content-center">
                                <div className={contentR}>
                                    <SiInfiniti size={size} className={iconFour}/>
                                    <div className="c-r-right">
                                        <h6>Accès illimité</h6>
                                        <p>Profitez de milliers de contenus sans aucune restriction, disponibles 24h/24 et 7j/7.</p>
                                    </div>
                                </div>
                                <div className={contentR}>
                                    <BiSupport size={size} className={iconFour}/>
                                    <div className="c-r-right">
                                        <h6>Support premium</h6>
                                        <p>Accédez à une assistance rapide et dédiée pour résoudre tous vos problèmes.</p>
                                    </div>
                                </div>
                                <div className={contentR}>
                                    <RiAdvertisementLine size={size} className={iconFour}/>
                                    <div className="c-r-right">
                                        <h6>Sans publicité</h6>
                                        <p>Savourez vos contenus sans interruptions, pour une expérience fluide et agréable.</p>
                                    </div>
                                </div>
                                <div className={contentR}>
                                    <RiShoppingBag4Line size={size} className={iconFour}/>
                                    <div className="c-r-right">
                                        <h6>Offre exclusive</h6>
                                        <p>Bénéficiez d&apos;offres et de réductions réservées uniquement aux abonnés.</p>
                                    </div>
                                </div>

                        </div>
                    </div>
                </div>
            </section>
            <section className={homeFive}>
                <h5 className='fw-bold fs-1 z-2'>FAQ</h5> <Button children={'voir+'} className='p-btn px-5 z-2 rounded-5' onClick={''}/>
            </section>
            <section className={homeSix}> 
                        <p className='text-center'>Prêt à regarder Movies ? Saisissez votre adresse e-mail pour vous abonner ou réactiver votre abonnement.</p>
                        <form action="" method='GET' className='d-flex align-items-center gap-2 justify-content-center'>
                            <Input         
                                classlabel='d-none' 
                                classinput='w-100 p-2 rounded-2'
                                placeholder={'Entrez votre mail'}
                            />
                            <Button status='primary-btn'  children={"s'inscrire"}/>

                        </form>
            </section>
            <section className={homeSeven}>
                <h5 className='text-center mb-5 mt-5'>Nos partenaires</h5>
                <div className="container-logos d-flex flex-wrap justify-content-between mb-5">
                    <img src={netflixL} className='size-img-custom'  alt="partenaires" />
                    <img src={canalL} className='size-img-custom'  alt="partenaires" />
                    <img src={disneyL} className='size-img-custom'  alt="partenaires" />
                    <img src={plutottv} className='size-img-custom'  alt="partenaires" />
                    <img src={primeL} className='size-img-custom'  alt="partenaires" />
                    <img src={rakuL} className='size-img-custom'  alt="partenaires" />
                    <img src={tubiL} className='size-img-custom'  alt="partenaires" />
                </div>
            </section>
        </main>
    )
}
export default Home;