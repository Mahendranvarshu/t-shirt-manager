import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardTab } from './components/DashboardTab';
import { ProductsTab } from './components/ProductsTab';
import { SalesTab } from './components/SalesTab';
import { CustomersTab } from './components/CustomersTab';
import { ProductModal } from './components/ProductModal';
import { StockAdjustModal } from './components/StockAdjustModal';
import { NewSaleModal } from './components/NewSaleModal';
import { ReceiptModal } from './components/ReceiptModal';
import { GoogleSheetModal } from './components/GoogleSheetModal';

import { 
  getStoredProducts, 
  getStoredSales, 
  getStoredSettings, 
  saveStoredSettings,
  recordNewSale, 
  saveProductItem, 
  deleteProductItem, 
  adjustStockQuantity,
  computeAnalytics,
  resetToSampleData
} from './services/storageService';

import { postToGoogleSheet, fetchFromGoogleSheet } from './services/googleSheetsApi';
import { CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState(getStoredProducts);
  const [sales, setSales] = useState(getStoredSales);
  const [settings, setSettings] = useState(getStoredSettings);
  const [currency, setCurrency] = useState(settings.currency || '$');
  const [isSheetConnected, setIsSheetConnected] = useState(Boolean(settings.googleSheetUrl));
  const [isSyncing, setIsSyncing] = useState(false);

  // Modals state
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
  const [preselectedProduct, setPreselectedProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [stockProduct, setStockProduct] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Toast Notification state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Sync currency changes to settings
  const handleCurrencyChange = (newCurr) => {
    setCurrency(newCurr);
    const updated = { ...settings, currency: newCurr };
    setSettings(updated);
    saveStoredSettings(updated);
  };

  // Compute live analytics whenever sales or products change
  const analytics = useMemo(() => {
    return computeAnalytics(sales, products);
  }, [sales, products]);

  // Record Sale Handler
  const handleRecordSale = async (saleData) => {
    const { newSale, updatedProducts, updatedSales } = await recordNewSale(
      saleData,
      products,
      sales,
      settings.googleSheetUrl
    );

    setProducts(updatedProducts);
    setSales(updatedSales);
    setActiveReceipt(newSale);
    setIsReceiptOpen(true);
    showToast(`Sale recorded for ${saleData.productName} (Size ${saleData.size})! Stock decremented.`);
  };

  // Product CRUD Handlers
  const handleSaveProduct = async (productData) => {
    const updated = await saveProductItem(productData, products, settings.googleSheetUrl);
    setProducts(updated);
    showToast(`Product "${productData.name}" saved successfully!`);
  };

  const handleDeleteProduct = async (productId) => {
    if (confirm('Are you sure you want to delete this T-shirt product?')) {
      const updated = await deleteProductItem(productId, products, settings.googleSheetUrl);
      setProducts(updated);
      showToast('Product deleted.', 'info');
    }
  };

  const handleAdjustStock = async (productId, newStockMap) => {
    let updated = products;
    for (const [size, qty] of Object.entries(newStockMap)) {
      updated = await adjustStockQuantity(productId, size, qty, updated, settings.googleSheetUrl);
    }
    setProducts(updated);
    showToast('Inventory stock updated!');
  };

  // Delete Sale / Refund Handler
  const handleDeleteSale = (saleId) => {
    if (confirm('Delete this sale record? (Note: this does not automatically restock inventory).')) {
      const updated = sales.filter((s) => s.id !== saleId);
      setSales(updated);
      localStorage.setItem('tee_manager_sales', JSON.stringify(updated));
      showToast('Sale record removed.', 'info');
    }
  };

  // Push local data to Google Sheet
  const handleSyncPush = async () => {
    if (!settings.googleSheetUrl) return;
    setIsSyncing(true);
    const res = await postToGoogleSheet(settings.googleSheetUrl, {
      action: 'syncAll',
      products,
      sales,
    });
    setIsSyncing(false);
    if (res.success) {
      showToast('All products and sales synced to Google Sheet!');
    } else {
      showToast('Push sync failed: ' + res.message, 'error');
    }
  };

  // Pull data from Google Sheet
  const handleSyncPull = async () => {
    if (!settings.googleSheetUrl) return;
    setIsSyncing(true);
    const data = await fetchFromGoogleSheet(settings.googleSheetUrl);
    setIsSyncing(false);

    if (data && data.products && data.products.length > 0) {
      setProducts(data.products);
      localStorage.setItem('tee_manager_products', JSON.stringify(data.products));
      if (data.sales) {
        setSales(data.sales);
        localStorage.setItem('tee_manager_sales', JSON.stringify(data.sales));
      }
      showToast('Data pulled successfully from Google Sheet!');
    } else {
      showToast('Could not pull data. Make sure Web App is accessible.', 'error');
    }
  };

  // Reset to Sample Data
  const handleResetData = () => {
    const { products: p, sales: s } = resetToSampleData();
    setProducts(p);
    setSales(s);
    showToast('Reset to sample T-shirt data successfully!');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border bg-slate-900 text-white text-xs font-semibold animate-in slide-in-from-bottom-5 duration-200">
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewSale={() => {
          setPreselectedProduct(null);
          setIsNewSaleOpen(true);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isSheetConnected={isSheetConnected}
        currency={currency}
        setCurrency={handleCurrencyChange}
        onSyncNow={handleSyncPush}
        isSyncing={isSyncing}
        settings={settings}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardTab
            analytics={analytics}
            products={products}
            sales={sales}
            currency={currency}
            onOpenNewSale={() => setIsNewSaleOpen(true)}
            onNavigateToStock={() => setActiveTab('products')}
          />
        )}

        {activeTab === 'products' && (
          <ProductsTab
            products={products}
            onAddNewProduct={() => {
              setEditingProduct(null);
              setIsProductModalOpen(true);
            }}
            onEditProduct={(prod) => {
              setEditingProduct(prod);
              setIsProductModalOpen(true);
            }}
            onDeleteProduct={handleDeleteProduct}
            onAdjustStock={(prod) => {
              setStockProduct(prod);
              setIsStockModalOpen(true);
            }}
            onSellProduct={(prod) => {
              setPreselectedProduct(prod);
              setIsNewSaleOpen(true);
            }}
            currency={currency}
          />
        )}

        {activeTab === 'sales' && (
          <SalesTab
            sales={sales}
            products={products}
            onViewReceipt={(sale) => {
              setActiveReceipt(sale);
              setIsReceiptOpen(true);
            }}
            onDeleteSale={handleDeleteSale}
            onOpenNewSale={() => setIsNewSaleOpen(true)}
            currency={currency}
          />
        )}

        {activeTab === 'customers' && (
          <CustomersTab
            sales={sales}
            currency={currency}
            storeName={settings.storeName}
          />
        )}
      </main>

      {/* Modals */}
      <NewSaleModal
        isOpen={isNewSaleOpen}
        onClose={() => setIsNewSaleOpen(false)}
        products={products}
        preselectedProduct={preselectedProduct}
        onRecordSale={handleRecordSale}
        currency={currency}
      />

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
        currency={currency}
      />

      <StockAdjustModal
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        product={stockProduct}
        onSaveStock={handleAdjustStock}
        currency={currency}
      />

      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        sale={activeReceipt}
        currency={currency}
        storeName={settings.storeName}
      />

      <GoogleSheetModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={(newSettings) => {
          setSettings(newSettings);
          saveStoredSettings(newSettings);
          setIsSheetConnected(Boolean(newSettings.googleSheetUrl));
          showToast('Settings saved successfully!');
        }}
        isSheetConnected={isSheetConnected}
        setIsSheetConnected={setIsSheetConnected}
        onSyncPush={handleSyncPush}
        onSyncPull={handleSyncPull}
        isSyncing={isSyncing}
        products={products}
        sales={sales}
        onResetData={handleResetData}
      />

      {/* Modern Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">{settings.storeName || 'ThreadFlow'}</span>
            <span>•</span>
            <span>T-Shirt Business Inventory & P&L Manager</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Database: {isSheetConnected ? 'Google Sheets (Live)' : 'Local Storage Mode'}</span>
            <span>•</span>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
            >
              Configure Google Sheet
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
