import { format } from 'date-fns';
const Footer = () => {
  return (
    <footer
      style={{ backgroundColor: 'var(--background-admin)', fontSize: '13px' }}
      className="py-3 rounded-3 text-black text-center text-opacity-25 w-100">
      © {format(new Date(), 'yyyy')} Movie. Tous droits réservés.
    </footer>
  );
};
export default Footer;
