import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTruckPickup, FaTools, FaMapMarkerAlt, FaPhoneAlt, FaExclamationTriangle, FaCompass, FaCheck } from 'react-icons/fa';

const Sos = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Formulaire SOS, 2: Tracking en cours
  const [sosType, setSosType] = useState('remorquage'); // remorquage أو mecanique
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState({ lat: null, lng: null, accuracy: null });
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [countdown, setCountdown] = useState(1800); // 30 دقيقة بالثواني

  // دالة جلب الـ GPS الحقيقي للمستخدم بدقة عالية
  const fetchGPS = () => {
    setLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy.toFixed(1)
          });
          setLoadingLocation(false);
        },
        (error) => {
          console.error("Error securing GPS:", error);
          setLoadingLocation(false);
          alert("Impossible لإنقاذ موقعك تلقائياً. المرجو تفعيل الـ GPS في هاتفك.");
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setLoadingLocation(false);
      alert("Votre navigateur ne supporte pas la géolocalisation.");
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy.toFixed(1)
          });
        },
        () => {}
      );
    }
  }, []);

  // عداد تنازلي وهمي للشاشة الثانية لإعطاء طابع حي للمشروع
  useEffect(() => {
    let timer;
    if (step === 2 && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleConfirmSOS = (e) => {
    e.preventDefault();
    if (!phone) {
      alert("Veuillez entrer votre numéro de téléphone pour le sauveteur.");
      return;
    }
    // الانتقال لشاشة التتبع والبحث عن أقرب عربة
    setStep(2);
  };

  return (
    <div className="bg-gradient-to-b from-[#0a192f] via-red-950/20 to-[#0a192f] min-h-screen py-16 px-4 font-sans text-white flex items-center justify-center">
      
      {/* أنيميشن نبضات الخطر الخلفية (SOS Radar Effect) */}
      <style>{`
        @keyframes pulseRadar {
          0% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(0.95); opacity: 0.5; }
        }
        .animate-radar { animation: pulseRadar 2s infinite ease-in-out; }
      `}</style>

      <div className="bg-[#0b192f]/95 backdrop-blur-md border-2 border-red-600/35 p-8 md:p-12 rounded-[2.5rem] w-full max-w-xl shadow-[0_0_50px_rgba(239,68,68,0.15)] relative overflow-hidden">
        
        {/* الخط العلوي التحذيري الأحمر */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-amber-500 to-red-600 animate-pulse"></div>

        {/* المرحلة الأولى: طلب الإغاثة وتحديد الموقع */}
        {step === 1 && (
          <div>
            <div className="text-center mb-8">
              <div className="bg-red-600 text-white w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-4 text-3xl shadow-lg shadow-red-600/40 animate-radar">
                <FaExclamationTriangle />
              </div>
              <h2 className="text-3xl font-black text-red-500 uppercase tracking-wider">Dépannage Urgent SOS</h2>
              <p className="text-gray-400 mt-2 text-sm font-medium">
                Partagez votre position GPS, l'aide arrive immédiatement.
              </p>
            </div>

            <form onSubmit={handleConfirmSOS} className="space-y-6">
              
              {/* الاختيار السريع للخدمة الاستعجالية */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-red-400 mb-2">
                  Besoin urgent de quoi ?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setSosType('remorquage')}
                    className={`py-4 rounded-xl font-black text-sm flex flex-col items-center justify-center gap-2 border-2 transition-all cursor-pointer ${
                      sosType === 'remorquage' 
                        ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/20' 
                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <FaTruckPickup className="text-2xl" />
                    Remorquage (ديباناج)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSosType('mecanique')}
                    className={`py-4 rounded-xl font-black text-sm flex flex-col items-center justify-center gap-2 border-2 transition-all cursor-pointer ${
                      sosType === 'mecanique' 
                        ? 'bg-amber-600 border-amber-500 text-white shadow-lg shadow-amber-600/20' 
                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    <FaTools className="text-2xl" />
                    Mécanicien Mobile
                  </button>
                </div>
              </div>

              {/* جي بي إس وعرض إحداثيات الموقع الحية */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-red-400 mb-2">
                  Votre Position GPS
                </label>
                <div className="bg-white/5 rounded-xl border border-white/10 p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FaMapMarkerAlt className={location.lat ? "text-green-400 text-xl" : "text-red-500 text-xl animate-bounce"} />
                      <div>
                        <p className="font-bold text-sm">
                          {location.lat ? "Position GPS détectée" : "Recherche du signal GPS..."}
                        </p>
                        {location.lat && (
                          <p className="text-xs text-gray-400">Précision: ± {location.accuracy}m</p>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={fetchGPS}
                      className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-bold border-none cursor-pointer flex items-center gap-1 transition-all"
                    >
                      <FaCompass className={loadingLocation ? "animate-spin" : ""} /> Actualiser
                    </button>
                  </div>

                  {location.lat ? (
                    <div className="bg-black/40 p-3 rounded-lg text-xs font-mono text-cyan-400 space-y-1">
                      <p>Latitude: {location.lat}</p>
                      <p>Longitude: {location.lng}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-amber-400 font-medium">
                      ⚠️ Veuillez autoriser l'accès à la localisation pour un secours précis.
                    </p>
                  )}
                </div>
              </div>

              {/* هاتف التواصل الطوارئ */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-red-400 mb-2">
                  Numéro de Téléphone (Pour le chauffeur)
                </label>
                <div className="relative flex items-center bg-white/5 rounded-xl border border-white/10 px-4 focus-within:border-red-500 transition-all">
                  <FaPhoneAlt className="text-gray-400 mr-3" />
                  <input
                    type="tel"
                    required
                    placeholder="Ex: 0612345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full py-4 bg-transparent outline-none text-white font-medium"
                  />
                </div>
              </div>

              {/* أزرار التحكم */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="py-4 rounded-xl font-black bg-white/5 hover:bg-white/10 text-white border-none cursor-pointer transition-all"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={!location.lat}
                  className={`py-4 rounded-xl font-black text-white border-none transition-all shadow-lg flex items-center justify-center gap-2 ${
                    location.lat 
                      ? 'bg-red-600 hover:bg-red-700 cursor-pointer shadow-red-600/30' 
                      : 'bg-gray-700 cursor-not-allowed opacity-50'
                  }`}
                >
                  Lancer SOS !
                </button>
              </div>

            </form>
          </div>
        )}

        {/* المرحلة الثانية: الشاشة التفاعلية الحية والعداد التنازلي لإبهار اللجنة */}
        {step === 2 && (
          <div className="text-center py-6 space-y-8 animate-fade-in">
            <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
              {/* حلقات رادار تنبض حول الدائرة المركزية */}
              <div className="absolute inset-0 rounded-full bg-red-600/20 animate-ping"></div>
              <div className="absolute -inset-4 rounded-full bg-red-500/10 animate-pulse"></div>
              <div className="w-24 h-24 rounded-full bg-red-600 flex items-center justify-center text-4xl text-white shadow-2xl relative z-10">
                {sosType === 'remorquage' ? <FaTruckPickup className="animate-bounce" /> : <FaTools className="animate-spin" style={{ animationDuration: '3s' }} />}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-black text-white">Recherche de secours en cours...</h3>
              <p className="text-sm text-cyan-400 font-bold mt-1 tracking-wider uppercase animate-pulse">
                Signal GPS envoyé aux dépanneurs proches
              </p>
            </div>

            {/* العداد التنازلي الحقيقي لـ 30 دقيقة */}
            <div className="bg-black/30 max-w-xs mx-auto py-4 rounded-2xl border border-white/5 shadow-inner">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Temps d'arrivée estimé</p>
              <p className="text-4xl font-mono font-black text-red-500 mt-1 tracking-wider">
                {formatTime(countdown)}
              </p>
            </div>

            {/* تفاصيل الإرسال */}
            <div className="bg-white/5 p-4 rounded-xl text-left max-w-sm mx-auto border border-white/5 text-xs space-y-2 text-gray-300">
              <div className="flex justify-between items-center">
                <span>Statut du signal:</span>
                <span className="text-green-400 font-bold flex items-center gap-1"><FaCheck /> Émis avec succès</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Type de dépanneur requis:</span>
                <span className="font-bold text-white capitalize">{sosType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Téléphone de liaison:</span>
                <span className="font-mono font-bold text-white">{phone}</span>
              </div>
            </div>

            <button
              onClick={() => {
                if(window.confirm("Voulez-vous vraiment annuler la demande de secours SOS ?")) {
                  setStep(1);
                  setCountdown(1800);
                }
              }}
              className="px-8 py-3 bg-white/5 hover:bg-red-600/20 text-gray-400 hover:text-red-400 font-bold rounded-xl border border-white/10 hover:border-red-500/40 cursor-pointer transition-all text-sm"
            >
              Annuler le Secours
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Sos;