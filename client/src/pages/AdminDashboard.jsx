import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTrash,
  FaUsers,
  FaShieldAlt,
  FaUserTie,
  FaPlus,
  FaEdit,
  FaSave,
  FaWarehouse,
  FaBox,
  FaSignOutAlt,
  FaSpinner,
  FaClipboardList,
  FaShower,
  FaCogs,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaTimesCircle
} from "react-icons/fa";
import {
  createUser,
  deleteUserById,
  fetchUsers,
  updateUserById,
} from "../api/users";
import {
  fetchAllGarages,
  createGarage,
  updateGarageById,
  deleteGarageById,
  updateGarageSubscription,
} from "../api/garage";
import {
  fetchProducts,
  createProduct,
  updateProductById,
  deleteProductById,
} from "../api/products";
import { getStoredUser, notifyAuthChange, clearAuth } from "../api/auth";
import { showNotification } from "../components/Notification";

// 📦 إضافة صنف الـ Demandes لتبديل القوائم
const TABS = [
  { key: "users", label: "Utilisateurs", icon: FaUsers },
  { key: "demandes", label: "Demandes & Services", icon: FaClipboardList },
  { key: "garages", label: "Garages", icon: FaWarehouse },
  { key: "products", label: "Produits", icon: FaBox },
];

// البيانات الوهمية للطلبات (Lavage / Mécanicien / Boutique) لعرضها ديريكت أمام اللجنة
const INITIAL_DEMANDES = [
  {
    id: "req1",
    firstName: "Amine",
    lastName: "Tazi",
    phone: "0655443322",
    location: "Casablanca, Ain Chock",
    type: "Mécanicien",
    problem: "Surchauffe moteur et bruit bizarre au niveau des freins avant lors du freinage."
  },
  {
    id: "req2",
    firstName: "Youssef",
    lastName: "Alami",
    phone: "0677889900",
    location: "Rabat, Agdal",
    type: "Lavage",
    problem: "Lavage complet intérieur/extérieur à domicile + Polissage des phares."
  },
  {
    id: "req3",
    firstName: "Sanaa",
    lastName: "Benjelloun",
    phone: "0611223344",
    location: "Casablanca, Maarif",
    type: "Lavage",
    problem: "Nettoyage en profondeur des sièges en tissu après renversement de café."
  },
  {
    id: "req4",
    firstName: "Karim",
    lastName: "Mansouri",
    phone: "0699887766",
    location: "Tangier, Malabata",
    type: "Boutique",
    problem: "Commande de 5 Chiffons Microfibres et 1 Shampoing Haute Mousse (Total: 465 DH)."
  }
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const authUser = getStoredUser();
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-[3rem] shadow-xl p-8 md:p-10 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-[#00adef] font-black uppercase tracking-[0.2em] text-sm mb-2">
                Admin dashboard
              </p>
              <h1 className="text-4xl font-black text-gray-900">
                Gestion de la plateforme
              </h1>
              <p className="text-gray-500 font-medium mt-2">
                Gérez les utilisateurs, les demandes de services (Lavage / Mécanique) et la boutique.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 text-gray-700 font-black bg-gray-50 px-4 py-3 rounded-2xl">
                <FaUserTie className="text-[#00adef]" />
                {authUser?.name}
              </div>
              <button
                type="button"
                onClick={() => { clearAuth(); navigate("/"); }}
                className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-2xl font-black hover:bg-red-100 transition-all cursor-pointer border-none"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-gray-100">
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 px-6 py-5 font-black text-sm uppercase tracking-wider transition-all cursor-pointer border-none ${
                    activeTab === tab.key
                      ? "bg-[#00adef]/5 text-[#00adef] border-b-2 border-[#00adef]"
                      : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  <Icon /> {tab.label}
                </button>
              );
            })}
          </div>

          {/* Panels view */}
          <div className="p-8">
            {activeTab === "users" && <UsersPanel />}
            {activeTab === "demandes" && <DemandesPanel />}
            {activeTab === "garages" && <GaragesPanel />}
            {activeTab === "products" && <ProductsPanel />}
          </div>
        </div>
      </div>
    </div>
  );
};

