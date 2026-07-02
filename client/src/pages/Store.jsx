import React, { useState } from "react";
import { FaShoppingCart, FaFilter, FaStar, FaSearch, FaWrench } from "react-icons/fa";

const Store = () => {
  // قاعدة البيانات الصحيحة والكاملة والجاهزة للتعديل
  const products = [
    // ==========================================
    // 1. منتجات التنظيف واللمعان (5 منتجات)
    // ==========================================
    {
      id: 1,
      name: "Golden Smart - Brillant Pneus (Original)", /* 🔴 هنا حط سمية المنتج */
      price: 65,
      originalPrice: 95,
      category: "Nettoyage",
      rating: 5,
      image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&auto=format&fit=crop&q=60", /* 🔴 هنا حط رابط الصورة */
    },
    {
      id: 2,
      name: "Shampooing MEGUIAR'S Gold Class (1L)", /* 🔴 هنا حط سمية المنتج */
      price: 160,
      originalPrice: 220,
      category: "Nettoyage",
      rating: 5,
      image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=400&auto=format&fit=crop&q=60", /* 🔴 هنا حط رابط الصورة */
    },
    {
      id: 3,
      name: "Nettoyant Vitres Anti-Traces SONAX Spray", /* 🔴 هنا حط سمية المنتج */
      price: 55,
      originalPrice: 80,
      category: "Nettoyage",
      rating: 4,
      image: "https://images.unsplash.com/photo-1611245450450-482f7d98305c?w=400&auto=format&fit=crop&q=60", /* 🔴 هنا حط رابط الصورة */
    },
    {
      id: 4,
      name: "Mousse Nettoyante pour Sièges Auto", /* 🔴 هنا حط سمية المنتج */
      price: 75,
      originalPrice: 110,
      category: "Nettoyage",
      rating: 4,
      image: "https://images.unsplash.com/photo-1601362840469-51e4d8d59085?w=400&auto=format&fit=crop&q=60", /* 🔴 هنا حط رابط الصورة */
    },
    {
      id: 5,
      name: "Chiffons Microfibres de Haute Qualité (Pack de 3)", /* 🔴 هنا حط سمية المنتج */
      price: 35,
      originalPrice: 50,
      category: "Nettoyage",
      rating: 5,
      image: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=400&auto=format&fit=crop&q=60", /* 🔴 هنا حط رابط الصورة */
    },

    // ==========================================
    // 2. منتجات العناية بالمحرك والزيوت (6 منتجات)
    // ==========================================
    {
      id: 6,
      name: "Huile Moteur TOTAL Quartz Ineo 5W30 (5L)", /* 🔴 هنا حط سمية المنتج */
      price: 450,
      originalPrice: 580,
      category: "Moteur",
      rating: 5,
      image: "https://images.unsplash.com/photo-1621245366472-a16dfcfdbd66?w=400&auto=format&fit=crop&q=60", /* 🔴 هنا حط رابط الصورة */
    },
    {
      id: 7,
      name: "Huile Moteur CASTROL Edge 5W40 (4L)", /* 🔴 هنا حط سمية المنتج */
      price: 380,
      originalPrice: 490,
      category: "Moteur",
      rating: 5,
      image: "https://images.unsplash.com/photo-1552656967-7a0991a13906?w=400&auto=format&fit=crop&q=60", /* 🔴 هنا حط رابط الصورة */
    },
    {
      id: 8,
      name: "Liquide de Refroidissement G12/G13 Antigel", /* 🔴 هنا حط سمية المنتج */
      price: 90,
      originalPrice: 130,
      category: "Moteur",
      rating: 4,
      image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=400&auto=format&fit=crop&q=60", /* 🔴 هنا حط رابط الصورة */
    },
    {
      id: 9,
      name: "Nettoyant Injecteurs DIESEL Bardahl (300ml)", /* 🔴 هنا حط سمية المنتج */
      price: 120,
      originalPrice: 160,
      category: "Moteur",
      rating: 5,
      image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=400&auto=format&fit=crop&q=60", /* 🔴 هنا حط رابط الصورة */
    },
    {
      id: 10,
      name: "Additif Huile Stop Fuite Moteur Liqui Moly", /* 🔴 هنا حط سمية المنتج */
      price: 135,
      originalPrice: 180,
      category: "Moteur",
      rating: 4,
      image: "https://images.unsplash.com/photo-1552656967-7a0991a13906?w=400&auto=format&fit=crop&q=60", /* 🔴 هنا حط رابط الصورة */
    },
    {
      id: 11,
      name: "Nettoyant Circuit de Climatisation Auto", /* 🔴 هنا حط سمية المنتج */
      price: 60,
      originalPrice: 90,
      category: "Moteur",
      rating: 4,
      image: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=400&auto=format&fit=crop&q=60", /* 🔴 هنا حط رابط الصورة */
    },

    // ==========================================
    // 3. الإكسسوارات والمستلزمات (العجلات والمساحات...)
    // ==========================================
    {
      id: 12,
      name: "Pneu MICHELIN Primacy 4 - 205/55 R16 (Rwayd)", /* 🔴 هنا حط سمية المنتج */
      price: 920,
      originalPrice: 1150,
      category: "Accessoires",
      rating: 5,
      image: "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=400&auto=format&fit=crop&q=60", /* 🔴 هنا حط رابط الصورة */
    },
    {
      id: 13,
      name: "Balais d'Essuie-Glace Avant VALEO Silence (La Paire)", /* 🔴 هنا حط سمية المنتج */
      price: 150,
      originalPrice: 220,
      category: "Accessoires",
      rating: 4,
      image: "https://images.unsplash.com/photo-1606577924006-27d39b132c29?w=400&auto=format&fit=crop&q=60", /* 🔴 هنا حط رابط الصورة */
    },
    {
      id: 14,
      name: "Balai d'Essuie-Glace Arrière Universel BOSCH", /* 🔴 هنا حط سمية المنتج */
      price: 70,
      originalPrice: 100,
      category: "Accessoires",
      rating: 4,
      image: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&auto=format&fit=crop&q=60", /* 🔴 هنا حط رابط الصورة */
    },
    {
      id: 15,
      name: "Support Téléphone Magnétique Baseus pour Voiture", /* 🔴 هنا حط سمية المنتج */
      price: 85,
      originalPrice: 120,
      category: "Accessoires",
      rating: 5,
      image: "https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400&auto=format&fit=crop&q=60", /* 🔴 هنا حط رابط الصورة */
    }
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  const categories = ["Tous", "Nettoyage", "Moteur", "Accessoires"];

  // تصفية المنتجات بشكل صحيح بناء على الفئة والبحث
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "Tous" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans">
      {/* هيدر الصفحة والبحث */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Boutique <span className="text-cyan-500">AutoClick</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Trouvez rapidement tout ce dont votre voiture a besoin.</p>
        </div>

        {/* حقل البحث الحّي */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white transition-all text-sm"
          />
          <FaSearch className="absolute left-3.5 top-3.5 text-gray-400 text-sm" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* الفلتر الجانبي المنظم مع الأيقونات الشغالة */}
        <div className="w-full lg:w-72 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-fit">
          <h3 className="flex items-center gap-2 font-bold text-gray-900 mb-4 border-b pb-2 text-sm uppercase tracking-wider">
            <FaFilter className="text-cyan-500 text-xs" /> Catégories
          </h3>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    selectedCategory === cat
                      ? "bg-cyan-500 text-white shadow-lg shadow-cyan-100 font-semibold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-cyan-500"
                  }`}
                >
                  <FaWrench className="text-xs" />
                  <span>
                    {cat === "Tous" && "Tous les produits"}
                    {cat === "Nettoyage" && "✨ Nettoyants & Shampooing"}
                    {cat === "Moteur" && "🛢️ Entretien Moteur & Huiles"}
                    {cat === "Accessoires" && "🛠️ Accessoires & Équipements"}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* شبكة عرض المنتجات */}
        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
                
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                  >
                    {/* صورة المنتج */}
                    <div className="relative pt-[75%] bg-gray-50 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 inset-x-4 flex justify-between items-center">
                        <span className="bg-[#111827] text-white text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-bold shadow-sm">
                          {product.category}
                        </span>
                        <span className="bg-red-500 text-white text-xs px-2.5 py-0.5 rounded-md font-bold shadow-sm">
                          -{discount}%
                        </span>
                      </div>
                    </div>

                    {/* تفاصيل المنتج والأسعار */}
                    <div className="p-6 flex flex-col flex-1 justify-between">
                      <div>
                        <div className="flex items-center gap-0.5 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`text-xs ${i < product.rating ? "text-amber-400" : "text-gray-200"}`}
                            />
                          ))}
                        </div>
                        <h4 className="font-bold text-gray-800 text-sm md:text-base mb-2 group-hover:text-cyan-500 transition-colors line-clamp-2 min-h-[3rem]">
                          {product.name}
                        </h4>
                        
                        <div className="flex items-baseline gap-3 mb-4">
                          <span className="text-2xl font-extrabold text-cyan-500">
                            {product.price} <span className="text-xs font-bold">DH</span>
                          </span>
                          <span className="text-sm font-semibold text-gray-400 line-through">
                            {product.originalPrice} DH
                          </span>
                        </div>
                      </div>

                      <button className="w-full bg-[#111827] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-cyan-500 transition-all duration-200 shadow-sm">
                        <FaShoppingCart className="text-xs" /> Ajouter au panier
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
              <p className="text-gray-400 font-semibold text-lg">Aucun produit trouvé.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Store;