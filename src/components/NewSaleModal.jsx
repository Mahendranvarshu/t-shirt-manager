import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Check, Mail, User, Phone, CreditCard, AlertCircle, Shirt } from 'lucide-react';
import { TSHIRT_SIZES } from '../data/initialData';

export const NewSaleModal = ({ 
  isOpen, 
  onClose, 
  products, 
  preselectedProduct, 
  onRecordSale, 
  currency,
  onOpenReceipt
}) => {
  if (!isOpen) return null;

  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Active product reference
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

  // When product changes, update price
  const handleProductChange = (prodId) => {
    setSelectedProductId(prodId);
    const prod = products.find((p) => p.id === prodId);
    if (prod) {
      setUnitPrice(prod.sellingPrice || 0);
    }
    setErrorMsg('');
  };

  const currentSizeStock = currentProduct?.stock?.[selectedSize] || 0;
  const unitCost = Number(currentProduct?.costPrice || 0);
  const totalRevenue = Number(unitPrice) * Number(quantity);
  const totalCost = unitCost * Number(quantity);
  const netProfit = totalRevenue - totalCost;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentProduct) {
      setErrorMsg('Please select a product');
      return;
    }

    if (quantity <= 0) {
      setErrorMsg('Quantity must be at least 1');
      return;
    }

    if (quantity > currentSizeStock) {
      setErrorMsg(`Insufficient stock! Only ${currentSizeStock} units of Size ${selectedSize} available.`);
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
      customerName: customerName || 'Walk-in Customer',
      customerEmail: customerEmail || '',
      customerPhone: customerPhone || '',
      paymentMethod: paymentMethod,
      status: 'Completed',
      notes: notes,
      date: new Date().toISOString(),
    };

    onRecordSale(saleRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full my-6 overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base m-0">Record New T-Shirt Sale</h3>
              <p className="text-xs text-slate-300">Quick POS Billing & Stock Deduction</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Product Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              Select T-Shirt Product *
            </label>
            <div className="grid grid-cols-1 gap-2">
              <select
                value={currentProduct?.id || ''}
                onChange={(e) => handleProductChange(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-indigo-500 outline-none font-medium"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {currency}{p.sellingPrice} ({p.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Product Snapshot Card */}
            {currentProduct && (
              <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <img 
                  src={currentProduct.image} 
                  alt={currentProduct.name} 
                  className="w-12 h-12 rounded-lg object-cover border border-slate-200 shadow-xs" 
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate m-0">{currentProduct.name}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                    <span>Cost: {currency}{currentProduct.costPrice}</span>
                    <span>•</span>
                    <span>SKU: {currentProduct.sku}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Size & Stock Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700">
                Select Size * <span className="font-normal text-slate-500">(Available Stock Shown Below)</span>
              </label>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                currentSizeStock === 0 
                  ? 'bg-rose-100 text-rose-700' 
                  : currentSizeStock <= 5 
                  ? 'bg-amber-100 text-amber-800' 
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {currentSizeStock} in stock for Size {selectedSize}
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {TSHIRT_SIZES.map((size) => {
                const stockQty = currentProduct?.stock?.[size] || 0;
                const isSelected = selectedSize === size;
                const isOutOfStock = stockQty === 0;

                return (
                  <button
                    key={size}
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => {
                      setSelectedSize(size);
                      setErrorMsg('');
                    }}
                    className={`py-2 px-1 rounded-xl text-center border transition-all cursor-pointer ${
                      isOutOfStock
                        ? 'opacity-40 bg-slate-100 border-slate-200 cursor-not-allowed'
                        : isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-sm'
                        : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-extrabold">{size}</div>
                    <div className={`text-[10px] ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {stockQty}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity and Selling Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                max={currentSizeStock || 1}
                required
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-indigo-500 outline-none font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Selling Price ({currency})
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-indigo-500 outline-none font-bold text-slate-900"
              />
            </div>
          </div>

          {/* Live Profit Preview Box */}
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-950">
            <div>
              <span className="font-semibold block">Total Revenue: {currency}{totalRevenue.toFixed(2)}</span>
              <span className="text-[11px] text-emerald-700">Cost of Goods: {currency}{totalCost.toFixed(2)}</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-emerald-700 font-medium block">Net Profit</span>
              <span className="text-base font-black text-emerald-600">
                +{currency}{netProfit.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Customer & Mail Details ("mail details name, image, sizes") */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 m-0 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span>Customer & Email Invoice Details</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Customer Email (for receipt invoice)
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="email"
                    placeholder="customer@email.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Customer Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                >
                  <option value="Card">Card Payment</option>
                  <option value="Cash">Cash</option>
                  <option value="UPI / Online">UPI / Online / QR</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Order Notes (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Gift wrapped, express delivery, discount coupon"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Submit Action */}
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
              className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer transition-all"
            >
              <Check className="w-4 h-4" />
              <span>Complete Sale & Deduct Stock</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
