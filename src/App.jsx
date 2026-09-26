import React, { useState, useMemo } from 'react';
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
import { CheckCircle2, AlertCircle } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState(getStoredProducts);
  const [sales, setSales] = useState(getStoredSales);
  const [settings, setSettings] = useState(getStoredSettings);
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

  // Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Compute live analytics
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
    showToast(`Sold ${saleData.productName} (Size ${saleData.size})!`);
  };

  // Product CRUD Handlers
  const handleSaveProduct = async (productData) => {
    const updated = await saveProductItem(productData, products, settings.googleSheetUrl);
    setProducts(updated);
    showToast(`T-Shirt "${productData.name}" saved!`);
  };

  const handleDeleteProduct = async (productId) => {
    if (confirm('Delete this T-shirt?')) {
      const updated = await deleteProductItem(productId, products, settings.googleSheetUrl);
      setProducts(updated);
      showToast('Deleted T-shirt', 'info');
    }
  };

  const handleAdjustStock = async (productId, newStockMap) => {
    let updated = products;
    for (const [size, qty] of Object.entries(newStockMap)) {
      updated = await adjustStockQuantity(productId, size, qty, updated, settings.googleSheetUrl);
    }
    setProducts(updated);
    showToast('Stock updated!');
  };

  const handleDeleteSale = (saleId) => {
    if (confirm('Delete this order?')) {
      const updated = sales.filter((s) => s.id !== saleId);
      setSales(updated);
      localStorage.setItem('tee_manager_sales', JSON.stringify(updated));
      showToast('Order deleted', 'info');
    }
  };

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
      showToast('Synced to Google Sheet!');
    } else {
      showToast('Push failed', 'error');
    }
  };

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
      showToast('Pulled latest data from Sheet!');
    } else {
      showToast('Could not fetch from Sheet', 'error');
    }
  };

  const handleResetData = () => {
    const { products: p, sales: s } = resetToSampleData();
    setProducts(p);
    setSales(s);
    showToast('Reset to demo data!');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans select-none">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full shadow-xl bg-slate-900 text-white text-xs font-bold animate-in slide-in-from-top-4 duration-200">
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
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
        settings={settings}
      />

      {/* Mobile-First Main Content Container */}
      <main className="flex-1 w-full max-w-lg mx-auto px-3.5 pt-3 pb-24">
        {activeTab === 'dashboard' && (
          <DashboardTab
            analytics={analytics}
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
          />
        )}

        {activeTab === 'customers' && (
          <CustomersTab
            sales={sales}
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
      />

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
      />

      <StockAdjustModal
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        product={stockProduct}
        onSaveStock={handleAdjustStock}
      />

      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        sale={activeReceipt}
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
          showToast('Settings saved!');
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

    </div>
  );
}

export default App;
