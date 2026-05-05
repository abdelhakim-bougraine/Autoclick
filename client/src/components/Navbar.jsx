import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaHeadset, FaShoppingCart, FaHome, FaInfoCircle } from 'react-icons/fa';

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const handleClick = () => setNav(!nav);

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 px-6 py-4 border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* 1. Logo Section */}
        <Link to="/" className="flex items-center gap-2 no-underline">
          <div className="bg-[#00adef] p-2 rounded-xl">
             <span className="text-white font-black text-xl">AC</span>
          </div>
          <span className="text-2xl font-black text-gray-900 tracking-tighter">
            Auto<span className="text-[#00adef]">Click</span>
          </span>
        </Link>

        {/* 2. Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
          <li>
            <Link to="/" className="text-gray-700 hover:text-[#00adef] font-bold no-underline flex items-center gap-2 transition-all">
              <FaHome className="text-sm" /> Accueil
            </Link>
          </li>
          <li>
            <Link to="/store" className="text-gray-700 hover:text-[#00adef] font-bold no-underline flex items-center gap-2 transition-all">
              <FaShoppingCart className="text-sm" /> Boutique
            </Link>
          </li>
          <li>
            <Link to="/about" className="text-gray-700 hover:text-[#00adef] font-bold no-underline flex items-center gap-2 transition-all">
              <FaInfoCircle className="text-sm" /> À Propos
            </Link>
          </li>
          <li>
            <Link to="/support" className="bg-gray-50 text-gray-700 px-5 py-2.5 rounded-2xl hover:bg-[#00adef] hover:text-white font-black no-underline flex items-center gap-2 transition-all border border-gray-100">
              <FaHeadset /> Équipe Support
            </Link>
          </li>
        </ul>

        {/* 3. Register Button (Desktop) */}
        <div className="hidden md:block">
          <Link to="/register" className="bg-[#00adef] text-white px-8 py-3 rounded-2xl font-black no-underline hover:bg-black transition-all shadow-lg shadow-sky-100">
            S'inscrire
          </Link>
        </div>

        {/* 4. Mobile Toggle */}
        <div onClick={handleClick} className="md:hidden z-10 text-2xl text-gray-900 cursor-pointer">
          {!nav ? <FaBars /> : <FaTimes />}
        </div>

        {/* 5. Mobile Menu */}
        <ul className={!nav ? 'hidden' : 'absolute top-0 left-0 w-full h-screen bg-white flex flex-col justify-center items-center gap-10 list-none text-2xl font-black'}>
          <li><Link onClick={handleClick} to="/" className="text-gray-900 no-underline">Accueil</Link></li>
          <li><Link onClick={handleClick} to="/store" className="text-gray-900 no-underline">Boutique</Link></li>
          <li><Link onClick={handleClick} to="/about" className="text-gray-900 no-underline">À Propos</Link></li>
          <li><Link onClick={handleClick} to="/support" className="text-[#00adef] no-underline flex items-center gap-2"><FaHeadset /> Support</Link></li>
          <li><Link onClick={handleClick} to="/register" className="bg-[#00adef] text-white px-10 py-4 rounded-3xl no-underline">S'inscrire</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;