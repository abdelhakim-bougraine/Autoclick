import { useState } from 'react';
// 🔄 استيراد useNavigate للتنقل المتوافق مع React Router
import { useNavigate } from 'react-router-dom';
import { FaSearchLocation, FaTools, FaCar, FaShoppingBag, FaTruckPickup, FaMapMarkerAlt } from 'react-icons/fa';

const Home = () => {
  const [userLocation, setUserLocation] = useState({ lng: null, lat: null });
  // 🔄 تفعيل الـ hook الخاص بالتنقل
  const navigate = useNavigate();

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
    <div className="bg-gradient-to-b from-[#0088cc] via-[#005f99] to-[#0a192f] min-h-screen font-sans text-left text-white">
      
      {/* ستايل مخصص لتموج الأيقونات بحال البحر */}
      <style>{`
        @keyframes oceanWave {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(3deg); }
        }
        .animate-wave {
          animation: oceanWave 3s ease-in-out infinite;
        }
      `}</style>

      {/* 1. Hero Section: العنوان ومحرك البحث */}
      <div className="relative py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <FaCar className="absolute top-10 left-10 text-[15rem] -rotate-12 animate-wave" />
          <FaTools className="absolute bottom-10 right-10 text-[12rem] rotate-12" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-7xl font-black mb-6 leading-tight tracking-tighter text-white">
            AutoClick : Votre Expert <br /> Auto à Proximité
          </h1>
          <p className="text-xl mb-10 text-cyan-100 max-w-2xl mx-auto font-medium">
            Lavage, Mécanique ou Dépannage ? Trouvez le professionnel le plus proche de vous en un clic.
          </p>
          
          {/* محرك البحث الجغرافي الأبيض */}
          <div className="bg-white p-3 rounded-[2rem] shadow-2xl flex flex-col md:flex-row gap-3 mb-16 max-w-3xl mx-auto">
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

          {/* 2. الكروت المطورة المتوهجة والمتموجة */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
            
            {/* كرت Lavage & Mécanique */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-[3rem] text-center transition-all duration-300 hover:translate-y-[-10px] shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(0,173,239,0.3)] group">
              <div className="relative bg-cyan-500/20 text-[#00adef] w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-3xl">
                <span className="flex h-5 w-5 absolute -top-1 -right-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-green-500"></span>
                </span>
                <div className="animate-wave">
                  <FaCar />
                </div>
              </div>
              <h3 className="text-2xl font-black mb-4 text-white">Lavage & Mécanique</h3>
              <p className="text-cyan-100/70 font-medium mb-8 text-sm leading-relaxed">
                Réservez un lavage complet ou un diagnostic mécanique chez nos partners agréés.
              </p>
              <button 
                onClick={() => navigate('/services')}
                className="w-full bg-[#00adef] hover:bg-white hover:text-black text-white py-4 rounded-2xl font-black border-none cursor-pointer transition-all shadow-lg"
              >
                Découvrir
              </button>
            </div>

            {/* كرت Boutique Pièces */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-[3rem] text-center transition-all duration-300 hover:translate-y-[-10px] shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] group">
              <div className="relative bg-amber-500/20 text-amber-400 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-3xl">
                <span className="flex h-5 w-5 absolute -top-1 -right-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-green-500"></span>
                </span>
                <div className="animate-wave">
                  <FaShoppingBag />
                </div>
              </div>
              <h3 className="text-2xl font-black mb-4 text-white">Boutique Pièces</h3>
              <p className="text-cyan-100/70 font-medium mb-8 text-sm leading-relaxed">
                Accessoires, huiles, et pièces de rechange. Tout ce qu'il faut pour votre voiture.
              </p>
              <button 
                onClick={() => navigate('/store')}
                className="w-full bg-amber-500 hover:bg-white hover:text-black text-white py-4 rounded-2xl font-black border-none cursor-pointer transition-all shadow-lg"
              >
                Acheter
              </button>
            </div>

            {/* كرت Urgence SOS الاستعجالي */}
            <div className="bg-gradient-to-b from-red-600/30 to-red-950/40 backdrop-blur-md border-2 border-red-500/40 p-8 rounded-[3rem] text-center transition-all duration-300 hover:translate-y-[-10px] shadow-[0_0_25px_rgba(239,68,68,0.2)] hover:shadow-[0_0_40px_rgba(239,68,68,0.6),_0_0_15px_rgba(245,158,11,0.3)] group">
              <div className="relative bg-red-500 text-white w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-3xl">
                <span className="flex h-6 w-6 absolute -top-2 -right-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-90"></span>
                  <span className="relative inline-flex rounded-full h-6 w-6 bg-green-500"></span>
                </span>
                <div className="animate-wave">
                  <FaTruckPickup />
                </div>
              </div>
              <h3 className="text-2xl font-black mb-4 text-red-400 tracking-wide uppercase">Urgence SOS</h3>
              <p className="text-red-100/80 font-medium mb-8 text-sm leading-relaxed">
                En panne ? Un remorqueur ou un mécanicien mobile arrive chez vous en moins de 30 min.
              </p>
              {/* 🔄 هنا تم التعديل السحري: سيوجهك مباشرة لصفحة الـ SOS الحية */}
              <button 
                onClick={() => navigate('/sos')}
                className="w-full bg-red-600 hover:bg-white hover:text-black text-white py-4 rounded-2xl font-black border-none cursor-pointer transition-all shadow-lg shadow-red-900/50"
              >
                Appeler Aide
              </button>
            </div>

          </div>

          {userLocation.lat && (
            <p className="mt-8 text-sm font-bold bg-white/10 inline-block px-4 py-1 rounded-full">
              📍 Position GPS activée
            </p>
          )}
        </div>
      </div>

      {/* 3. Section B2B (Vous gérez un Garage ?) */}
      <div className="max-w-5xl mx-auto py-16 px-6">
        <div className="bg-[#0b192f]/80 backdrop-blur-md rounded-[3rem] p-12 md:p-16 text-center border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#00adef] opacity-10 blur-[120px]"></div>
          
          <h2 className="text-3xl md:text-5xl font-black mb-6 text-white tracking-tight">
            Vous gérez un Garage ?
          </h2>
          <p className="text-cyan-100/70 mb-10 max-w-2xl mx-auto text-base md:text-lg font-medium leading-relaxed">
            Rejoignez AutoClick, augmentez votre visibilité et recevez des clients directement depuis leur position GPS. Simple, efficace et rentable.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
            <button className="flex-1 bg-[#00adef] hover:bg-white hover:text-black text-white px-8 py-4 rounded-2xl font-black text-lg transition-all border-none cursor-pointer shadow-lg shadow-sky-500/20">
              Inscrire mon Garage
            </button>
            <button className="flex-1 bg-transparent border-2 border-white/20 text-white hover:border-white px-8 py-4 rounded-2xl font-black text-lg transition-all cursor-pointer">
              Tarifs Mensuels
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;