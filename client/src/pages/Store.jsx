import React, { useState, useEffect } from "react";
import { 
  FaShoppingCart, FaFilter, FaStar, FaSearch, FaWrench, 
  FaSpinner, FaExclamationTriangle, FaCar, FaSprayCan, 
  FaCrown, FaTrash, FaPlus, FaMinus, FaTimes 
} from "react-icons/fa";
import { fetchProducts } from "../api/products";

// 📦 مصفوفة تحتوي على المنتجات والسيارات (تمت إضافة 5 سيارات جديدة ليصبح المجموع 7 سيارات)
const INITIAL_PRODUCTS = [
  // --- 🚗 صنف بيع السيارات (Vente Voitures) ---
  {
    _id: "car1",
    name: "Dacia Sandero Stepway - Pack Prestige",
    category: "Vente Voitures",
    subCategory: "WW",
    price: 155000,
    rating: 5,
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=500&auto=format&fit=crop&q=60",
    description: "Voiture Neuve (WW) 0 km, Essence, Boîte Manuelle, Écran tactile avec Caméra de recul."
  },
  {
    _id: "car2",
    name: "Volkswagen Golf 7 - R-Line",
    category: "Vente Voitures",
    subCategory: "Occasion",
    price: 195000,
    originalPrice: 210000,
    rating: 4,
    image: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=500&auto=format&fit=crop&q=60",
    description: "Modèle 2019, Diesel, 90 000 km, Boîte Automatique DSG, Excellent état, première main."
  },
  {
    _id: "car3",
    name: "Peugeot 208 - Pack Allure",
    category: "Vente Voitures",
    subCategory: "WW",
    price: 185000,
    rating: 5,
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500&auto=format&fit=crop&q=60",
    description: "Nouvelle Peugeot 208 Neuve (WW), Diesel, Design futuriste, Cockpit 3D, Économe en carburant."
  },
  {
    _id: "car4",
    name: "Renault Clio 5 - Intensive",
    category: "Vente Voitures",
    subCategory: "Occasion",
    price: 138000,
    originalPrice: 145000,
    rating: 4,
    image: "https://images.unsplash.com/photo-1617469767053-d3b508a0d825?w=500&auto=format&fit=crop&q=60",
    description: "Modèle 2021, Diesel, 65 000 km, très faible consommation, climatisation digitale, écran tactile."
  },
  {
    _id: "car5",
    name: "Audi A3 Sedan - S-Line",
    category: "Vente Voitures",
    subCategory: "WW",
    price: 390000,
    rating: 5,
    image: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=500&auto=format&fit=crop&q=60",
    description: "Berline Premium Neuve (WW), Boîte Automatique S-Tronic, Toit ouvrant panoramique, Phares Matrix LED."
  },
  {
    _id: "car6",
    name: "Ford Fiesta - Titanium",
    category: "Vente Voitures",
    subCategory: "Occasion",
    price: 98000,
    rating: 4,
    image: "https://images.unsplash.com/photo-1621259182978-f09e51224884?w=500&auto=format&fit=crop&q=60",
    description: "Modèle 2017, Essence, 110 000 km, Climatisation, Jantes aluminium, bien entretenue."
  },
  {
    _id: "car7",
    name: "Hyundai Tucson - Executive",
    category: "Vente Voitures",
    subCategory: "Occasion",
    price: 245000,
    originalPrice: 260000,
    rating: 5,
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500&auto=format&fit=crop&q=60",
    description: "SUV Puissant, Modèle 2020, Diesel, Boîte Automatique, Intérieur cuir, Sièges chauffants."
  },

  // --- 🧴 صنف مواد التنظيف (Nettoyage) ---
  {
    _id: "p1",
    name: "Shampoing Auto Haute Mousse 1L",
    category: "Nettoyage",
    price: 85,
    originalPrice: 120,
    rating: 5,
    image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=500&auto=format&fit=crop&q=60",
    description: "Nettoie en profondeur et donne une brillance éclatante à la carrosserie."
  },
  {
    _id: "p2",
    name: "Nettoyant Jantes Puissant Gel",
    category: "Nettoyage",
    price: 65,
    rating: 4,
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=500&auto=format&fit=crop&q=60",
    description: "Élimine rapidement la poussière de frein sur tout type de jantes."
  },

  // --- 🔧 صنف الزيوت، الماء، والعجلات (Entretien & Fluides) ---
  {
    _id: "p5",
    name: "Huile Moteur Synthétique 5W40 4L",
    category: "Entretien & Fluides",
    price: 380,
    originalPrice: 450,
    rating: 5,
    image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=500&auto=format&fit=crop&q=60",
    description: "Protection maximale du moteur contre l'usure et réduction de la consommation."
  }
];

