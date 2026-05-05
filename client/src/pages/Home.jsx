import React, { useState, useEffect } from 'react';
import { FaSearchLocation, FaTools, FaCar, FaShoppingBag, FaTruckPickup, FaMapMarkerAlt } from 'react-icons/fa';

const Home = () => {
  const [userLocation, setUserLocation] = useState({ lng: null, lat: null });

  // جلب موقع المستخدم عند تحميل الصفحة (نظام يشبه InDrive)
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lng: position.coords.longitude,
            lat: position.coords.latitude,
          });
          console.log("Location detected:", position.coords.latitude, position.coords.longitude);
        },
        (error) => console.error("Error getting location:", error)
      );
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-left">
      
      {/* 1. Hero Section: SOS & Search */}
      <div className="relative bg-gradient-to-br from-[#00adef] via-[#0088cc] to-[#005f99] py-24 px-6 text-center text-white overflow-hidden">
        {/* خلفية جمالية خفيفة باستخدام FaCar بدل FaCarWash لتجنب الأخطاء */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <FaCar className="absolute top-10 left-10 text-[15rem] -rotate-12" />
          <FaTools className="absolute bottom-10 right-10 text-[12rem] rotate-12" />
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl md:text-7xl font-black mb-6 leading-tight tracking-tighter">
            AutoClick : Votre Expert <br /> Auto à Proximité
          </h1>
          <p className="text-xl mb-12 opacity-90 max-w-2xl mx-auto font-medium">
            Lavage, Mécanique ou Dépannage ? Trouvez le professionnel le plus proche de vous en un clic.
          </p>
          
          {/* محرك البحث الجغرافي */}
          <div className="bg-white p-3 rounded-[2rem] shadow-2xl max-w-4xl mx-auto flex flex-col md:flex-row gap-3">
            <div className="flex-[2] flex items-center px-5 gap-4 bg-gray-50 rounded-2xl border border-gray-100 transition-focus-within focus-within:border-[#00adef]">
              <FaMapMarkerAlt className="text-[#00adef] text-xl" />
              <input 
                type="text" 
                placeholder="Où êtes-vous ? (Ex: Casablanca, Maarif)" 
                className="w-full py-5 outline-none text-gray-800 font-bold bg-transparent border-none"
              />
            </div>
            <button 
              onClick={getLocation}
              className="flex-1 bg-[#00adef] text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-black hover:scale-[1.02] transition-all border-none cursor-pointer flex items-center justify-center gap-2"
            >
              <FaSearchLocation /> Rechercher SOS
            </button>
          </div>
          
          {userLocation.lat && (
            <p className="mt-4 text-sm font-bold bg-white/20 inline-block px-4 py-1 rounded-full">
              📍 Position GPS activée
            </p>
          )}
        </div>
      </div>

      {/* 2. Main Categories: Services & Store */}
      <div className="max-w-7xl mx-auto py-24 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* قسم الخدمات - Lavage & Mécanique */}
          <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-gray-200/50 text-center group hover:translate-y-[-10px] transition-all duration-300 border border-gray-50">
            <div className="bg-blue-50 text-[#00adef] w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-4xl group-hover:bg-[#00adef] group-hover:text-white transition-colors">
              <FaCar />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-4">Lavage & Mécanique</h3>
            <p className="text-gray-500 font-medium mb-8 leading-relaxed">
              Réservez un lavage complet ou un diagnostic mécanique chez nos partenaires agréés.
            </p>
            <button className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold border-none cursor-pointer hover:bg-[#00adef]">Découvrir</button>
          </div>

          {/* قسم المتجر - Boutique Pièces */}
          <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-gray-200/50 text-center group hover:translate-y-[-10px] transition-all duration-300 border border-gray-50">
            <div className="bg-orange-50 text-orange-500 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-4xl group-hover:bg-orange-500 group-hover:text-white transition-colors">
              <FaShoppingBag />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-4">Boutique Pièces</h3>
            <p className="text-gray-500 font-medium mb-8 leading-relaxed">
              Accessoires, huiles, et pièces de rechange. Tout ce qu'il faut pour votre voiture.
            </p>
            <button className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold border-none cursor-pointer hover:bg-orange-500">Acheter</button>
          </div>

          {/* قسم النجدة - Urgence SOS */}
          <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-red-100 text-center group hover:translate-y-[-10px] transition-all duration-300 border-2 border-red-50">
            <div className="bg-red-50 text-red-500 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-4xl group-hover:bg-red-500 group-hover:text-white transition-colors">
              <FaTruckPickup />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-4 text-red-600">Urgence SOS</h3>
            <p className="text-gray-500 font-medium mb-8 leading-relaxed">
              En panne ? Un remorqueur ou un mécanicien mobile arrive chez vous en moins de 30 min.
            </p>
            <button className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold border-none cursor-pointer hover:bg-black">Appeler Aide</button>
          </div>

        </div>
      </div>

      {/* 3. Section B2B (Garage Owners) */}
      <div className="max-w-6xl mx-auto mb-24 px-6">
        <div className="bg-gray-900 rounded-[4rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-3xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00adef] opacity-20 blur-[100px]"></div>
          <h2 className="text-3xl md:text-5xl font-black mb-6">Vous gérez un Garage ?</h2>
          <p className="text-gray-400 mb-12 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
            Rejoignez AutoClick, augmentez votre visibilité et recevez des clients directement depuis leur position GPS. Simple, efficace et rentable.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button className="bg-[#00adef] text-white px-12 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-all border-none cursor-pointer shadow-lg shadow-sky-900/20">
              Inscrire mon Garage
            </button>
            <button className="bg-transparent border-2 border-white/20 text-white px-12 py-5 rounded-2xl font-black text-xl hover:bg-white/10 transition-all cursor-pointer">
              Tarifs Mensuels
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;