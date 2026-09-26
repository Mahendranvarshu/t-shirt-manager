import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Check, Plus, Minus, AlertCircle } from 'lucide-react';
import { TSHIRT_SIZES } from '../data/initialData';

export const NewSaleModal = ({ 
  isOpen, 
  onClose, 
  products, 
  preselectedProduct, 
  onRecordSale 
}) => {
  if (!isOpen) return null;

  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI (GPay/PhonePe)');
  const [errorMsg, setErrorMsg] = useState('');

  const currentProduct = products.find((p) => p.id === selectedProductId) || products[0];

  useEffect(() => {
    if (preselectedProduct) {
      setSelectedProductId(preselectedProduct.id);
      setUnitPrice(preselectedProduct.sellingPrice || 0);
    } else if (products.length > 0 && !selectedProductId) {
      setSelectedProductId(products[0].id);
      setUnitPrice(products[0].sellingPrice || 0);
    }
  }, [preselectedProduct, products]);

  const handleProductChange = (prodId) => {
    setSelectedProductId(prodId);
    const prod = products.find((p) => p.id === prodId);
    if (prod) {
      setUnitPrice(prod.sellingPrice || 0);
    }
    setErrorMsg('');
  };

  const currentStock = currentProduct?.stock?.[selectedSize] || 0;
  const unitCost = Number(currentProduct?.costPrice || 0);
  const totalRevenue = Number(unitPrice) * Number(quantity);
  const totalCost = unitCost * Number(quantity);
  const netProfit = totalRevenue - totalCost;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentProduct) return;

    if (quantity > currentStock) {
      setErrorMsg(`Only ${currentStock} pcs left in Size ${selectedSize}!`);
      return;
    }

    const saleRecord = {
      productId: currentProduct.id,
      productName: currentProduct.name,
      productImage: currentProduct.image,
      size: selectedSize,
      quantity: Number(quantity),
      unitCost: unitCost,
      unitPrice: Number(unitPrice),
      totalRevenue: totalRevenue,
      totalCost: totalCost,
      netProfit: netProfit,
      customerName: customerName || 'Walk-in',
      customerPhone: customerPhone || '',
      customerEmail: customerEmail || '',
      paymentMethod: paymentMethod,
      status: 'Completed',
      date: new Date().toISOString(),
    };

    onRecordSale(saleRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            <span className="font-extrabold text-sm text-white">Record Sale</span>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 overflow-y-auto flex-1">
          
          {errorMsg && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Select T-Shirt */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Select T-Shirt</label>
            <select
              value={currentProduct?.id || ''}
              onChange={(e) => handleProductChange(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 outline-none"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — ₹{p.sellingPrice}
                </option>
              ))}
            </select>
          </div>

          {/* Product Thumbnail & Size Stock */}
          {currentProduct && (
            <div className="flex items-center gap-2.5 p-2 bg-slate-50 rounded-xl border border-slate-200">
              <img src={currentProduct.image} alt="Tee" className="w-10 h-10 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <span className="font-bold text-xs text-slate-900 block truncate">{currentProduct.name}</span>
                <span className="text-[10px] text-slate-500 font-semibold">Cost: ₹{currentProduct.costPrice}</span>
              </div>
              <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-lg ${
                currentStock === 0 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {currentStock} in stock
              </span>
            </div>
          )}

          {/* Size Selector Buttons */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">Select Size</label>
            <div className="grid grid-cols-7 gap-1">
              {TSHIRT_SIZES.map((size) => {
                const stockQty = currentProduct?.stock?.[size] || 0;
                const isSelected = selectedSize === size;
                const isOut = stockQty === 0;

                return (
                  <button
                    key={size}
                    type="button"
                    disabled={isOut}
                    onClick={() => {
                      setSelectedSize(size);
                      setErrorMsg('');
                    }}
                    className={`py-2 rounded-xl text-center border cursor-pointer transition-all ${
                      isOut 
                        ? 'opacity-30 bg-slate-100 border-slate-200 cursor-not-allowed'
                        : isSelected
                        ? 'bg-slate-900 text-white border-slate-900 font-black shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="text-xs font-black">{size}</div>
                    <div className={`text-[9px] ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                      {stockQty}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity & Unit Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Quantity</label>
              <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  min="1"
                  max={currentStock || 1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full text-center text-xs font-black bg-transparent outline-none"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Price (₹)</label>
              <input
                type="number"
                min="0"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-black text-slate-900 outline-none"
              />
            </div>
          </div>

          {/* Profit Preview */}
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-950">Net Profit:</span>
            <span className="text-sm font-black text-emerald-700">+₹{netProfit}</span>
          </div>

          {/* Customer Details */}
          <div className="space-y-2 pt-1 border-t border-slate-200">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none"
              />
              <input
                type="tel"
                placeholder="Phone / WhatsApp"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="email"
                placeholder="Email (Optional)"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none"
              />
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl font-semibold outline-none"
              >
                <option value="UPI (GPay/PhonePe)">UPI (GPay / PhonePe)</option>
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Online">Online</option>
              </select>
            </div>
          </div>

          {/* Full Width Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-emerald-600 active:bg-emerald-700 text-white rounded-xl font-black text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Confirm Sale — ₹{totalRevenue}</span>
          </button>

        </form>

      </div>
    </div>
  );
};
