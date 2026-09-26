import React, { useState } from 'react';
import { X, Plus, Minus, AlertCircle, Check, PackagePlus } from 'lucide-react';
import { TSHIRT_SIZES } from '../data/initialData';

export const StockAdjustModal = ({ product, isOpen, onClose, onSaveStock, currency }) => {
  if (!isOpen || !product) return null;

  const [stock, setStock] = useState({ ...product.stock });
  const [bulkAmount, setBulkAmount] = useState(5);

  const handleIncrement = (size, amount = 1) => {
    setStock((prev) => ({
      ...prev,
      [size]: Math.max(0, (Number(prev[size]) || 0) + amount),
    }));
  };

  const handleDecrement = (size, amount = 1) => {
    setStock((prev) => ({
      ...prev,
      [size]: Math.max(0, (Number(prev[size]) || 0) - amount),
    }));
  };

  const handleDirectChange = (size, value) => {
    const val = parseInt(value, 10);
    setStock((prev) => ({
      ...prev,
      [size]: isNaN(val) ? 0 : Math.max(0, val),
    }));
  };

  const handleBulkAdd = () => {
    setStock((prev) => {
      const updated = { ...prev };
      TSHIRT_SIZES.forEach((s) => {
        updated[s] = (Number(updated[s]) || 0) + Number(bulkAmount);
      });
      return updated;
    });
  };

  const handleSave = () => {
    onSaveStock(product.id, stock);
    onClose();
  };

  const totalUnits = Object.values(stock).reduce((a, b) => a + Number(b || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-10 h-10 rounded-lg object-cover border border-slate-200" 
            />
            <div>
              <h3 className="font-bold text-slate-900 text-sm m-0 line-clamp-1">{product.name}</h3>
              <p className="text-xs text-slate-500">Update Stock Inventory per Size</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Quick Bulk Restock Tool */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <PackagePlus className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-semibold text-indigo-950">Quick Restock All Sizes:</span>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="number" 
                min="1" 
                value={bulkAmount}
                onChange={(e) => setBulkAmount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-14 px-2 py-1 text-xs font-bold text-center bg-white border border-indigo-200 rounded-lg outline-none"
              />
              <button
                type="button"
                onClick={handleBulkAdd}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer"
              >
                +{bulkAmount} to All
              </button>
            </div>
          </div>

          {/* Size Breakdown List */}
          <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
            {TSHIRT_SIZES.map((size) => {
              const count = Number(stock[size]) || 0;
              const isLow = count <= (product.lowStockThreshold || 5);

              return (
                <div 
                  key={size}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    isLow ? 'bg-amber-50/50 border-amber-200' : 'bg-slate-50 border-slate-200/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg bg-white font-black text-slate-800 text-sm flex items-center justify-center border border-slate-200 shadow-xs">
                      {size}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-slate-800">Size {size}</span>
                      {isLow && (
                        <span className="text-[10px] text-amber-700 font-semibold block flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-amber-600 inline" /> Low Stock
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDecrement(size, 1)}
                      className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-600 hover:bg-slate-100 flex items-center justify-center active:scale-95 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input 
                      type="number"
                      min="0"
                      value={count}
                      onChange={(e) => handleDirectChange(size, e.target.value)}
                      className="w-16 h-8 text-center text-sm font-bold bg-white border border-slate-300 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleIncrement(size, 1)}
                      className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-600 hover:bg-slate-100 flex items-center justify-center active:scale-95 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total Stock Summary */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-500">Total Units in Stock:</span>
            <span className="font-extrabold text-sm text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">
              {totalUnits} T-Shirts
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 rounded-xl cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Save Stock Changes</span>
          </button>
        </div>

      </div>
    </div>
  );
};
