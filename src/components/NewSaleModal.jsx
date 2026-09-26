import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShoppingBag, 
  Check, 
  Plus, 
  Minus, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Shirt,
  CheckCircle2
} from 'lucide-react';
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  const handleProductChange = (prod) => {
    setSelectedProductId(prod.id);
    setUnitPrice(prod.sellingPrice || 0);
    setIsDropdownOpen(false);
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
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 max-h-[94vh] flex flex-col">
        
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

          {/* Visual T-Shirt Selector with BIG Images */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-600">
              Select T-Shirt (Tap to pick)
            </label>

            {/* Custom Dropdown Trigger with BIG Image */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-2xl flex items-center justify-between gap-3 text-left transition-all active:scale-[0.99] cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* BIG T-Shirt Image Preview */}
                  <img 
                    src={currentProduct?.image} 
                    alt={currentProduct?.name} 
                    className="w-16 h-16 rounded-xl object-cover border-2 border-indigo-500 shadow-sm shrink-0" 
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-indigo-600 font-mono block">
                      {currentProduct?.sku}
                    </span>
                    <h4 className="font-black text-xs text-slate-900 truncate m-0">
                      {currentProduct?.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-extrabold text-slate-900">
                        ₹{currentProduct?.sellingPrice}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                        Cost: ₹{currentProduct?.costPrice}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-1 rounded-lg bg-white border border-slate-200 text-slate-500 shrink-0">
                  {isDropdownOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Dropdown Menu Popup with BIG Images */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border-2 border-slate-300 rounded-2xl shadow-2xl p-2 space-y-1.5 max-h-64 overflow-y-auto animate-in slide-in-from-top-2 duration-150">
                  {products.map((p) => {
                    const isSelected = p.id === currentProduct?.id;
                    const totalPcs = Object.values(p.stock || {}).reduce((a, b) => a + Number(b || 0), 0);

                    return (
                      <div
                        key={p.id}
                        onClick={() => handleProductChange(p)}
                        className={`flex items-center justify-between gap-3 p-2 rounded-xl transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-indigo-50 border-2 border-indigo-600' 
                            : 'hover:bg-slate-50 border border-slate-100'
                        }`}
                      >
                        {/* BIG T-Shirt Image */}
                        <div className="flex items-center gap-3 min-w-0">
                          <img 
                            src={p.image} 
                            alt={p.name} 
                            className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0" 
                          />
                          <div className="min-w-0">
                            <span className="font-extrabold text-xs text-slate-900 truncate block">
                              {p.name}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs font-black text-slate-900">₹{p.sellingPrice}</span>
                              <span className="text-[10px] text-slate-400">{p.category}</span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-semibold block">
                              {totalPcs} in stock
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick 1-Tap Horizontal Carousel with BIG T-Shirt Photos */}
            <div className="pt-1">
              <span className="text-[10px] font-bold text-slate-400 block mb-1">
                Quick 1-Tap Switch:
              </span>
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {products.map((p) => {
                  const isSelected = p.id === currentProduct?.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleProductChange(p)}
                      className={`shrink-0 rounded-2xl border-2 p-1 text-center transition-all cursor-pointer relative ${
                        isSelected 
                          ? 'border-indigo-600 bg-indigo-50/50 scale-102 shadow-sm' 
                          : 'border-slate-200 bg-white opacity-70 hover:opacity-100'
                      }`}
                    >
                      {/* BIG T-Shirt Image */}
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        className="w-16 h-18 rounded-xl object-cover shadow-xs" 
                      />
                      <span className="text-[10px] font-black text-slate-800 block truncate w-16 mt-1">
                        ₹{p.sellingPrice}
                      </span>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Size Selector Buttons with Remaining Stock */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-600">Select Size</label>
              <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-lg ${
                currentStock === 0 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {currentStock} pcs available in {selectedSize}
              </span>
            </div>

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

          {/* Quantity & Selling Price */}
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

          {/* Confirm Button */}
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
