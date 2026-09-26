import { SAMPLE_PRODUCTS, SAMPLE_SALES } from '../data/initialData';
import { fetchFromGoogleSheet, postToGoogleSheet } from './googleSheetsApi';

const STORAGE_KEYS = {
  PRODUCTS: 'tee_manager_products',
  SALES: 'tee_manager_sales',
  SETTINGS: 'tee_manager_settings',
};

// Default business settings - Locked to Indian Rupees (₹)
const DEFAULT_SETTINGS = {
  storeName: 'T-Shirt Studio',
  currency: '₹',
  googleSheetUrl: '',
  autoEmailReceipts: true,
  lowStockThreshold: 5,
  ownerEmail: '',
};

export const getStoredSettings = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    const parsed = data ? JSON.parse(data) : {};
    return { ...DEFAULT_SETTINGS, ...parsed, currency: '₹' }; // Always Indian Rupees
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveStoredSettings = (settings) => {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
};

export const getStoredProducts = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(SAMPLE_PRODUCTS));
      return SAMPLE_PRODUCTS;
    }
    const parsed = JSON.parse(data);
    // If old cached data had small dollar prices (< 100), upgrade to realistic INR prices
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].sellingPrice < 100) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(SAMPLE_PRODUCTS));
      return SAMPLE_PRODUCTS;
    }
    return parsed;
  } catch {
    return SAMPLE_PRODUCTS;
  }
};

export const saveStoredProducts = (products) => {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
};

export const getStoredSales = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SALES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(SAMPLE_SALES));
      return SAMPLE_SALES;
    }
    const parsed = JSON.parse(data);
    // If old cached sales had small dollar prices (< 100), upgrade to INR
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].unitPrice < 100) {
      localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(SAMPLE_SALES));
      return SAMPLE_SALES;
    }
    return parsed;
  } catch {
    return SAMPLE_SALES;
  }
};

export const saveStoredSales = (sales) => {
  localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
};

export const resetToSampleData = () => {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(SAMPLE_PRODUCTS));
  localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(SAMPLE_SALES));
  return { products: SAMPLE_PRODUCTS, sales: SAMPLE_SALES };
};

/**
 * Record a sale:
 * 1. Appends to sales list
 * 2. Decrements product stock for that size
 * 3. Syncs to Google Sheet if connected
 */
export const recordNewSale = async (saleData, currentProducts, currentSales, googleSheetUrl) => {
  const newSale = {
    ...saleData,
    id: saleData.id || `ORD-${Date.now().toString().slice(-6)}`,
    date: saleData.date || new Date().toISOString(),
    totalRevenue: Number(saleData.unitPrice) * Number(saleData.quantity),
    totalCost: Number(saleData.unitCost) * Number(saleData.quantity),
    netProfit: (Number(saleData.unitPrice) - Number(saleData.unitCost)) * Number(saleData.quantity),
  };

  // 1. Decrement stock
  const updatedProducts = currentProducts.map((prod) => {
    if (prod.id === newSale.productId) {
      const currentStock = prod.stock[newSale.size] || 0;
      const newStock = Math.max(0, currentStock - newSale.quantity);
      return {
        ...prod,
        stock: {
          ...prod.stock,
          [newSale.size]: newStock,
        },
      };
    }
    return prod;
  });

  const updatedSales = [newSale, ...currentSales];

  // Save to LocalStorage
  saveStoredProducts(updatedProducts);
  saveStoredSales(updatedSales);

  // Background sync to Google Sheet if configured
  if (googleSheetUrl) {
    postToGoogleSheet(googleSheetUrl, {
      action: 'recordSale',
      data: newSale,
    }).catch((err) => console.warn('Background sync failed:', err));
  }

  return { newSale, updatedProducts, updatedSales };
};

/**
 * Save or Update Product
 */
export const saveProductItem = async (productData, currentProducts, googleSheetUrl) => {
  const exists = currentProducts.some((p) => p.id === productData.id);
  let updatedProducts;

  if (exists) {
    updatedProducts = currentProducts.map((p) => (p.id === productData.id ? productData : p));
  } else {
    updatedProducts = [productData, ...currentProducts];
  }

  saveStoredProducts(updatedProducts);

  if (googleSheetUrl) {
    postToGoogleSheet(googleSheetUrl, {
      action: 'saveProduct',
      data: productData,
    }).catch((err) => console.warn('Product sync failed:', err));
  }

  return updatedProducts;
};

/**
 * Delete a product
 */
