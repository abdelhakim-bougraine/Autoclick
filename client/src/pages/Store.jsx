import { useState, useEffect } from "react";
import { FaShoppingCart, FaFilter, FaStar, FaSearch, FaWrench, FaSpinner, FaExclamationTriangle } from "react-icons/fa";
import { fetchProducts } from "../api/products";

const Store = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchProducts();
        setProducts(data.products || []);
      } catch (err) {
        setError(`Endpoint requis: GET /api/products — ${err.message}`);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const categories = ["Tous", ...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "Tous" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Boutique <span className="text-cyan-500">AutoClick</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">Trouvez rapidement tout ce dont votre voiture a besoin.</p>
        </div>

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

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <FaSpinner className="text-cyan-500 text-4xl animate-spin mb-4" />
          <p className="text-gray-500 font-semibold">Chargement des produits...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-red-200 shadow-sm">
          <FaExclamationTriangle className="text-red-400 text-4xl mb-4" />
          <p className="text-red-500 font-semibold text-sm max-w-md text-center">{error}</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
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
                    <span>{cat === "Tous" ? "Tous les produits" : cat}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
                  const discount = hasDiscount
                    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                    : 0;

                  return (
                    <div
                      key={product._id}
                      className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                    >
                      <div className="relative pt-[75%] bg-gray-50 overflow-hidden">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                            <FaShoppingCart className="text-5xl" />
                          </div>
                        )}
                        <div className="absolute top-4 inset-x-4 flex justify-between items-center">
                          <span className="bg-[#111827] text-white text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-bold shadow-sm">
                            {product.category}
                          </span>
                          {hasDiscount && (
                            <span className="bg-red-500 text-white text-xs px-2.5 py-0.5 rounded-md font-bold shadow-sm">
                              -{discount}%
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-6 flex flex-col flex-1 justify-between">
                        <div>
                          <div className="flex items-center gap-0.5 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={`text-xs ${i < (product.rating || 0) ? "text-amber-400" : "text-gray-200"}`}
                              />
                            ))}
                          </div>
                          <h4 className="font-bold text-gray-800 text-sm md:text-base mb-2 group-hover:text-cyan-500 transition-colors line-clamp-2 min-h-[3rem]">
                            {product.name}
                          </h4>
                          {product.description && (
                            <p className="text-xs text-gray-400 mb-3 line-clamp-2">{product.description}</p>
                          )}

                          <div className="flex items-baseline gap-3 mb-4">
                            <span className="text-2xl font-extrabold text-cyan-500">
                              {product.price} <span className="text-xs font-bold">DH</span>
                            </span>
                            {hasDiscount && (
                              <span className="text-sm font-semibold text-gray-400 line-through">
                                {product.originalPrice} DH
                              </span>
                            )}
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
      )}
    </div>
  );
};

export default Store;
