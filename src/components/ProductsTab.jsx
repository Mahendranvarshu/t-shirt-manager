import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Sliders, 
  ShoppingBag, 
  AlertTriangle,
  Edit2,
  Trash2
} from 'lucide-react';
import { TSHIRT_SIZES } from '../data/initialData';

export const ProductsTab = ({ 
  products, 
  onAddNewProduct, 
  onEditProduct, 
  onDeleteProduct, 
  onAdjustStock, 
  onSellProduct 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');

  const categories = ['All', 'Oversized', 'Graphic', 'Plain Classics', 'Streetwear', 'Textured'];

  const filtered = products.filter((p) => {
    const term = searchTerm.toLowerCase();
    const matchSearch = p.name.toLowerCase().includes(term) || p.sku.toLowerCase().includes(term);
    const matchCat = selectedCat === 'All' || p.category === selectedCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-3 pb-24 max-w-lg mx-auto">
      
      {/* Mobile Top Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search T-shirts or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none shadow-xs font-medium"
          />
        </div>

        <button
          onClick={onAddNewProduct}
          className="px-3 py-2 bg-indigo-600 active:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Tee</span>
        </button>
      </div>

      {/* Horizontal Category Scroll */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-3 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCat === cat
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Mobile T-Shirt Product Cards */}
      <div className="space-y-3">
        {filtered.map((prod) => {
          const totalStock = Object.values(prod.stock || {}).reduce((a, b) => a + Number(b || 0), 0);
          const profit = prod.sellingPrice - prod.costPrice;
          const hasLowStock = Object.values(prod.stock || {}).some((c) => Number(c) <= 5);

          return (
            <div 
              key={prod.id} 
              className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs space-y-3"
            >
              {/* Product Header Row */}
              <div className="flex gap-3 items-center">
                <img 
                  src={prod.image} 
                  alt={prod.name} 
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0" 
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 font-mono">{prod.sku}</span>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => onEditProduct(prod)}
                        className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => onDeleteProduct(prod.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-extrabold text-xs text-slate-900 truncate m-0">{prod.name}</h3>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-black text-slate-900">₹{prod.sellingPrice}</span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                      +₹{profit} profit
                    </span>
                    <span className="text-[10px] text-slate-400 ml-auto font-bold">
                      {totalStock} in stock
                    </span>
                  </div>
                </div>
              </div>

              {/* Size Matrix (XS to 3XL) */}
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/70">
                <div className="grid grid-cols-7 gap-1">
                  {TSHIRT_SIZES.map((size) => {
                    const count = prod.stock?.[size] || 0;
                    const isZero = count === 0;
                    const isLow = count <= 5;

                    return (
                      <div 
                        key={size}
                        className={`text-center py-1 rounded-lg border text-[10px] ${
                          isZero 
                            ? 'bg-rose-50 border-rose-200 text-rose-500 font-bold'
                            : isLow 
                            ? 'bg-amber-50 border-amber-200 text-amber-800 font-extrabold'
                            : 'bg-white border-slate-200 text-slate-800 font-bold'
                        }`}
                      >
                        <div className="text-[9px] text-slate-400">{size}</div>
                        <div>{count}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onAdjustStock(prod)}
                  className="flex-1 py-2 px-3 bg-slate-100 active:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-slate-500" />
                  <span>Update Stock</span>
                </button>

                <button
                  onClick={() => onSellProduct(prod)}
                  className="flex-1 py-2 px-3 bg-emerald-600 active:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Sell Tee</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
