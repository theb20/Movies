import Sidebar from './components/Sidebar/Sidebar.jsx';
import Overviews from './components/Overviews/Overviews.jsx';
import Footer from './components/Footer/Footer.jsx';
const Backoffice = () => {
  return (
    <div className="backoffice-container bg-white p-3 vh-100  d-flex">
      <Sidebar />
      <div className="main-content  px-3 w-100 d-flex flex-column gap-3 ">
        <Overviews />
        <Footer />
      </div>
    </div>
  );
};
export default Backoffice;