// 👥 1. لوحة التحكم في المستخدمين (محدثة بميزات تحويل الـ Admin والتفعيل)
const UsersPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingUserId, setEditingUserId] = useState("");
  const [formData, setFormData] = useState({
    name: "", email: "", password: "", role: "customer", status: "active"
  });

  useEffect(() => {
    let cancelled = false;
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchUsers();
        if (!cancelled) setUsers(data.users || []);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadUsers();
    return () => { cancelled = true; };
  }, []);

  const reloadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchUsers();
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const total = users.length;
    const admins = users.filter((u) => u.role === "admin").length;
    const customers = users.filter((u) => u.role === "customer").length;
    return { total, admins, customers };
  }, [users]);

  // دالة سريعة لتبديل الـ Role بين customer و admin مباشرة من السطر
  const handleToggleAdmin = async (user) => {
    const nextRole = user.role === "admin" ? "customer" : "admin";
    try {
      await updateUserById(user._id, { name: user.name, email: user.email, role: nextRole });
      showNotification("Rôle mis à jour avec succès", "success");
      await reloadUsers();
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  // دالة سريعة لتفعيل أو توقيف حساب العميل
  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === "inactive" ? "active" : "inactive";
    try {
      await updateUserById(user._id, { name: user.name, email: user.email, status: nextStatus });
      showNotification(`Compte ${nextStatus === "active" ? "activé" : "désactivé"}`, "success");
      await reloadUsers();
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    try {
      setDeletingId(userId);
      await deleteUserById(userId);
      showNotification("Utilisateur supprimé", "success");
      await reloadUsers();
    } catch (err) {
      showNotification(err.message, "error");
    } finally {
      setDeletingId("");
    }
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", password: "", role: "customer", status: "active" });
    setEditingUserId("");
  };

  const handleEdit = (user) => {
    setEditingUserId(user._id);
    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: "",
      role: user.role || "customer",
      status: user.status || "active"
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || (!editingUserId && !formData.password)) {
      setError("Le nom, l'email et le mot de passe sont requis.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      const payload = { name: formData.name, email: formData.email, role: formData.role, status: formData.status };
      if (formData.password) payload.password = formData.password;

      if (editingUserId) {
        const updated = await updateUserById(editingUserId, payload);
        const currentUser = getStoredUser();
        const currentUserId = currentUser?._id || currentUser?.id;
        if (currentUserId && currentUserId.toString() === editingUserId.toString()) {
          const nextStoredUser = { ...currentUser, ...updated.user, _id: updated.user?._id || updated.user?.id || currentUserId };
          localStorage.setItem("autoclickUser", JSON.stringify(nextStoredUser));
          notifyAuthChange();
        }
        showNotification("Utilisateur mis à jour", "success");
      } else {
        await createUser(payload);
        showNotification("Utilisateur créé", "success");
      }
      resetForm();
      await reloadUsers();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-12"><FaSpinner className="animate-spin text-3xl text-[#00adef] mx-auto" /></div>;

  return (
    <div className="space-y-8">
      {/* Cards فوقانية كتعطيك شحال كاين */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-50 rounded-[2.5rem] p-6 border border-gray-100">
          <div className="flex items-center gap-3 text-gray-500 font-bold mb-3"><FaUsers className="text-[#00adef]" /> Total</div>
          <p className="text-4xl font-black text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-gray-50 rounded-[2.5rem] p-6 border border-gray-100">
          <div className="flex items-center gap-3 text-gray-500 font-bold mb-3"><FaShieldAlt className="text-[#00adef]" /> Admins</div>
          <p className="text-4xl font-black text-gray-900">{stats.admins}</p>
        </div>
        <div className="bg-gray-50 rounded-[2.5rem] p-6 border border-gray-100">
          <div className="flex items-center gap-3 text-gray-500 font-bold mb-3"><FaUserTie className="text-[#00adef]" /> Clients</div>
          <p className="text-4xl font-black text-gray-900">{stats.customers}</p>
        </div>
      </div>

      {/* Formulaire */}
      <div className="bg-gray-50 rounded-[2.5rem] p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          {editingUserId ? <FaEdit className="text-[#00adef]" /> : <FaPlus className="text-[#00adef]" />}
          <h2 className="text-2xl font-black text-gray-900">{editingUserId ? "Modifier" : "Créer"} un utilisateur</h2>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Nom" className="bg-white border border-gray-100 rounded-2xl px-4 py-3 font-semibold outline-none" />
          <input type="email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Email" className="bg-white border border-gray-100 rounded-2xl px-4 py-3 font-semibold outline-none" />
          <input type="password" name="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder={editingUserId ? "Nouveau mot de passe (optionnel)" : "Mot de passe"} className="bg-white border border-gray-100 rounded-2xl px-4 py-3 font-semibold outline-none" />
          <select name="role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="bg-white border border-gray-100 rounded-2xl px-4 py-3 font-semibold outline-none">
            <option value="customer">customer</option>
            <option value="garageOwner">garageOwner</option>
            <option value="admin">admin</option>
          </select>
          {error && <p className="md:col-span-2 text-red-500 font-bold">{error}</p>}
          <div className="md:col-span-2 flex items-center gap-3">
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 bg-[#00adef] text-white px-6 py-3 rounded-2xl font-black disabled:opacity-60 cursor-pointer border-none">
              <FaSave /> {saving ? "En cours..." : editingUserId ? "Mettre à jour" : "Créer"}
            </button>
            {editingUserId && (
              <button type="button" onClick={resetForm} className="inline-flex items-center gap-2 bg-gray-200 text-gray-900 px-6 py-3 rounded-2xl font-black cursor-pointer border-none">
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto bg-white rounded-[2.5rem] border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-sm">
            <tr>
              <th className="px-6 py-4">Nom</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Rôle</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4 text-center">Actions Administrateur</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t border-gray-100 hover:bg-gray-50/60 transition-colors">
                <td className="px-6 py-5 font-black text-gray-900">{user.name}</td>
                <td className="px-6 py-5 text-gray-600">{user.email}</td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1 rounded-full text-xs font-black ${user.role === "admin" ? "bg-[#00adef]/10 text-[#00adef]" : "bg-gray-100 text-gray-600"}`}>{user.role}</span>
                </td>
                <td className="px-6 py-5">
                  {user.status === "inactive" ? (
                    <span className="text-red-500 font-bold flex items-center gap-1 text-xs"><FaTimesCircle /> Inactif</span>
                  ) : (
                    <span className="text-green-500 font-bold flex items-center gap-1 text-xs"><FaCheckCircle /> Actif</span>
                  )}
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center justify-center gap-2">
                    {/* زر تغيير الرتبة */}
                    <button 
                      type="button" 
                      onClick={() => handleToggleAdmin(user)} 
                      className={`px-3 py-1.5 rounded-xl text-xs font-black border-none cursor-pointer text-white ${user.role === 'admin' ? 'bg-gray-600' : 'bg-purple-600'}`}
                    >
                      {user.role === "admin" ? "Retirer Admin" : "Rendre Admin"}
                    </button>
                    {/* زر التفعيل والتوقيف */}
                    <button 
                      type="button" 
                      onClick={() => handleToggleStatus(user)} 
                      className={`px-3 py-1.5 rounded-xl text-xs font-black border-none cursor-pointer ${user.status === 'inactive' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}
                    >
                      {user.status === "inactive" ? "Activer Account" : "Désactiver"}
                    </button>
                    {/* تعديل وحذف */}
                    <button type="button" onClick={() => handleEdit(user)} className="bg-gray-100 text-gray-800 p-2 rounded-xl border-none cursor-pointer"><FaEdit /></button>
                    <button type="button" onClick={() => handleDelete(user._id)} disabled={deletingId === user._id} className="bg-red-600 text-white p-2 rounded-xl border-none cursor-pointer"><FaTrash /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 📋 2. الـ Panel الجديد الخاص بالطلبات والخدمات (Demandes / Lavage / Mécanicien)
const DemandesPanel = () => {
  const [demandes] = useState(INITIAL_DEMANDES);
  const [activeFilter, setActiveFilter] = useState("Tous");

  // الحساب الديناميكي لإحصائيات الطلبات الفوقانية
  const stats = useMemo(() => {
    const total = demandes.length;
    const lavage = demandes.filter((d) => d.type === "Lavage").length;
    const mecanicien = demandes.filter((d) => d.type === "Mécanicien").length;
    const boutique = demandes.filter((d) => d.type === "Boutique").length;
    return { total, lavage, mecanicien, boutique };
  }, [demandes]);

  // التصفية الفورية للجدول عند الضغط على أي كارت
  const filteredDemandes = demandes.filter((d) => {
    if (activeFilter === "Tous") return true;
    return d.type === activeFilter;
  });

  return (
    <div className="space-y-8">
      {/* 📊 الكروت التفاعلية للإحصائيات */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => setActiveFilter("Tous")}
          className={`p-6 rounded-[2rem] border transition-all duration-300 cursor-pointer shadow-sm flex items-center justify-between ${
            activeFilter === "Tous" ? "bg-[#00adef] text-white border-[#00adef] scale-105" : "bg-gray-50 text-gray-800 border-gray-100 hover:border-cyan-200"
          }`}
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-wider opacity-80">Total Demandes</p>
            <h3 className="text-3xl font-black mt-2">{stats.total}</h3>
          </div>
          <FaClipboardList className="text-2xl opacity-50" />
        </div>

        <div 
          onClick={() => setActiveFilter("Lavage")}
          className={`p-6 rounded-[2rem] border transition-all duration-300 cursor-pointer shadow-sm flex items-center justify-between ${
            activeFilter === "Lavage" ? "bg-blue-500 text-white border-blue-500 scale-105" : "bg-gray-50 text-gray-800 border-gray-100 hover:border-blue-200"
          }`}
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-wider opacity-80">Demandes Lavage</p>
            <h3 className="text-3xl font-black mt-2">{stats.lavage}</h3>
          </div>
          <FaShower className="text-2xl opacity-50" />
        </div>

        <div 
          onClick={() => setActiveFilter("Mécanicien")}
          className={`p-6 rounded-[2rem] border transition-all duration-300 cursor-pointer shadow-sm flex items-center justify-between ${
            activeFilter === "Mécanicien" ? "bg-amber-500 text-white border-amber-500 scale-105" : "bg-gray-50 text-gray-800 border-gray-100 hover:border-amber-200"
          }`}
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-wider opacity-80">Besoin Mécanicien</p>
            <h3 className="text-3xl font-black mt-2">{stats.mecanicien}</h3>
          </div>
          <FaCogs className="text-2xl opacity-50" />
        </div>

        <div 
          onClick={() => setActiveFilter("Boutique")}
          className={`p-6 rounded-[2rem] border transition-all duration-300 cursor-pointer shadow-sm flex items-center justify-between ${
            activeFilter === "Boutique" ? "bg-purple-500 text-white border-purple-500 scale-105" : "bg-gray-50 text-gray-800 border-gray-100 hover:border-purple-200"
          }`}
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-wider opacity-80">Commandes Boutique</p>
            <h3 className="text-3xl font-black mt-2">{stats.boutique}</h3>
          </div>
          <FaBox className="text-2xl opacity-50" />
        </div>
      </div>

      {/* 📋 جدول تفاصيل الزبون والطلب الجغرافي والمشكل بالظبط */}
      <div className="overflow-x-auto bg-white rounded-[2.5rem] border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-black text-gray-800 text-lg">
            {activeFilter === "Tous" ? "Toutes les demandes reçues" : `Filtré par: ${activeFilter}`}
          </h3>
          <span className="text-xs bg-[#00adef]/10 text-[#00adef] px-3 py-1 rounded-full font-black">
            {filteredDemandes.length} demandes
          </span>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-8 py-4">Client & Contact</th>
              <th className="px-8 py-4">Service</th>
              <th className="px-8 py-4">Description du Problème / Commande</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {filteredDemandes.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-8 py-5">
                  <div className="font-black text-gray-900">{d.firstName} {d.lastName}</div>
                  <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                    <FaPhoneAlt className="text-[10px]" /> {d.phone}
                  </div>
                  <div className="text-xs text-[#00adef] font-bold flex items-center gap-1 mt-0.5">
                    <FaMapMarkerAlt className="text-[10px]" /> {d.location}
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className={`px-3 py-1 rounded-full text-xs font-black ${
                    d.type === "Lavage" ? "bg-blue-50 text-blue-600" :
                    d.type === "Mécanicien" ? "bg-amber-50 text-amber-600" : "bg-purple-50 text-purple-600"
                  }`}>
                    {d.type}
                  </span>
                </td>
                <td className="px-8 py-5 max-w-xs">
                  <p className="text-gray-600 text-xs leading-relaxed bg-gray-50 p-3 rounded-2xl border border-gray-100 font-medium">
                    {d.problem}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 🚗 3. لوحة تحكم الكراجات (نفس الكود القديم ديالك بدون أي تعديل خارق)
const GaragesPanel = () => {
  const [garages, setGarages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [formData, setFormData] = useState({
    name: "", type: "Lavage", address: "", phone: "", lng: "", lat: "", isSubscribed: false,
  });

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchAllGarages();
        if (!cancelled) setGarages(data.data || data.garages || []);
      } catch (err) {
        if (!cancelled) setError(`Endpoint requis: GET /api/garages — ${err.message}`);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const reloadGarages = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchAllGarages();
      setGarages(data.data || data.garages || []);
    } catch (err) {
      setError(`Endpoint requis: GET /api/garages — ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", type: "Lavage", address: "", phone: "", lng: "", lat: "", isSubscribed: false });
    setEditingId("");
  };

  const handleEdit = (g) => {
    setEditingId(g._id);
    setFormData({
      name: g.name || "",
      type: g.type || "Lavage",
      address: g.address || "",
      phone: g.phone || "",
      lng: g.location?.coordinates?.[0] ?? "",
      lat: g.location?.coordinates?.[1] ?? "",
      isSubscribed: g.isSubscribed || false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.type) return;

    try {
      setSaving(true);
      const payload = {
        name: formData.name,
        type: formData.type,
        address: formData.address,
        phone: formData.phone,
        location: {
          type: "Point",
          coordinates: [parseFloat(formData.lng) || 0, parseFloat(formData.lat) || 0],
        },
      };

      if (editingId) {
        await updateGarageById(editingId, payload);
        showNotification("Garage mis à jour", "success");
      } else {
        await createGarage(payload);
        showNotification("Garage créé", "success");
      }
      resetForm();
      await reloadGarages();
    } catch (err) {
      showNotification(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce garage ?")) return;
    try {
      setDeletingId(id);
      await deleteGarageById(id);
      showNotification("Garage supprimé", "success");
      await reloadGarages();
    } catch (err) {
      showNotification(err.message, "error");
    } finally {
      setDeletingId("");
    }
  };

  const handleSubscription = async (garageId, months) => {
    try {
      await updateGarageSubscription(garageId, months);
      showNotification("Abonnement mis à jour", "success");
      await reloadGarages();
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  if (loading) return <div className="text-center py-12"><FaSpinner className="animate-spin text-3xl text-[#00adef] mx-auto" /></div>;

  return (
    <div className="space-y-8">
      {error && <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm font-medium">{error}</div>}
      <div className="bg-gray-50 rounded-[2.5rem] p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          {editingId ? <FaEdit className="text-[#00adef]" /> : <FaPlus className="text-[#00adef]" />}
          <h2 className="text-2xl font-black text-gray-900">{editingId ? "Modifier" : "Ajouter"} un garage</h2>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" placeholder="Nom du garage" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="bg-white border border-gray-100 rounded-2xl px-4 py-3 font-semibold outline-none" />
          <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="bg-white border border-gray-100 rounded-2xl px-4 py-3 font-semibold outline-none">
            <option value="Lavage">Lavage</option>
            <option value="Mécanique">Mécanique</option>
            <option value="Dépannage">Dépannage</option>
          </select>
          <input type="text" placeholder="Adresse" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="bg-white border border-gray-100 rounded-2xl px-4 py-3 font-semibold outline-none" />
          <input type="text" placeholder="Téléphone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="bg-white border border-gray-100 rounded-2xl px-4 py-3 font-semibold outline-none" />
          <input type="number" step="any" placeholder="Longitude" value={formData.lng} onChange={(e) => setFormData({ ...formData, lng: e.target.value })} className="bg-white border border-gray-100 rounded-2xl px-4 py-3 font-semibold outline-none" />
          <input type="number" step="any" placeholder="Latitude" value={formData.lat} onChange={(e) => setFormData({ ...formData, lat: e.target.value })} className="bg-white border border-gray-100 rounded-2xl px-4 py-3 font-semibold outline-none" />
          <div className="md:col-span-3 flex items-center gap-3">
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 bg-[#00adef] text-white px-6 py-3 rounded-2xl font-black disabled:opacity-60 cursor-pointer border-none">
              <FaSave /> {saving ? "En cours..." : editingId ? "Mettre à jour" : "Créer"}
            </button>
            {editingId && <button type="button" onClick={resetForm} className="inline-flex items-center gap-2 bg-gray-200 text-gray-900 px-6 py-3 rounded-2xl font-black cursor-pointer border-none">Annuler</button>}
          </div>
        </form>
      </div>

      <div className="overflow-x-auto bg-white rounded-[2.5rem] border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-sm">
            <tr>
              <th className="px-8 py-4">Nom</th>
              <th className="px-8 py-4">Type</th>
              <th className="px-8 py-4">Adresse</th>
              <th className="px-8 py-4">Abonnement</th>
              <th className="px-8 py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {garages.map((g) => (
              <tr key={g._id} className="border-t border-gray-100 hover:bg-gray-50/60 transition-colors">
                <td className="px-8 py-5 font-black text-gray-900">{g.name}</td>
                <td className="px-8 py-5">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-[#00adef]/10 text-[#00adef]">{g.type}</span>
                </td>
                <td className="px-8 py-5 text-gray-600 text-sm">{g.address || "-"}</td>
                <td className="px-8 py-5">
                  <span className={`text-xs font-black ${g.isSubscribed ? "text-green-600" : "text-red-500"}`}>{g.isSubscribed ? "Actif" : "Inactif"}</span>
                  <button type="button" onClick={() => handleSubscription(g._id, 1)} className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded-lg font-bold cursor-pointer border-none hover:bg-gray-200">+1 mois</button>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => handleEdit(g)} className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-2xl font-black cursor-pointer border-none"><FaEdit /> Edit</button>
                    <button type="button" onClick={() => handleDelete(g._id)} disabled={deletingId === g._id} className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-2xl font-black disabled:opacity-60 cursor-pointer border-none"><FaTrash /> {deletingId === g._id ? "..." : "Delete"}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// 📦 4. لوحة تحكم المنتجات والسلع (نفس الكود القديم ديالك بدون أي تعديل خارق)
const ProductsPanel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [formData, setFormData] = useState({
    name: "", description: "", price: "", category: "Accessoires", image: "", stock: "",
  });

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchProducts();
        if (!cancelled) setProducts(data.products || []);
      } catch (err) {
        if (!cancelled) setError(`Endpoint requis: GET /api/products — ${err.message}`);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const reloadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchProducts();
      setProducts(data.products || []);
    } catch (err) {
      setError(`Endpoint requis: GET /api/products — ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", price: "", category: "Accessoires", image: "", stock: "" });
    setEditingId("");
  };

  const handleEdit = (p) => {
    setEditingId(p._id);
    setFormData({
      name: p.name || "",
      description: p.description || "",
      price: p.price?.toString() || "",
      category: p.category || "Accessoires",
      image: p.image || "",
      stock: p.stock?.toString() || "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    try {
      setSaving(true);
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        image: formData.image,
        stock: parseInt(formData.stock) || 0,
      };

      if (editingId) {
        await updateProductById(editingId, payload);
        showNotification("Produit mis à jour", "success");
      } else {
        await createProduct(payload);
        showNotification("Produit créé", "success");
      }
      resetForm();
      await reloadProducts();
    } catch (err) {
      showNotification(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce produit ?")) return;
    try {
      setDeletingId(id);
      await deleteProductById(id);
      showNotification("Produit supprimé", "success");
      await reloadProducts();
    } catch (err) {
      showNotification(err.message, "error");
    } finally {
      setDeletingId("");
    }
  };

  if (loading) return <div className="text-center py-12"><FaSpinner className="animate-spin text-3xl text-[#00adef] mx-auto" /></div>;

  return (
    <div className="space-y-8">
      {error && <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm font-medium">{error}</div>}
      <div className="bg-gray-50 rounded-[2.5rem] p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          {editingId ? <FaEdit className="text-[#00adef]" /> : <FaPlus className="text-[#00adef]" />}
          <h2 className="text-2xl font-black text-gray-900">{editingId ? "Modifier" : "Ajouter"} un produit</h2>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" placeholder="Nom du produit" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="bg-white border border-gray-100 rounded-2xl px-4 py-3 font-semibold outline-none" />
          <input type="number" step="0.01" placeholder="Prix (DH)" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required className="bg-white border border-gray-100 rounded-2xl px-4 py-3 font-semibold outline-none" />
          <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="bg-white border border-gray-100 rounded-2xl px-4 py-3 font-semibold outline-none">
            <option value="Accessoires">Accessoires</option>
            <option value="Entretien">Entretien</option>
            <option value="Pièces">Pièces</option>
            <option value="Éclairage">Éclairage</option>
          </select>
          <input type="text" placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="bg-white border border-gray-100 rounded-2xl px-4 py-3 font-semibold outline-none md:col-span-2" />
          <input type="text" placeholder="URL de l'image" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="bg-white border border-gray-100 rounded-2xl px-4 py-3 font-semibold outline-none" />
          <input type="number" placeholder="Stock" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="bg-white border border-gray-100 rounded-2xl px-4 py-3 font-semibold outline-none" />
          <div className="md:col-span-3 flex items-center gap-3">
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 bg-[#00adef] text-white px-6 py-3 rounded-2xl font-black disabled:opacity-60 cursor-pointer border-none">
              <FaSave /> {saving ? "En cours..." : editingId ? "Mettre à jour" : "Créer"}
            </button>
            {editingId && <button type="button" onClick={resetForm} className="inline-flex items-center gap-2 bg-gray-200 text-gray-900 px-6 py-3 rounded-2xl font-black cursor-pointer border-none">Annuler</button>}
          </div>
        </form>
      </div>

      <div className="overflow-x-auto bg-white rounded-[2.5rem] border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-sm">
            <tr>
              <th className="px-8 py-4">Nom</th>
              <th className="px-8 py-4">Catégorie</th>
              <th className="px-8 py-4">Prix</th>
              <th className="px-8 py-4">Stock</th>
              <th className="px-8 py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-t border-gray-100 hover:bg-gray-50/60 transition-colors">
                <td className="px-8 py-5 font-black text-gray-900">{p.name}</td>
                <td className="px-8 py-5">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/10 text-amber-600">{p.category}</span>
                </td>
                <td className="px-8 py-5 font-bold text-gray-900">{p.price} DH</td>
                <td className="px-8 py-5 text-gray-600">{p.stock ?? "-"}</td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => handleEdit(p)} className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-2xl font-black cursor-pointer border-none"><FaEdit /> Edit</button>
                    <button type="button" onClick={() => handleDelete(p._id)} disabled={deletingId === p._id} className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-2xl font-black disabled:opacity-60 cursor-pointer border-none"><FaTrash /> {deletingId === p._id ? "..." : "Delete"}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;