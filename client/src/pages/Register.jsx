import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaUserPlus } from "react-icons/fa";
import { registerUser, notifyAuthChange } from "../api/auth";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      setLoading(true);
      const data = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem("autoclickToken", data.token);
      localStorage.setItem("autoclickUser", JSON.stringify(data.user));
      notifyAuthChange();
      setSuccess("Compte créé avec succès. Redirection...");

      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-gray-100">
          <div className="bg-linear-to-br from-[#00adef] via-[#0088cc] to-[#005f99] text-white p-10 md:p-12 flex flex-col justify-center">
            <h1 className="text-4xl font-black mb-4 leading-tight">
              Rejoignez AutoClick
            </h1>
            <p className="text-white/90 font-medium leading-relaxed">
              Créez votre compte pour accéder aux services auto, à la boutique
              et au support rapide près de vous.
            </p>
          </div>

          <div className="p-8 md:p-10">
            <h2 className="text-2xl font-black text-gray-900 mb-2">
              Inscription
            </h2>
            <p className="text-gray-500 font-medium mb-8">
              Commencez en moins d’une minute.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100 flex items-center gap-3">
                <FaUser className="text-[#00adef]" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nom complet"
                  className="w-full bg-transparent outline-none font-bold text-gray-800"
                />
              </div>

              <div className="bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100 flex items-center gap-3">
                <FaEnvelope className="text-[#00adef]" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full bg-transparent outline-none font-bold text-gray-800"
                />
              </div>

              <div className="bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100 flex items-center gap-3">
                <FaLock className="text-[#00adef]" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mot de passe"
                  className="w-full bg-transparent outline-none font-bold text-gray-800"
                />
              </div>

              <div className="bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100 flex items-center gap-3">
                <FaLock className="text-[#00adef]" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirmer le mot de passe"
                  className="w-full bg-transparent outline-none font-bold text-gray-800"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm font-bold">{error}</p>
              )}
              {success && (
                <p className="text-green-600 text-sm font-bold">{success}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#00adef] text-white py-4 rounded-2xl font-black hover:bg-black transition-all border-none cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
              >
                <FaUserPlus /> {loading ? "Inscription..." : "Créer mon compte"}
              </button>
            </form>

            <p className="mt-6 text-gray-600 font-medium">
              Vous avez déjà un compte ?{" "}
              <Link
                to="/login"
                className="text-[#00adef] font-black no-underline hover:text-black transition-colors"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