export const deleteProductItem = async (productId, currentProducts, googleSheetUrl) => {
  const updatedProducts = currentProducts.filter((p) => p.id !== productId);
  saveStoredProducts(updatedProducts);

  if (googleSheetUrl) {
    postToGoogleSheet(googleSheetUrl, {
      action: 'deleteProduct',
      productId,
    }).catch((err) => console.warn('Delete product sync failed:', err));
  }

  return updatedProducts;
};

/**
 * Adjust stock for a size
 */
export const adjustStockQuantity = async (productId, size, newQty, currentProducts, googleSheetUrl) => {
  const updatedProducts = currentProducts.map((p) => {
    if (p.id === productId) {
      return {
        ...p,
        stock: {
          ...p.stock,
          [size]: Math.max(0, Number(newQty)),
        },
      };
    }
    return p;
  });

  saveStoredProducts(updatedProducts);

  if (googleSheetUrl) {
    postToGoogleSheet(googleSheetUrl, {
      action: 'updateStock',
      productId,
      size,
      newQuantity: newQty,
    }).catch((err) => console.warn('Stock update sync failed:', err));
  }

  return updatedProducts;
};

/**
 * Comprehensive Analytics & Profit / Loss Engine
 */
export const computeAnalytics = (sales = [], products = []) => {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  let totalRevenue = 0;
  let totalCost = 0;
  let totalProfit = 0;
  let totalUnits = 0;

  let todayRevenue = 0;
  let todayCost = 0;
  let todayProfit = 0;
  let todayUnits = 0;

  // Breakdown by sizes: { XS: 0, S: 0, ... }
  const sizeDistribution = { XS: 0, S: 0, M: 0, L: 0, XL: 0, '2XL': 0, '3XL': 0 };

  // Breakdown by product
  const productPerformance = {};

  // Monthly breakdown: { '2026-01': { month: 'Jan 2026', revenue: 0, cost: 0, profit: 0, count: 0 }, ... }
  const monthlyData = {};

  // Yearly breakdown: { '2025': { year: '2025', revenue: 0, cost: 0, profit: 0, count: 0 }, ... }
  const yearlyData = {};

  // Daily timeline (last 14 days)
  const dailyTimeline = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateKey = d.toISOString().split('T')[0];
    const displayLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    dailyTimeline[dateKey] = {
      date: dateKey,
      label: displayLabel,
      revenue: 0,
      cost: 0,
      profit: 0,
      orders: 0,
    };
  }

  sales.forEach((s) => {
    const rev = Number(s.totalRevenue || (s.unitPrice * s.quantity) || 0);
    const cost = Number(s.totalCost || (s.unitCost * s.quantity) || 0);
    const profit = Number(s.netProfit !== undefined ? s.netProfit : rev - cost);
    const qty = Number(s.quantity || 1);

    totalRevenue += rev;
    totalCost += cost;
    totalProfit += profit;
    totalUnits += qty;

    const saleDate = new Date(s.date);
    const dateKey = saleDate.toISOString().split('T')[0];
    const yearKey = saleDate.getFullYear().toString();
    const monthKey = `${saleDate.getFullYear()}-${String(saleDate.getMonth() + 1).padStart(2, '0')}`;
    const monthLabel = saleDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    // Today check
    if (dateKey === todayStr) {
      todayRevenue += rev;
      todayCost += cost;
      todayProfit += profit;
      todayUnits += qty;
    }

    // Daily Timeline
    if (dailyTimeline[dateKey]) {
      dailyTimeline[dateKey].revenue += rev;
      dailyTimeline[dateKey].cost += cost;
      dailyTimeline[dateKey].profit += profit;
      dailyTimeline[dateKey].orders += 1;
    }

    // Monthly
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        key: monthKey,
        label: monthLabel,
        revenue: 0,
        cost: 0,
        profit: 0,
        units: 0,
        orders: 0,
      };
    }
    monthlyData[monthKey].revenue += rev;
    monthlyData[monthKey].cost += cost;
    monthlyData[monthKey].profit += profit;
    monthlyData[monthKey].units += qty;
    monthlyData[monthKey].orders += 1;

    // Yearly
    if (!yearlyData[yearKey]) {
      yearlyData[yearKey] = {
        year: yearKey,
        revenue: 0,
        cost: 0,
        profit: 0,
        units: 0,
        orders: 0,
      };
    }
    yearlyData[yearKey].revenue += rev;
    yearlyData[yearKey].cost += cost;
    yearlyData[yearKey].profit += profit;
    yearlyData[yearKey].units += qty;
    yearlyData[yearKey].orders += 1;

    // Size distribution
    if (s.size && sizeDistribution[s.size] !== undefined) {
      sizeDistribution[s.size] += qty;
    }

    // Product performance
    const pId = s.productId || s.productName;
    if (!productPerformance[pId]) {
      productPerformance[pId] = {
        id: pId,
        name: s.productName,
        image: s.productImage,
        revenue: 0,
        cost: 0,
        profit: 0,
        unitsSold: 0,
      };
    }
    productPerformance[pId].revenue += rev;
    productPerformance[pId].cost += cost;
    productPerformance[pId].profit += profit;
    productPerformance[pId].unitsSold += qty;
  });

  // Calculate current inventory asset value
  let totalStockCount = 0;
  let inventoryCostValue = 0;
  let inventoryRetailValue = 0;
  let lowStockCount = 0;

  products.forEach((p) => {
    let pStockSum = 0;
    Object.entries(p.stock || {}).forEach(([size, count]) => {
      const c = Number(count) || 0;
      pStockSum += c;
      if (c <= (p.lowStockThreshold || 5)) {
        lowStockCount++;
      }
    });
    totalStockCount += pStockSum;
    inventoryCostValue += pStockSum * Number(p.costPrice || 0);
    inventoryRetailValue += pStockSum * Number(p.sellingPrice || 0);
  });

  // Sort monthly data chronologically
  const sortedMonthly = Object.values(monthlyData).sort((a, b) => a.key.localeCompare(b.key));
  // Sort yearly data chronologically
  const sortedYearly = Object.values(yearlyData).sort((a, b) => a.year.localeCompare(b.year));
  // Top selling products by profit
  const topProducts = Object.values(productPerformance).sort((a, b) => b.profit - a.profit);

  return {
    overview: {
      totalRevenue,
      totalCost,
      totalProfit,
      profitMargin: totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0,
      totalUnits,
      todayRevenue,
      todayCost,
      todayProfit,
      todayUnits,
      totalStockCount,
      inventoryCostValue,
      inventoryRetailValue,
      potentialInventoryProfit: inventoryRetailValue - inventoryCostValue,
      lowStockAlerts: lowStockCount,
    },
    dailyTimeline: Object.values(dailyTimeline),
    monthlyData: sortedMonthly,
    yearlyData: sortedYearly,
    sizeDistribution,
    topProducts,
  };
};

