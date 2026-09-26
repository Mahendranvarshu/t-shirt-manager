import React, { useState } from 'react';
import { X, Plus, Minus, Check, PackagePlus } from 'lucide-react';
import { TSHIRT_SIZES } from '../data/initialData';

export const StockAdjustModal = ({ product, isOpen, onClose, onSaveStock }) => {
  if (!isOpen || !product) return null;

  const [stock, setStock] = useState({ ...product.stock });

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

  const handleBulkAdd = (qty = 5) => {
    setStock((prev) => {
      const updated = { ...prev };
      TSHIRT_SIZES.forEach((s) => {
        updated[s] = (Number(updated[s]) || 0) + qty;
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={product.image} alt="Tee" className="w-8 h-8 rounded-lg object-cover" />
            <span className="font-extrabold text-xs text-white truncate max-w-[220px]">
              {product.name}
            </span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          
          {/* Quick Restock Pills */}
          <div className="flex items-center justify-between bg-indigo-50 p-2 rounded-xl border border-indigo-100">
            <span className="text-[11px] font-bold text-indigo-950">Bulk Restock All:</span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => handleBulkAdd(5)}
                className="px-2.5 py-1 bg-indigo-600 active:bg-indigo-700 text-white text-[11px] font-bold rounded-lg cursor-pointer"
              >
                +5 All
              </button>
              <button
                type="button"
                onClick={() => handleBulkAdd(10)}
                className="px-2.5 py-1 bg-indigo-600 active:bg-indigo-700 text-white text-[11px] font-bold rounded-lg cursor-pointer"
              >
                +10 All
              </button>
            </div>
          </div>

          {/* Sizes Stepper Rows */}
          <div className="space-y-2">
            {TSHIRT_SIZES.map((size) => {
              const count = Number(stock[size]) || 0;
              const isLow = count <= 5;

              return (
                <div 
                  key={size}
                  className={`flex items-center justify-between p-2 rounded-xl border ${
                    isLow ? 'bg-amber-50/70 border-amber-200' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-white font-black text-slate-900 text-xs flex items-center justify-center border border-slate-200 shadow-xs">
                      {size}
                    </span>
                    <span className="text-xs font-bold text-slate-700">Size {size}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleDecrement(size, 1)}
                      className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-700 active:bg-slate-100 flex items-center justify-center cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input 
                      type="number"
                      min="0"
                      value={count}
                      onChange={(e) => handleDirectChange(size, e.target.value)}
                      className="w-14 h-8 text-center text-xs font-black bg-white border border-slate-300 rounded-lg outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleIncrement(size, 1)}
                      className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-700 active:bg-slate-100 flex items-center justify-center cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total Stock */}
          <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-xs font-bold text-slate-700">
            <span>Total Units:</span>
            <span className="text-sm font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg">
              {totalUnits} pcs
            </span>
          </div>

          {/* Save Button */}
          <button
            type="button"
            onClick={handleSave}
            className="w-full py-3 bg-indigo-600 active:bg-indigo-700 text-white rounded-xl font-black text-xs shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5 cursor-pointer mt-2"
          >
            <Check className="w-4 h-4" />
            <span>Save Stock</span>
          </button>

        </div>

      </div>
    </div>
  );
};
