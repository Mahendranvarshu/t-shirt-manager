# 👕 ThreadFlow — T-Shirt Business & Stock Manager (Google Sheets DB)

A modern, responsive, high-performance web dashboard tailored for T-shirt brand owners. Manage stock inventory across sizes (**XS, S, M, L, XL, 2XL, 3XL**), record daily sales, view real-time **Day-to-Day, Monthly, and Yearly Profit & Loss (P&L)** statements, send email invoices to customers, and use **Google Sheets as your free database** with zero hosting costs.

---

## 🌟 Key Features

1. **📊 Profit & Loss (P&L) Analytics**:
   - **Day-to-Day**: Track today's revenue, product manufacturing cost (COGS), and net profit. View daily trends across the last 14 days with visual comparison bars.
   - **Monthly P&L**: Detailed monthly breakdown (Revenue, Cost, Net Profit, Margin %) to analyze seasonality.
   - **Yearly P&L**: Annual performance and YoY growth comparisons.
   - **Size Demand Analysis**: Visual breakdown of XS, S, M, L, XL, 2XL, 3XL sales to prevent overstocking unpopular sizes.

2. **👕 Product & Stock Management**:
   - Product details: Name, Category, Color, SKU, Image URL (or 1-click preset mockups), Description.
   - Live inventory matrix for all sizes: **XS, S, M, L, XL, 2XL, 3XL**.
   - Low-stock warning alerts (when stock drops to 5 units or lower).
   - Quick restock modal (+/- per size or bulk restock).
   - Cost price vs selling price with automatic margin calculations.

3. **🧾 Selling & Checkout (POS)**:
   - Record new sales with product search, size selector with remaining inventory indicators.
   - Prevents overselling (out-of-stock sizes are disabled).
   - Automatic real-time inventory deduction.
   - Customer details: Name, Email, Phone, Payment method (Cash, Card, UPI, Bank Transfer).

4. **✉️ Customer & Email Receipt Generation**:
   - Printable & emailable receipts showing T-shirt image thumbnail, sizes, itemized costs, and total.
   - 1-click **Send Mail Receipt** (pre-composed email to customer).
   - Automated email receipt via Google Apps Script's built-in `MailApp.sendEmail()`.
   - Customer directory with lifetime spend and preferred sizes.

5. **📊 Google Sheets as Database ("No Traditional DB Required")**:
   - Zero database fees, zero backend servers, zero API key hassles.
   - Uses a Google Apps Script Web App that reads and writes directly to your Google Sheet.
   - Stores data in formatted sheets: `Products` and `Sales`.
   - Works seamlessly offline with LocalStorage fallback and full CSV export/import anytime.

---

## 🚀 Quick Start Guide

### 1. Run the Web Application
```bash
# Navigate to the project directory
cd C:\Users\LENOVO\.gemini\antigravity\scratch\tshirt-manager

# Start Vite dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📋 Google Sheets Setup (Takes 2 Minutes)

1. Open [sheets.new](https://sheets.new) in your browser and name the sheet **T-Shirt Business DB**.
2. Click **Extensions** → **Apps Script**.
3. Delete any default code in `Code.gs`.
4. Copy and paste the contents of `GoogleSheet_AppsScript_Code.js` (available in the project folder or directly copied from the Settings modal in the app).
5. Click the **Save** (💾) button.
6. Click **Deploy** → **New deployment**.
7. Click the gear icon next to *Select type* → choose **Web app**.
8. Set:
   - **Description**: `T-Shirt Manager API`
   - **Execute as**: `Me`
   - **Who has access**: `Anyone` *(Crucial so the web app can read/write data)*
9. Click **Deploy**, authorize access with your Google account, and copy the **Web app URL** (starts with `https://script.google.com/macros/s/.../exec`).
10. In the web app, click the **Settings / Google Sheet** button in the top right, paste your URL, and click **Test & Connect**!

---

## 🗂️ Project Structure

```
tshirt-manager/
├── GoogleSheet_AppsScript_Code.js    # Copy-paste ready backend code for Google Sheets
├── index.html                        # HTML entry point with fonts & metadata
├── package.json                      # Dependencies (React 19, Tailwind v4, Lucide React)
├── src/
│   ├── main.jsx                      # App entry point
│   ├── index.css                     # Tailwind v4 styles
│   ├── App.jsx                       # Main application state & tab orchestration
│   ├── data/
│   │   ├── initialData.js            # Sample T-shirts, size inventories, past sales
│   │   └── googleAppsScriptCode.js   # Script template export for modal copy
│   ├── services/
│   │   ├── storageService.js         # LocalStorage, CSV export, P&L calculations
│   │   └── googleSheetsApi.js        # Google Apps Script Web App GET/POST client
│   └── components/
│       ├── Navbar.jsx                # Header, tabs, currency switcher, sync pill
│       ├── DashboardTab.jsx          # Day-to-Day, Monthly, Yearly P&L & Size analytics
│       ├── ProductsTab.jsx           # Catalog, size inventory, restock buttons
│       ├── ProductModal.jsx          # Add/edit T-shirt specifications & prices
│       ├── StockAdjustModal.jsx      # Per-size quick stock adjuster
│       ├── NewSaleModal.jsx          # Checkout, stock decrement, customer details
│       ├── ReceiptModal.jsx          # Printable/emailable receipt invoice
│       ├── SalesTab.jsx              # Order history, P&L per order, CSV export
│       ├── CustomersTab.jsx          # Customer profiles, favorite sizes, email actions
│       └── GoogleSheetModal.jsx      # Step-by-step setup wizard & live sync
```