const getCategoryIcon = (category) => {
  switch (category) {
    case "Tous": return <FaFilter className="text-xs" />;
    case "Vente Voitures": return <FaCar className="text-sm animate-pulse" />;
    case "Nettoyage": return <FaSprayCan className="text-xs" />;
    case "Entretien & Fluides": return <FaWrench className="text-xs" />;
    case "Accessoires": return <FaCrown className="text-xs" />;
    default: return <FaWrench className="text-xs" />;
  }
};

const Store = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [selectedSubCategory, setSelectedSubCategory] = useState("Tous");
  const [failedImages, setFailedImages] = useState(new Set());
  
  // 🛒 state الخاص بالسلة ونظام التفتيح
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchProducts();
        if (data && data.products && data.products.length > 0) {
          setProducts(data.products);
        } else {
          setProducts(INITIAL_PRODUCTS);
        }
      } catch (err) {
        setProducts(INITIAL_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const categories = ["Tous", "Vente Voitures", "Nettoyage", "Entretien & Fluides"];

  // ➕ دالة إضافة منتج أو سيارة للسلة
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);
      if (existingItem) {
        return prevCart.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true); // تفتح السلة تلقائياً عند إضافة أي شيء
  };

  // ➖ دالة التحكم في الكمية داخل السلة
  const updateQuantity = (id, amount) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item._id === id) {
            const newQty = item.quantity + amount;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  // 🗑️ حذف منتج نهائياً من السلة
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== id));
  };

  // 💰 حساب المجموع الكلي (Total)
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "Tous" || product.category === selectedCategory;
    const matchesSubCategory = 
      selectedCategory !== "Vente Voitures" || 
      selectedSubCategory === "Tous" || 
      product.subCategory === selectedSubCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSubCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans relative">
      
      {/* ستايل أنيميشن التوهج والإطار */}
      <style>{`
        @keyframes neonBorder {
          0%, 100% { border-color: rgba(6, 182, 212, 0.3); box-shadow: 0 0 5px rgba(6, 182, 212, 0.1); }
          50% { border-color: rgba(6, 182, 212, 1); box-shadow: 0 0 15px rgba(6, 182, 212, 0.5); }
        }
        .animate-neon { animation: neonBorder 2s infinite ease-in-out; }
      `}</style>

      {/* 1. Header & Search Bar & Cart Trigger */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Boutique <span className="text-cyan-500">AutoClick</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Trouvez rapidement tout ce dont votre voiture a besoin.</p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white transition-all text-sm"
            />
            <FaSearch className="absolute left-3.5 top-3.5 text-gray-400 text-sm" />
          </div>

          {/* زر السلة العائم في الهيدر */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative bg-cyan-500 text-white p-3 rounded-full hover:bg-cyan-600 transition-all border-none cursor-pointer shadow-md flex items-center justify-center"
          >
            <FaShoppingCart className="text-lg" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-black rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <FaSpinner className="text-cyan-500 text-4xl animate-spin mb-4" />
          <p className="text-gray-500 font-semibold">Chargement de la boutique...</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* 2. Sidebar Filters */}
          <div className="w-full lg:w-72 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-fit space-y-6">
            <div>
              <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-4 border-b pb-2 text-sm uppercase tracking-wider">
                <FaFilter className="text-cyan-500 text-xs" /> Catégories
              </h3>
              <ul className="space-y-2">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <li key={cat}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat);
                          setSelectedSubCategory("Tous");
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-3 cursor-pointer border-2 ${
                          isSelected
                            ? "bg-cyan-500 text-white font-semibold border-cyan-500 animate-neon"
                            : "text-gray-600 border-transparent hover:bg-gray-50 hover:text-cyan-500"
                        }`}
                      >
                        {getCategoryIcon(cat)}
                        <span>{cat === "Tous" ? "Tous les produits" : cat}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {selectedCategory === "Vente Voitures" && (
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-xs font-black text-cyan-600 uppercase tracking-wider mb-3">
                  État de la voiture
                </h4>
                <div className="flex flex-col gap-2">
                  {["Tous", "WW", "Occasion"].map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setSelectedSubCategory(sub)}
                      className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all border-none cursor-pointer text-left ${
                        selectedSubCategory === sub
                          ? "bg-gray-900 text-white shadow"
                          : "bg-gray-50 text-gray-600 hover:bg-cyan-50 hover:text-cyan-600"
                      }`}
                    >
                      {sub === "Tous" ? "🚗 Toutes les voitures" : sub === "WW" ? "✨ Neuve (WW)" : "🔑 Occasion (مستعملة)"}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. Products Grid */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
                  const isCar = product.category === "Vente Voitures";

                  return (
                    <div
                      key={product._id}
                      className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                    >
                      <div className="relative pt-[75%] bg-gray-50 overflow-hidden">
                        {!failedImages.has(product._id) && product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            onError={() => setFailedImages(prev => new Set(prev).add(product._id))}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                            <FaShoppingCart className="text-5xl" />
                          </div>
                        )}
                        <div className="absolute top-4 inset-x-4 flex justify-between items-center">
                          <span className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-bold shadow-sm text-white ${isCar ? 'bg-amber-500' : 'bg-[#111827]'}`}>
                            {isCar ? `Voiture | ${product.subCategory}` : product.category}
                          </span>
                        </div>
                      </div>

                      <div className="p-6 flex flex-col flex-1 justify-between">
                        <div>
                          <div className="flex items-center gap-0.5 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className={`text-xs ${i < product.rating ? "text-amber-400" : "text-gray-200"}`} />
                            ))}
                          </div>
                          <h4 className="font-bold text-gray-800 text-sm md:text-base mb-2 group-hover:text-cyan-500 transition-colors line-clamp-2 min-h-[3rem]">
                            {product.name}
                          </h4>
                          <p className="text-xs text-gray-400 mb-3 line-clamp-2">{product.description}</p>

                          <div className="flex items-baseline gap-3 mb-4">
                            <span className="text-2xl font-extrabold text-cyan-500">
                              {product.price.toLocaleString()} <span className="text-xs font-bold">DH</span>
                            </span>
                          </div>
                        </div>

                        {/* زر الإضافة إلى السلة / الحجز */}
                        <button 
                          onClick={() => addToCart(product)}
                          className={`w-full text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 border-none cursor-pointer transition-all duration-200 shadow-sm ${isCar ? 'bg-amber-500 hover:bg-amber-600' : 'bg-[#111827] hover:bg-cyan-500'}`}
                        >
                          <FaShoppingCart className="text-xs" /> 
                          {isCar ? "Réserver la voiture" : "Ajouter au panier"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
                <p className="text-gray-400 font-semibold text-lg">Aucun résultat trouvé.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 🛒 4. السلة الجانبية الاحترافية (Cart Drawer Component) */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end backdrop-blur-sm transition-opacity">
          <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 flex flex-col justify-between animate-slide-in">
            
            {/* رأس السلة */}
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <FaShoppingCart className="text-cyan-500" /> Mon Panier ({cartCount})
              </h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer text-xl"
              >
                <FaTimes />
              </button>
            </div>

            {/* عناصر السلة */}
            <div className="flex-1 overflow-y-auto my-4 space-y-4 pr-1">
              {cart.length > 0 ? (
                cart.map((item) => (
                  <div key={item._id} className="flex gap-4 bg-gray-50 p-3 rounded-2xl border border-gray-100 items-center justify-between">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-gray-800 truncate">{item.name}</h4>
                      <p className="text-xs font-black text-cyan-600 mt-1">{item.price.toLocaleString()} DH</p>
                      
                      {/* أزرار التحكم في الكمية */}
                      <div className="flex items-center gap-3 mt-2 bg-white w-fit px-2 py-1 rounded-lg border border-gray-200">
                        <button onClick={() => updateQuantity(item._id, -1)} className="text-gray-500 hover:text-cyan-500 bg-transparent border-none cursor-pointer text-xs">
                          <FaMinus />
                        </button>
                        <span className="text-xs font-bold text-gray-800">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, 1)} className="text-gray-500 hover:text-cyan-500 bg-transparent border-none cursor-pointer text-xs">
                          <FaPlus />
                        </button>
                      </div>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-400 hover:text-red-600 bg-transparent border-none cursor-pointer p-2"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 text-gray-400">
                  <p className="font-semibold">Votre panier est vide.</p>
                </div>
              )}
            </div>

            {/* حساب المجموع وزر الدفع */}
            {cart.length > 0 && (
              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-500 text-sm">Sous-total :</span>
                  <span className="text-2xl font-black text-cyan-500">{cartTotal.toLocaleString()} <span className="text-xs">DH</span></span>
                </div>
                <button className="w-full bg-cyan-500 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-cyan-600 transition-all border-none cursor-pointer shadow-lg shadow-cyan-100">
                  Passer la commande
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default Store;