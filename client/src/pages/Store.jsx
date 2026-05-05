import React, { useState } from 'react';
import { FaShoppingCart, FaFilter, FaStar, FaSearch } from 'react-icons/fa';

const Store = () => {
  // بيانات تجريبية للإكسسوارات والقطع
  const products = [
    { id: 1, name: 'Essuie-glaces Bosch', price: '120 DH', category: 'Accessoires', rating: 5, image: 'https://via.placeholder.com/200' },
    { id: 2, name: 'Huile Moteur 5W30', price: '450 DH', category: 'Entretien', rating: 4, image: 'https://via.placeholder.com/200' },
    { id: 3, name: 'Tapis de sol Premium', price: '300 DH', category: 'Intérieur', rating: 5, image: 'https://via.placeholder.com/200' },
    { id: 4, name: 'Ampoules LED H7', price: '250 DH', category: 'Éclairage', rating: 4, image: 'https://via.placeholder.com/200' },
    { id: 5, name: 'Support Téléphone', price: '80 DH', category: 'Accessoires', rating: 3, image: 'https://via.placeholder.com/200' },
    { id: 6, name: 'Batterie 70Ah', price: '850 DH', category: 'Pièces', rating: 5, image: 'https://via.placeholder.com/200' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900">Boutique <span className="text-[#00adef]">AutoClick</span></h1>
            <p className="text-gray-500 font-medium">Tout pour votre voiture, livré chez vous.</p>
          </div>
          
          <div className="relative w-full md:w-96">
            <input 
              type="text" 
              placeholder="Rechercher un accessoire..." 
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-none shadow-lg focus:ring-2 focus:ring-[#00adef] font-bold"
            />
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 space-y-6">
            <div className="bg-white p-6 rounded-[2rem] shadow-xl">
              <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
                <FaFilter className="text-[#00adef]" /> Catégories
              </h3>
              <ul className="space-y-3 list-none p-0">
                {['Tous', 'Accessoires', 'Entretien', 'Pièces', 'Éclairage'].map(cat => (
                  <li key={cat} className="text-gray-600 font-bold hover:text-[#00adef] cursor-pointer transition-colors">
                    {cat}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all group border border-gray-100">
                <div className="h-56 bg-gray-200 relative">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <span className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-xs font-black text-[#00adef] shadow-sm">
                    {product.category}
                  </span>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-black text-gray-900">{product.name}</h3>
                    <div className="flex text-yellow-400 text-sm">
                      {[...Array(product.rating)].map((_, i) => <FaStar key={i} />)}
                    </div>
                  </div>
                  
                  <p className="text-2xl font-black text-[#00adef] mb-6">{product.price}</p>
                  
                  <button className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-[#00adef] transition-all border-none cursor-pointer">
                    <FaShoppingCart /> Ajouter au panier
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Store;