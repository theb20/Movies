import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './Catalogue.css';
import { Link } from 'react-router-dom';
const Catalogue = () => {
    return (
        <main className="mainCalalogue">
           <section className="header-catalogue">
                <Carousel>

                </Carousel>
           </section>
           <section className='lists'>
                <div className="current-trend">
                    <div className="title">
                        <h5>Tendance actuelle</h5>                       
                    </div>
                    <div className="container-card">
                        {[ ...Array(10).map((_, index) => (
                           <Link to={'/'}>
                                <div className="card" key="index" >
                                    <img src="../../images/Icons/fichier-endommage.png" key={index} alt="" />
                                    <h4>title</h4>
                                </div>
                            </Link>
                        ))]}
                    </div>
                </div>
                <div className="comedy">
                    <div className="title">
                        <h5>Comedie</h5>
                    </div>
                    <div className="container-card">
                        {[ ...Array(10).map((_, index) => (
                            <Link to={'/'}>
                            <div className="card" key="index" >
                                <img src="../../images/Icons/fichier-endommage.png" key={index} alt="" />
                                <h4>title</h4>
                            </div></Link>
                        ))]}
                    </div>
                </div>
                <div className="action">
                    <div className="title">
                        <h5>Action</h5>
                    </div>
                    <div className="container-card">
                        {[ ...Array(10).map((_, index) => (
                            <Link to={'/'}>
                            <div className="card" key="index" >
                                <img src="../../images/Icons/fichier-endommage.png" key={index} alt="" />
                                <h4>title</h4>
                            </div>
                            </Link>
                        ))]}
                    </div>
                </div>
                <div className="science-fiction">
                    <div className="title">
                        <h5>Science-fiction</h5>
                    </div>
                    <div className="container-card">
                        {[ ...Array(10).map((_, index) => (
                            <Link to={'/'}>
                            <div className="card" key="index" >
                                <img src="../../images/Icons/fichier-endommage.png" key={index} alt="" />
                                <h4>title</h4>
                            </div>
                            </Link>
                        ))]}
                    </div>
                </div>
                <div className="top10">
                    <div className="title">
                        <h5>Top 10</h5>
                    </div>
                    <div className="container-card">
                        {[ ...Array(10).map((_, index) => (
                            <Link to={'/'}>
                            <div className="card" key="index" >
                                <img src="../../images/Icons/fichier-endommage.png" key={index} alt="" />
                                <h4>title</h4>
                            </div>
                            </Link>
                        ))]}
                    </div>
                </div>               
           </section>
        </main>
        );
}
export default Catalogue;