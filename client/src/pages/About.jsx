import { useNavigate } from 'react-router-dom';
import { FaCar, FaTools, FaShieldAlt, FaUsers, FaMapMarkerAlt } from 'react-icons/fa';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-b from-[#0088cc] via-[#005f99] to-[#0a192f] min-h-screen py-16 px-6 font-sans text-white">
      
      {/* 1. Header Section */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
          À Propos de <span className="text-cyan-400">AutoClick</span>
        </h1>
        <p className="text-xl text-cyan-100 max-w-2xl mx-auto font-medium leading-relaxed">
          La première plateforme marocaine intelligente qui connecte instantanément les automobilistes avec les meilleurs professionnels auto autour d'eux.
        </p>
      </div>

      {/* 2. Notre Mission & Vision (Grille) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
        <div className="bg-[#0b192f]/80 backdrop-blur-md border border-white/10 p-8 rounded-[2.5rem] shadow-xl">
          <div className="bg-[#00adef]/20 text-[#00adef] w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6">
            <FaCar />
          </div>
          <h3 className="text-2xl font-black mb-4">Notre Mission</h3>
          <p className="text-cyan-100/70 font-medium leading-relaxed text-sm">
            Simplifier la vie des conducteurs en digitalisant l'accès aux services automobiles. Que ce soit pour un lavage programmé, une panne mécanique imprévue ou un besoin urgent de remorquage (SOS), AutoClick géolocalise la solution en un clic.
          </p>
        </div>

        <div className="bg-[#0b192f]/80 backdrop-blur-md border border-white/10 p-8 rounded-[2.5rem] shadow-xl">
          <div className="bg-amber-500/20 text-amber-400 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6">
            <FaTools />
          </div>
          <h3 className="text-2xl font-black mb-4">Notre Vision</h3>
          <p className="text-cyan-100/70 font-medium leading-relaxed text-sm">
            Devenir le partenaire de route indispensable pour chaque marocain, tout en aidant les garages locaux, les laveurs et les dépanneurs à digitaliser leur activité, à augmenter leur visibilité et à booster leurs revenus grâce au GPS.
          </p>
        </div>
      </div>

      {/* 3. Nos Valeurs (3 Colonnes) */}
      <div className="max-w-5xl mx-auto mb-20 text-center">
        <h2 className="text-3xl font-black mb-12">Pourquoi AutoClick ?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-6">
            <div className="text-red-500 text-4xl mb-4 flex justify-center"><FaShieldAlt /></div>
            <h4 className="text-xl font-bold mb-2">Sécurité & Fiabilité</h4>
            <p className="text-cyan-100/60 text-sm font-medium">Tous nos partenaires et dépanneurs SOS sont agréés, vérifiés et évalués par la communauté.</p>
          </div>

          <div className="p-6">
            <div className="text-[#00adef] text-4xl mb-4 flex justify-center"><FaMapMarkerAlt /></div>
            <h4 className="text-xl font-bold mb-2">Proximité Réelle</h4>
            <p className="text-cyan-100/60 text-sm font-medium">Grâce à notre système de géolocalisation haute précision, trouvez de l'aide à moins de 5 km.</p>
          </div>

          <div className="p-6">
            <div className="text-green-400 text-4xl mb-4 flex justify-center"><FaUsers /></div>
            <h4 className="text-xl font-bold mb-2">Esprit Communautaire</h4>
            <p className="text-cyan-100/60 text-sm font-medium">Une mise en relation directe, transparente et sans intermédiaire entre professionnels et clients.</p>
          </div>

        </div>
      </div>

      {/* 4. Section Statistiques (Chiffres Clés) */}
      <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#0b192f] to-red-950/40 border border-white/10 rounded-[3rem] p-10 text-center shadow-2xl mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-3xl md:text-4xl font-black text-[#00adef]">30 min</p>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">Temps max SOS</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-black text-amber-400">+500</p>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">Garages Partenaires</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-black text-green-400">99%</p>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">Satisfaction</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-black text-white">24h/7</p>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">Disponibilité</p>
          </div>
        </div>
      </div>

      {/* 5. CTA (Call To Action) */}
      <div className="text-center">
        <button 
          onClick={() => navigate('/')}
          className="bg-white hover:bg-[#00adef] text-black hover:text-white px-10 py-4 rounded-2xl font-black text-lg transition-all border-none cursor-pointer shadow-xl"
        >
          Retour à l'accueil
        </button>
      </div>

    </div>
  );
};

export default About;