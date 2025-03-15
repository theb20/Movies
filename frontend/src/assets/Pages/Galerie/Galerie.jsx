import './Galerie.css';
import { Link } from 'react-router-dom'; // ✅ Importation de Link
import componentGalerie from '../../images/Background/component-bg-galerie.png';
import error from '../../images/Erreur_Interne/500.svg';

const Galerie = () => {
  const mainGalerie = 'text-white';
  const galerieOne = 'GalerieOne vh-75 px-5 d-flex justify-content-between align-items-center';
  const galerieTwo = 'd-flex flex-wrap gap-4 justify-content-center py-5';

  // ✅ Correction du .map() (name ne doit pas être là)
  const currentTrends = Array(12).fill(null).map((_, index) => ({
    id: index, 
    title: `Titre ${index + 1}`, // Optionnel : Ajouter un titre différent pour chaque élément
    image: error,
  }));

  return (
    <main className={mainGalerie}>
      {/* ✅ Section Titre et Description */}
      <section className={galerieOne}>
                <div className="container-Galerie-left z-2">
                    <h1>Galerie</h1>
                    <p>
                    Cette page décrit les règles d’utilisation de notre plateforme pour vous garantir une expérience sécurisée et de qualité. En l’acceptant, vous utilisez notre service en toute confiance.
                    </p>
                </div>
                <div className="container-Galerie-right z-2">
                    <img src={componentGalerie} className='' alt="" />
                </div>
            </section>

      {/* ✅ Section Cartes */}
      <section className={galerieTwo}>
        <div className="container-card justify-content-center ali d-flex flex-wrap gap-4">
          {currentTrends.map((trend) => (
            <Link to="/" key={trend.id} className="card-link">
              <div className="card custom-card bg-dark p-3 text-center" style={{ minWidth: "200px" }}>
                <span className="text-light fw-bold">{trend.id}</span>
                <img src={trend.image} alt={`Image ${trend.id}`} className="card-img-top rounded" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Galerie;
