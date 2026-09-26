import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Package, 
  Sliders, 
  ShoppingBag, 
  AlertTriangle,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { TSHIRT_SIZES } from '../data/initialData';

export const ProductsTab = ({ 
  products, 
  onAddNewProduct, 
  onEditProduct, 
  onDeleteProduct, 
  onAdjustStock,
  onSellProduct,
  currency 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  const categories = ['All', 'Oversized', 'Graphic', 'Plain Classics', 'Textured', 'Streetwear'];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.color && p.color.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const fmt = (val) => `${currency}${Number(val || 0).toFixed(2)}`;

  return (
    <div className="space-y-6">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 m-0">
            T-Shirt Catalog & Size Inventory
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your apparel catalog, stock counts by size (XS to 3XL), costs, and profit margins.
          </p>
        </div>

        <button
          onClick={onAddNewProduct}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New T-Shirt</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by T-shirt name, SKU, or color..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 shadow-xs"
          />
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 m-0">No T-shirts Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search filter or add a new T-shirt design to get started.
          </p>
        </div>
      )}

      {/* Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const totalStock = Object.values(product.stock || {}).reduce((a, b) => a + Number(b || 0), 0);
          const profit = Number(product.sellingPrice) - Number(product.costPrice);
          const margin = product.sellingPrice > 0 ? (profit / product.sellingPrice) * 100 : 0;
          const hasLowStock = Object.values(product.stock || {}).some(
            (c) => Number(c) <= (product.lowStockThreshold || 5)
          );

          return (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden group"
            >
              {/* Image & Header */}
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs">
                    {product.category}
                  </span>
                  {product.color && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/90 text-slate-800 backdrop-blur-xs shadow-xs">
                      {product.color}
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3 flex items-center gap-1">
                  <button
                    onClick={() => onEditProduct(product)}
                    className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-700 shadow-xs backdrop-blur-xs transition-colors cursor-pointer"
                    title="Edit Product"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteProduct(product.id)}
                    className="p-1.5 rounded-lg bg-white/90 hover:bg-rose-50 hover:text-rose-600 text-slate-700 shadow-xs backdrop-blur-xs transition-colors cursor-pointer"
                    title="Delete Product"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {hasLowStock && (
                  <div className="absolute bottom-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Low Stock Alert</span>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1">
                    <span>{product.sku}</span>
                    <span className="text-slate-500 font-sans font-semibold">
                      Total: <strong className="text-slate-800">{totalStock} in stock</strong>
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 m-0 line-clamp-1">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                      {product.description}
                    </p>
                  )}
                </div>

                {/* Pricing / Margin */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Price / Cost</span>
                    <span className="font-bold text-slate-900">{fmt(product.sellingPrice)}</span>
                    <span className="text-slate-400 text-[10px] ml-1">({fmt(product.costPrice)})</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Net Profit</span>
                    <span className="font-extrabold text-emerald-600">+{fmt(profit)}</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded-full font-bold ml-1">
                      {margin.toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Sizes Stock Matrix */}
                <div>
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1.5">
                    <span>Sizes In Stock:</span>
                    <button
                      onClick={() => onAdjustStock(product)}
                      className="text-indigo-600 hover:text-indigo-800 text-[11px] font-bold cursor-pointer"
                    >
                      Update Stock
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {TSHIRT_SIZES.map((size) => {
                      const count = Number(product.stock?.[size]) || 0;
                      const isLow = count <= (product.lowStockThreshold || 5);
                      const isZero = count === 0;

                      return (
                        <div
                          key={size}
                          className={`text-center py-1 rounded-lg border text-[10px] transition-all ${
                            isZero
                              ? 'bg-rose-50 border-rose-200 text-rose-500 font-medium'
                              : isLow
                              ? 'bg-amber-50 border-amber-200 text-amber-800 font-bold'
                              : 'bg-slate-50 border-slate-200 text-slate-700 font-semibold'
                          }`}
                        >
                          <div className="text-[9px] text-slate-400 uppercase">{size}</div>
                          <div>{count}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => onAdjustStock(product)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5 text-slate-500" />
                    <span>Adjust Stock</span>
                  </button>
                  <button
                    onClick={() => onSellProduct(product)}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Sell T-Shirt</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
