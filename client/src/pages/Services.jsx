import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCar, FaTools, FaMapMarkerAlt, FaPhoneAlt, FaCheckCircle, FaTimesCircle, FaStar, FaSpinner } from 'react-icons/fa';
import { fetchNearbyGarages } from '../api/garage';

const Services = () => {
  const navigate = useNavigate();

  const [serviceType, setServiceType] = useState('Lavage');
  const [ville, setVille] = useState('');
  const [adresse, setAdresse] = useState('');
  const [telephone, setTelephone] = useState('');
  const [descriptionMecanique, setDescriptionMecanique] = useState('');
  const [dateRendezVous, setDateRendezVous] = useState('');
  const [selectedGarage, setSelectedGarage] = useState('');

  const [location, setLocation] = useState({ lng: null, lat: null });
  const [garages, setGarages] = useState([]);
  const [loadingGarages, setLoadingGarages] = useState(false);
  const [garagesError, setGaragesError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lng: pos.coords.longitude, lat: pos.coords.latitude });
        },
        () => {}
      );
    }
  }, []);

  useEffect(() => {
    if (!location.lng || !location.lat) return;

    const loadGarages = async () => {
      setLoadingGarages(true);
      setGaragesError('');
      try {
        const data = await fetchNearbyGarages({
          lng: location.lng,
          lat: location.lat,
          type: serviceType,
        });
        setGarages(data.data || []);
      } catch (err) {
        setGaragesError(`Endpoint requis: GET /api/garages/nearby?lng=...&lat=...&type=... — ${err.message}`);
        setGarages([]);
      } finally {
        setLoadingGarages(false);
      }
    };

    loadGarages();
  }, [location.lng, location.lat, serviceType]);

  const handleValider = async (e) => {
    e.preventDefault();
    if (!selectedGarage) {
      alert("Veuillez sélectionner un garage parmi les disponibles.");
      return;
    }

    const reservationData = {
      serviceType,
      garageId: selectedGarage,
      ville,
      adresse,
      telephone,
      dateRendezVous,
      ...(serviceType === 'Mécanique' && { descriptionMecanique }),
      location: { lng: location.lng, lat: location.lat },
    };

    setSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/services/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservationData),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `Erreur ${response.status}`);
      }

      alert("Réservation validée avec succès !");
      navigate('/');
    } catch (err) {
      alert(`Endpoint requis: POST /api/services/book — ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAnnuler = () => {
    navigate('/');
  };

  return (
    <div className="bg-gradient-to-b from-[#0088cc] via-[#005f99] to-[#0a192f] min-h-screen py-16 px-4 font-sans text-white">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <div className="bg-[#0b192f]/95 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <FaTools className="absolute -top-10 -right-10 text-[15rem] rotate-45" />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-center mb-2 tracking-tight">
                Réservation Service
              </h2>
              <p className="text-cyan-100/70 text-center mb-10 font-medium">
                Remplissez le formulaire pour réserver votre prestation.
              </p>

              <form onSubmit={handleValider} className="space-y-6">
                <div>
                  <label className="block text-sm font-black uppercase tracking-wider text-cyan-400 mb-2">
                    Type de Service
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setServiceType('Lavage')}
                      className={`py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 border-2 transition-all cursor-pointer ${
                        serviceType === 'Lavage'
                          ? 'bg-[#00adef] border-[#00adef] text-white shadow-lg'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
                      }`}
                    >
                      <FaCar /> Lavage
                    </button>
                    <button
                      type="button"
                      onClick={() => setServiceType('Mécanique')}
                      className={`py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 border-2 transition-all cursor-pointer ${
                        serviceType === 'Mécanique'
                          ? 'bg-amber-500 border-amber-500 text-white shadow-lg'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
                      }`}
                    >
                      <FaTools /> Mécanique
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-black uppercase tracking-wider text-cyan-400 mb-2">
                    Ville
                  </label>
                  <div className="relative flex items-center bg-white/5 rounded-xl border border-white/10 px-4 focus-within:border-[#00adef] transition-all">
                    <FaMapMarkerAlt className="text-gray-400 mr-3" />
                    <input
                      type="text"
                      required
                      placeholder="Ex: Casablanca, Rabat..."
                      value={ville}
                      onChange={(e) => setVille(e.target.value)}
                      className="w-full py-4 bg-transparent outline-none text-white font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-black uppercase tracking-wider text-cyan-400 mb-2">
                    Adresse Complète
                  </label>
                  <div className="relative flex items-center bg-white/5 rounded-xl border border-white/10 px-4 focus-within:border-[#00adef] transition-all">
                    <FaMapMarkerAlt className="text-gray-400 mr-3" />
                    <input
                      type="text"
                      required
                      placeholder="Ex: N° 12, Rue Mimoza, Maarif"
                      value={adresse}
                      onChange={(e) => setAdresse(e.target.value)}
                      className="w-full py-4 bg-transparent outline-none text-white font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-black uppercase tracking-wider text-cyan-400 mb-2">
                    Numéro de Téléphone
                  </label>
                  <div className="relative flex items-center bg-white/5 rounded-xl border border-white/10 px-4 focus-within:border-[#00adef] transition-all">
                    <FaPhoneAlt className="text-gray-400 mr-3" />
                    <input
                      type="tel"
                      required
                      placeholder="Ex: 0612345678"
                      value={telephone}
                      onChange={(e) => setTelephone(e.target.value)}
                      className="w-full py-4 bg-transparent outline-none text-white font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-black uppercase tracking-wider text-cyan-400 mb-2">
                    Date & Heure souhaitée
                  </label>
                  <div className="relative flex items-center bg-white/5 rounded-xl border border-white/10 px-4 focus-within:border-[#00adef] transition-all">
                    <input
                      type="datetime-local"
                      required
                      value={dateRendezVous}
                      onChange={(e) => setDateRendezVous(e.target.value)}
                      className="w-full py-4 bg-transparent outline-none text-white font-medium"
                    />
                  </div>
                </div>

                {serviceType === 'Mécanique' && (
                  <div>
                    <label className="block text-sm font-black uppercase tracking-wider text-amber-400 mb-2">
                      Décrivez votre problème mécanique
                    </label>
                    <div className="bg-white/5 rounded-xl border border-amber-500/40 p-4 transition-all">
                      <textarea
                        rows="4"
                        required
                        placeholder="Décrivez votre panne..."
                        value={descriptionMecanique}
                        onChange={(e) => setDescriptionMecanique(e.target.value)}
                        className="w-full bg-transparent outline-none text-white font-medium resize-none"
                      ></textarea>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleAnnuler}
                    className="py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 bg-gray-500/20 hover:bg-gray-500/40 border-none text-white cursor-pointer transition-all"
                  >
                    <FaTimesCircle /> Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !selectedGarage}
                    className={`py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 border-none text-white transition-all shadow-lg ${
                      serviceType === 'Lavage'
                        ? 'bg-[#00adef] hover:bg-white hover:text-black shadow-sky-500/20'
                        : 'bg-amber-500 hover:bg-white hover:text-black shadow-amber-500/20'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {submitting ? <FaSpinner className="animate-spin" /> : <FaCheckCircle />}
                    {submitting ? "En cours..." : "Valider"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-[#0b192f]/95 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-[2.5rem] shadow-2xl sticky top-24">
            <h3 className="text-xl font-black mb-4 flex items-center gap-2">
              <FaMapMarkerAlt className="text-[#00adef]" />
              Prestataires à proximité
            </h3>

            {!location.lng ? (
              <p className="text-gray-400 text-sm font-medium">
                Activez votre localisation pour voir les prestataires disponibles.
              </p>
            ) : loadingGarages ? (
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <FaSpinner className="animate-spin" />
                Recherche des prestataires...
              </div>
            ) : garagesError ? (
              <div className="bg-red-900/30 border border-red-500/30 rounded-xl p-4 text-xs text-red-300">
                {garagesError}
              </div>
            ) : garages.length === 0 ? (
              <div className="bg-white/5 rounded-xl p-4 text-sm text-gray-400">
                Aucun prestataire disponible pour ce type de service à proximité.
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {garages.map((garage) => (
                  <button
                    type="button"
                    key={garage._id}
                    onClick={() => setSelectedGarage(garage._id)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      selectedGarage === garage._id
                        ? 'border-[#00adef] bg-[#00adef]/10'
                        : 'border-white/10 bg-white/5 hover:border-white/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-black text-white">{garage.name}</p>
                        <p className="text-xs text-cyan-300 font-medium">{garage.type}</p>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400 text-xs">
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                      </div>
                    </div>
                    {garage.address && (
                      <p className="text-xs text-gray-400 mt-2">{garage.address}</p>
                    )}
                    {garage.phone && (
                      <p className="text-xs text-gray-400 mt-1">{garage.phone}</p>
                    )}
                  </button>
                ))}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-gray-500 font-medium">
                {selectedGarage
                  ? "Prestataire sélectionné. Remplissez le formulaire et validez."
                  : "Sélectionnez un prestataire pour continuer."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