/**
 * Export all products and sales to CSV for quick backup
 */
export const exportDataToCsv = (products, sales) => {
  // 1. Export Products CSV
  const productRows = [
    ['Product ID', 'Name', 'Category', 'Color', 'Cost Price', 'Selling Price', 'SKU', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', 'Total Stock'],
    ...products.map((p) => [
      p.id,
      `"${(p.name || '').replace(/"/g, '""')}"`,
      p.category,
      p.color,
      p.costPrice,
      p.sellingPrice,
      p.sku,
      p.stock.XS || 0,
      p.stock.S || 0,
      p.stock.M || 0,
      p.stock.L || 0,
      p.stock.XL || 0,
      p.stock['2XL'] || 0,
      p.stock['3XL'] || 0,
      Object.values(p.stock || {}).reduce((a, b) => a + Number(b), 0),
    ]),
  ];

  const salesRows = [
    ['Order ID', 'Date', 'Product ID', 'Product Name', 'Size', 'Qty', 'Unit Cost', 'Unit Price', 'Revenue', 'Cost', 'Net Profit', 'Customer Name', 'Customer Email', 'Payment', 'Notes'],
    ...sales.map((s) => [
      s.id,
      s.date,
      s.productId,
      `"${(s.productName || '').replace(/"/g, '""')}"`,
      s.size,
      s.quantity,
      s.unitCost,
      s.unitPrice,
      s.totalRevenue,
      s.totalCost,
      s.netProfit,
      `"${(s.customerName || '').replace(/"/g, '""')}"`,
      s.customerEmail || '',
      s.paymentMethod || '',
      `"${(s.notes || '').replace(/"/g, '""')}"`,
    ]),
  ];

  const downloadCsv = (filename, rows) => {
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  downloadCsv(`TShirt_Products_${new Date().toISOString().split('T')[0]}.csv`, productRows);
  setTimeout(() => {
    downloadCsv(`TShirt_Sales_${new Date().toISOString().split('T')[0]}.csv`, salesRows);
  }, 500);
};
