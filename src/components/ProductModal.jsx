import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { TSHIRT_SIZES, PRESET_MOCKUPS } from '../data/initialData';

export const ProductModal = ({ isOpen, onClose, onSave, editingProduct }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: 'Oversized',
    color: 'Black',
    sku: '',
    image: PRESET_MOCKUPS[0].url,
    costPrice: 250,
    sellingPrice: 799,
    lowStockThreshold: 5,
    stock: {
      XS: 10,
      S: 15,
      M: 25,
      L: 25,
      XL: 15,
      '2XL': 8,
      '3XL': 4,
    }
  });

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        ...editingProduct,
        stock: { ...editingProduct.stock }
      });
    } else {
      const randomSku = `TEE-${Math.floor(100 + Math.random() * 900)}`;
      setFormData({
        id: randomSku,
        name: '',
        category: 'Oversized',
        color: 'Black',
        sku: randomSku,
        image: PRESET_MOCKUPS[0].url,
        costPrice: 250,
        sellingPrice: 799,
        lowStockThreshold: 5,
        stock: {
          XS: 10,
          S: 15,
          M: 25,
          L: 25,
          XL: 15,
          '2XL': 8,
          '3XL': 4,
        }
      });
    }
  }, [editingProduct]);

  const handleSizeStockChange = (size, val) => {
    const num = parseInt(val, 10);
    setFormData((prev) => ({
      ...prev,
      stock: {
        ...prev.stock,
        [size]: isNaN(num) ? 0 : Math.max(0, num)
      }
    }));
  };

  const cost = Number(formData.costPrice) || 0;
  const price = Number(formData.sellingPrice) || 0;
  const profit = price - cost;
  const totalStock = Object.values(formData.stock).reduce((a, b) => a + Number(b || 0), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onSave({
      ...formData,
      id: formData.id || `TEE-${Date.now().toString().slice(-4)}`,
      costPrice: Number(formData.costPrice) || 0,
      sellingPrice: Number(formData.sellingPrice) || 0,
      createdAt: editingProduct ? editingProduct.createdAt : new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between">
          <span className="font-extrabold text-sm text-white">
            {editingProduct ? 'Edit T-Shirt' : 'New T-Shirt'}
          </span>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 overflow-y-auto flex-1">
          
          {/* Name & SKU */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">T-Shirt Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Acid Wash Oversized Tee"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-2 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none font-semibold"
              >
                <option value="Oversized">Oversized</option>
                <option value="Graphic">Graphic</option>
                <option value="Plain Classics">Plain Classics</option>
                <option value="Streetwear">Streetwear</option>
                <option value="Textured">Textured</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">SKU</label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none font-mono"
              />
            </div>
          </div>

          {/* Preset Image Mockups (1-tap select) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">T-Shirt Mockup Image</label>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {PRESET_MOCKUPS.map((m) => (
                <button
                  key={m.name}
                  type="button"
                  onClick={() => setFormData({ ...formData, image: m.url })}
                  className={`shrink-0 rounded-xl border-2 p-0.5 overflow-hidden transition-all ${
                    formData.image === m.url ? 'border-indigo-600 scale-105' : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={m.url} alt={m.name} className="w-12 h-12 rounded-lg object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Pricing (INR ₹) */}
          <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Cost Price (₹)</label>
              <input
                type="number"
                min="0"
                required
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl font-black text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Selling Price (₹)</label>
              <input
                type="number"
                min="0"
                required
                value={formData.sellingPrice}
                onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl font-black text-emerald-600 outline-none"
              />
            </div>

            <div className="col-span-2 flex justify-between text-xs font-black pt-1 border-t border-slate-200">
              <span className="text-slate-600">Net Profit per Tee:</span>
              <span className="text-emerald-700">+₹{profit}</span>
            </div>
          </div>

          {/* Initial Stock per Size */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-bold text-slate-600">Stock per Size</label>
              <span className="text-[10px] font-bold text-indigo-700">{totalStock} total</span>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {TSHIRT_SIZES.map((size) => (
                <div key={size} className="text-center bg-slate-50 border border-slate-200 rounded-xl p-1">
                  <span className="text-[10px] font-black text-slate-700 block">{size}</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock[size] || 0}
                    onChange={(e) => handleSizeStockChange(size, e.target.value)}
                    className="w-full text-center text-xs font-black bg-white border border-slate-300 rounded-lg py-0.5 outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 active:bg-indigo-700 text-white rounded-xl font-black text-xs shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5 cursor-pointer mt-2"
          >
            <Check className="w-4 h-4" />
            <span>{editingProduct ? 'Save Changes' : 'Create T-Shirt'}</span>
          </button>

        </form>

      </div>
    </div>
  );
};
