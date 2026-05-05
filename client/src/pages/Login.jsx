import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";
import { loginUser, notifyAuthChange } from "../api/auth";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
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

    if (!formData.email || !formData.password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    try {
      setLoading(true);
      const data = await loginUser(formData);

      localStorage.setItem("autoclickToken", data.token);
      localStorage.setItem("autoclickUser", JSON.stringify(data.user));
      notifyAuthChange();
      setSuccess("Connexion réussie. Redirection...");

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
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 border border-gray-100">
          <div
            className="text-white p-10 md:p-12 flex flex-col justify-center"
            style={{
              background:
                "linear-gradient(135deg, #00adef 0%, #0088cc 55%, #005f99 100%)",
            }}
          >
            <h1 className="text-4xl font-black mb-4 leading-tight">
              Bon retour sur AutoClick
            </h1>
            <p className="text-white/90 font-medium leading-relaxed">
              Connectez-vous pour gérer vos services, vos commandes et vos
              demandes d’assistance en quelques clics.
            </p>
          </div>

          <div className="p-8 md:p-10">
            <h2 className="text-2xl font-black text-gray-900 mb-2">
              Connexion
            </h2>
            <p className="text-gray-500 font-medium mb-8">
              Accédez à votre espace client.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
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
                <FaSignInAlt /> {loading ? "Connexion..." : "Se connecter"}
              </button>
            </form>

            <p className="mt-6 text-gray-600 font-medium">
              Pas encore de compte ?{" "}
              <Link
                to="/register"
                className="text-[#00adef] font-black no-underline hover:text-black transition-colors"
              >
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
