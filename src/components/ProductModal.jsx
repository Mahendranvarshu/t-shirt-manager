import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, DollarSign, Tag, Check, Sparkles } from 'lucide-react';
import { TSHIRT_SIZES, PRESET_MOCKUPS } from '../data/initialData';

export const ProductModal = ({ isOpen, onClose, onSave, editingProduct, currency }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: 'Oversized',
    color: 'Classic Black',
    sku: '',
    image: PRESET_MOCKUPS[0].url,
    description: '',
    costPrice: 8.00,
    sellingPrice: 25.00,
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
        color: 'Classic Black',
        sku: randomSku,
        image: PRESET_MOCKUPS[0].url,
        description: '',
        costPrice: 8.00,
        sellingPrice: 25.00,
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
  const profitPerTee = price - cost;
  const marginPct = price > 0 ? (profitPerTee / price) * 100 : 0;
  const totalStock = Object.values(formData.stock).reduce((a, b) => a + Number(b || 0), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter a T-shirt product name');
      return;
    }

    const payload = {
      ...formData,
      id: formData.id || `TEE-${Date.now().toString().slice(-4)}`,
      costPrice: Number(formData.costPrice) || 0,
      sellingPrice: Number(formData.sellingPrice) || 0,
      createdAt: editingProduct ? editingProduct.createdAt : new Date().toISOString()
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8 overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-900 text-base m-0">
              {editingProduct ? 'Edit T-Shirt Details' : 'Add New T-Shirt Design'}
            </h3>
            <p className="text-xs text-slate-500">Configure product specifications, pricing, and size inventory</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Basic Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                T-Shirt Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Heavyweight Acid Wash Oversized Tee"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                SKU / Code
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="e.g. TEE-OVR-01"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
              >
                <option value="Oversized">Oversized</option>
                <option value="Graphic">Graphic</option>
                <option value="Plain Classics">Plain Classics</option>
                <option value="Textured / Knit">Textured / Knit</option>
                <option value="Streetwear">Streetwear</option>
                <option value="Polo">Polo</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Color Name
              </label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="e.g. Washed Charcoal, Olive Green"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Image Selection & Preview */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Product Image (Paste URL or choose a preset mockup below)
            </label>
            <div className="flex gap-3 items-center">
              <img 
                src={formData.image || 'https://via.placeholder.com/150'} 
                alt="Preview" 
                className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-sm shrink-0" 
              />
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/tshirt.jpg"
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
              />
            </div>

            {/* Quick Presets */}
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                Quick Preset T-Shirt Mockups:
              </span>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {PRESET_MOCKUPS.map((mockup) => (
                  <button
                    key={mockup.name}
                    type="button"
                    onClick={() => setFormData({ ...formData, image: mockup.url })}
                    className={`flex items-center gap-1.5 p-1 rounded-lg border text-left shrink-0 cursor-pointer transition-all ${
                      formData.image === mockup.url 
                        ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500' 
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <img src={mockup.url} alt={mockup.name} className="w-8 h-8 rounded object-cover" />
                    <span className="text-[10px] font-medium text-slate-700 pr-1">{mockup.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing & Profit Calculation Card */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 m-0">
              Cost, Selling Price & Profit Margin
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cost Price ({currency}) <span className="font-normal text-slate-500">(Purchase/Production)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 text-sm font-bold">{currency}</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                    className="w-full pl-7 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:border-indigo-500 outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Selling Price ({currency}) <span className="font-normal text-slate-500">(Retail)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 text-sm font-bold">{currency}</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                    className="w-full pl-7 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:border-indigo-500 outline-none font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Profit Margin Badge */}
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 text-xs">
              <span className="font-medium">Profit per T-Shirt:</span>
              <div className="flex items-center gap-3">
                <span className="font-black text-sm text-emerald-700">
                  +{currency}{profitPerTee.toFixed(2)}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-[11px]">
                  {marginPct.toFixed(1)}% Margin
                </span>
              </div>
            </div>
          </div>

          {/* Size Inventory Matrix */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 m-0">
                  Initial Stock Count per Size
                </h4>
                <p className="text-[11px] text-slate-500">Specify inventory for each T-shirt size</p>
              </div>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
                Total: {totalStock} units
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {TSHIRT_SIZES.map((size) => (
                <div key={size} className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-center">
                  <label className="block text-xs font-extrabold text-slate-800 mb-1">
                    {size}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock[size] || 0}
                    onChange={(e) => handleSizeStockChange(size, e.target.value)}
                    className="w-full text-center py-1 text-xs font-bold bg-white border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Description / Fabric & Fit Notes
            </label>
            <textarea
              rows="2"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. 240 GSM combed cotton, pre-shrunk, drop-shoulder cut..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
            />
          </div>

          {/* Footer Save Button */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{editingProduct ? 'Save Product Changes' : 'Create T-Shirt Product'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
