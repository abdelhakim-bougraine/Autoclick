import { Link } from "react-router-dom";
import { FaCar, FaShoppingBag, FaHeadset, FaInfoCircle, FaTruckPickup } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#0a192f] text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 no-underline mb-4">
              <img src="/logo/autoclick-logo.png" alt="AutoClick" className="h-12 w-auto" />
              <span className="text-2xl font-black text-white tracking-tighter">
            Auto<span className="text-[#00adef]">Click</span>
          </span>
            </Link>
            <p className="text-gray-400 text-sm font-medium leading-relaxed">
              Votre expert auto à proximité. Lavage, mécanique, dépannage et boutique pièces.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-black uppercase tracking-wider text-[#00adef] mb-4">Services</h4>
            <ul className="space-y-3 list-none m-0 p-0">
              <li>
                <Link to="/services" className="text-gray-400 hover:text-white text-sm font-medium no-underline flex items-center gap-2 transition-all">
                  <FaCar className="text-xs" /> Lavage & Mécanique
                </Link>
              </li>
              <li>
                <Link to="/sos" className="text-gray-400 hover:text-white text-sm font-medium no-underline flex items-center gap-2 transition-all">
                  <FaTruckPickup className="text-xs" /> SOS Dépannage
                </Link>
              </li>
              <li>
                <Link to="/store" className="text-gray-400 hover:text-white text-sm font-medium no-underline flex items-center gap-2 transition-all">
                  <FaShoppingBag className="text-xs" /> Boutique
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black uppercase tracking-wider text-[#00adef] mb-4">Liens</h4>
            <ul className="space-y-3 list-none m-0 p-0">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white text-sm font-medium no-underline flex items-center gap-2 transition-all">
                  <FaInfoCircle className="text-xs" /> À Propos
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-400 hover:text-white text-sm font-medium no-underline flex items-center gap-2 transition-all">
                  <FaHeadset className="text-xs" /> Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black uppercase tracking-wider text-[#00adef] mb-4">Compte</h4>
            <ul className="space-y-3 list-none m-0 p-0">
              <li>
                <Link to="/login" className="text-gray-400 hover:text-white text-sm font-medium no-underline transition-all">
                  Se connecter
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-400 hover:text-white text-sm font-medium no-underline transition-all">
                  Créer un compte
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-xs font-medium">
            &copy; {new Date().getFullYear()} AutoClick. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
