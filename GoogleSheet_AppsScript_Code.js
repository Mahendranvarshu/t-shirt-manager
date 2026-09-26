/**
 * =========================================================================
 * T-SHIRT BUSINESS MANAGER - GOOGLE APPS SCRIPT CODE
 * =========================================================================
 * 
 * Paste this code in Google Sheets: Extensions -> Apps Script -> Code.gs
 * Then Deploy as Web App (Execute as: Me, Who has access: Anyone)
 */

const SHEET_PRODUCTS = "Products";
const SHEET_SALES = "Sales";
const SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

function doGet(e) {
  try {
    initSheetsIfNeeded();
    const action = (e && e.parameter && e.parameter.action) || 'getAll';
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    if (action === 'getProducts') {
      return respondJson({ status: 'success', products: getProductsData(ss) });
    } else if (action === 'getSales') {
      return respondJson({ status: 'success', sales: getSalesData(ss) });
    } else if (action === 'ping') {
      return respondJson({ status: 'success', message: 'Connected to Google Sheets API successfully!', timestamp: new Date() });
    } else {
      return respondJson({
        status: 'success',
        products: getProductsData(ss),
        sales: getSalesData(ss)
      });
    }
  } catch (err) {
    return respondJson({ status: 'error', message: err.toString() });
  }
}

function doPost(e) {
  try {
    initSheetsIfNeeded();
    const contents = JSON.parse(e.postData.contents);
    const action = contents.action;
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    if (action === 'addSale' || action === 'recordSale') {
      const saleResult = recordSale(ss, contents.data);
      return respondJson(saleResult);
    } else if (action === 'saveProduct') {
      const prodResult = saveOrUpdateProduct(ss, contents.data);
      return respondJson(prodResult);
    } else if (action === 'deleteProduct') {
      const delResult = deleteProduct(ss, contents.productId);
      return respondJson(delResult);
    } else if (action === 'updateStock') {
      const stockResult = updateProductStock(ss, contents.productId, contents.size, contents.newQuantity);
      return respondJson(stockResult);
    } else if (action === 'syncAll') {
      const syncResult = syncAllData(ss, contents.products, contents.sales);
      return respondJson(syncResult);
    }

    return respondJson({ status: 'error', message: 'Unknown action: ' + action });
  } catch (err) {
    return respondJson({ status: 'error', message: err.toString() });
  }
}

function respondJson(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function initSheetsIfNeeded() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  let pSheet = ss.getSheetByName(SHEET_PRODUCTS);
  if (!pSheet) {
    pSheet = ss.insertSheet(SHEET_PRODUCTS);
    const headers = ["Product ID", "Name", "Category", "Color", "Cost Price", "Selling Price", "SKU", "Image URL", "Description", "XS", "S", "M", "L", "XL", "2XL", "3XL", "Total Stock", "Created At"];
    pSheet.appendRow(headers);
    pSheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#4F46E5").setFontColor("#FFFFFF");
    pSheet.setFrozenRows(1);
  }

  let sSheet = ss.getSheetByName(SHEET_SALES);
  if (!sSheet) {
    sSheet = ss.insertSheet(SHEET_SALES);
    const sHeaders = ["Order ID", "Date", "Product ID", "Product Name", "Product Image", "Size", "Quantity", "Unit Cost", "Unit Price", "Total Revenue", "Total Cost", "Net Profit", "Customer Name", "Customer Email", "Customer Phone", "Payment Method", "Status", "Notes"];
    sSheet.appendRow(sHeaders);
    sSheet.getRange(1, 1, 1, sHeaders.length).setFontWeight("bold").setBackground("#059669").setFontColor("#FFFFFF");
    sSheet.setFrozenRows(1);
  }

  const defaultSheet = ss.getSheetByName("Sheet1");
  if (defaultSheet && ss.getSheets().length > 1 && defaultSheet.getLastRow() === 0) {
    ss.deleteSheet(defaultSheet);
  }
}

function getProductsData(ss) {
  const sheet = ss.getSheetByName(SHEET_PRODUCTS);
  if (!sheet) return [];
  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];

  const products = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r[0]) continue;
    products.push({
      id: String(r[0]),
      name: String(r[1] || ''),
      category: String(r[2] || ''),
      color: String(r[3] || ''),
      costPrice: Number(r[4] || 0),
      sellingPrice: Number(r[5] || 0),
      sku: String(r[6] || ''),
      image: String(r[7] || ''),
      description: String(r[8] || ''),
      stock: {
        XS: Number(r[9] || 0),
        S: Number(r[10] || 0),
        M: Number(r[11] || 0),
        L: Number(r[12] || 0),
        XL: Number(r[13] || 0),
        '2XL': Number(r[14] || 0),
        '3XL': Number(r[15] || 0),
      },
      createdAt: r[17] ? new Date(r[17]).toISOString() : new Date().toISOString()
    });
  }
  return products;
}

function getSalesData(ss) {
  const sheet = ss.getSheetByName(SHEET_SALES);
  if (!sheet) return [];
  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return [];

  const sales = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    if (!r[0]) continue;
    sales.push({
      id: String(r[0]),
      date: r[1] ? new Date(r[1]).toISOString() : new Date().toISOString(),
      productId: String(r[2] || ''),
      productName: String(r[3] || ''),
      productImage: String(r[4] || ''),
      size: String(r[5] || 'M'),
      quantity: Number(r[6] || 1),
      unitCost: Number(r[7] || 0),
      unitPrice: Number(r[8] || 0),
      totalRevenue: Number(r[9] || 0),
      totalCost: Number(r[10] || 0),
      netProfit: Number(r[11] || 0),
      customerName: String(r[12] || ''),
      customerEmail: String(r[13] || ''),
      customerPhone: String(r[14] || ''),
      paymentMethod: String(r[15] || 'Cash'),
      status: String(r[16] || 'Completed'),
      notes: String(r[17] || '')
    });
  }
  return sales;
}

function recordSale(ss, sale) {
  const sSheet = ss.getSheetByName(SHEET_SALES);
  const pSheet = ss.getSheetByName(SHEET_PRODUCTS);

  const row = [
    sale.id,
    new Date(sale.date || Date.now()),
    sale.productId,
    sale.productName,
    sale.productImage || '',
    sale.size,
    sale.quantity,
    sale.unitCost,
    sale.unitPrice,
    sale.totalRevenue,
    sale.totalCost,
    sale.netProfit,
    sale.customerName || '',
    sale.customerEmail || '',
    sale.customerPhone || '',
    sale.paymentMethod || 'Cash',
    sale.status || 'Completed',
    sale.notes || ''
  ];
  sSheet.appendRow(row);

  decrementProductStock(pSheet, sale.productId, sale.size, sale.quantity);

  if (sale.customerEmail && sale.customerEmail.includes('@')) {
    sendCustomerEmailReceipt(sale);
  }

  return { status: 'success', message: 'Sale recorded and stock decremented!', saleId: sale.id };
}

function decrementProductStock(pSheet, productId, size, qty) {
  if (!pSheet) return;
  const sizeColIndex = SIZES.indexOf(size);
  if (sizeColIndex === -1) return;
  
  const colToUpdate = 10 + sizeColIndex;
  const data = pSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(productId)) {
      const currentStock = Number(data[i][colToUpdate - 1]) || 0;
      const newStock = Math.max(0, currentStock - qty);
      pSheet.getRange(i + 1, colToUpdate).setValue(newStock);
      
      let sum = 0;
      for (let s = 0; s < SIZES.length; s++) {
        const val = s === sizeColIndex ? newStock : (Number(data[i][10 + s - 1]) || 0);
        sum += val;
      }
      pSheet.getRange(i + 1, 17).setValue(sum);
      break;
    }
  }
}

function updateProductStock(ss, productId, size, newQty) {
  const pSheet = ss.getSheetByName(SHEET_PRODUCTS);
  const sizeColIndex = SIZES.indexOf(size);
  if (sizeColIndex === -1) return { status: 'error', message: 'Invalid size' };
  
  const colToUpdate = 10 + sizeColIndex;
  const data = pSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(productId)) {
      pSheet.getRange(i + 1, colToUpdate).setValue(Number(newQty));
      return { status: 'success', message: 'Stock updated' };
    }
  }
  return { status: 'error', message: 'Product not found' };
}

function saveOrUpdateProduct(ss, product) {
  const pSheet = ss.getSheetByName(SHEET_PRODUCTS);
  const data = pSheet.getDataRange().getValues();
  let foundRow = -1;

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(product.id)) {
      foundRow = i + 1;
      break;
    }
  }

  const stock = product.stock || {};
  let totalStock = 0;
  SIZES.forEach(s => totalStock += Number(stock[s] || 0));

  const rowData = [
    product.id,
    product.name,
    product.category || '',
    product.color || '',
    Number(product.costPrice || 0),
    Number(product.sellingPrice || 0),
    product.sku || '',
    product.image || '',
    product.description || '',
    Number(stock.XS || 0),
    Number(stock.S || 0),
    Number(stock.M || 0),
    Number(stock.L || 0),
    Number(stock.XL || 0),
    Number(stock['2XL'] || 0),
    Number(stock['3XL'] || 0),
    totalStock,
    product.createdAt || new Date().toISOString()
  ];

  if (foundRow > 0) {
    pSheet.getRange(foundRow, 1, 1, rowData.length).setValues([rowData]);
  } else {
    pSheet.appendRow(rowData);
  }

  return { status: 'success', message: 'Product saved successfully!' };
}

function deleteProduct(ss, productId) {
  const pSheet = ss.getSheetByName(SHEET_PRODUCTS);
  const data = pSheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(productId)) {
      pSheet.deleteRow(i + 1);
      return { status: 'success', message: 'Product deleted' };
    }
  }
  return { status: 'error', message: 'Product not found' };
}

function syncAllData(ss, products, sales) {
  const pSheet = ss.getSheetByName(SHEET_PRODUCTS);
  if (products && products.length > 0) {
    if (pSheet.getLastRow() > 1) {
      pSheet.getRange(2, 1, pSheet.getLastRow() - 1, pSheet.getLastColumn()).clearContent();
    }
    products.forEach(p => saveOrUpdateProduct(ss, p));
  }
  return { status: 'success', message: 'Full sync completed!' };
}

function sendCustomerEmailReceipt(sale) {
  try {
    const subject = "Receipt for your T-Shirt Order #" + sale.id;
    const bodyHtml = \`
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="background: #0f172a; color: #ffffff; padding: 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 22px;">Thank You for Your Order!</h1>
          <p style="margin: 4px 0 0 0; opacity: 0.8; font-size: 13px;">Order #${sale.id}</p>
        </div>
        <div style="padding: 24px; background: #ffffff;">
          <p>Hi <strong>\${sale.customerName || 'Customer'}</strong>,</p>
          <p>Here is your purchase confirmation:</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; width: 80px;">
                <img src="\${sale.productImage || 'https://via.placeholder.com/100'}" alt="T-Shirt" style="width: 70px; height: 70px; object-fit: cover; border-radius: 6px;" />
              </td>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; vertical-align: middle;">
                <h4 style="margin: 0 0 4px 0; font-size: 15px;">\${sale.productName}</h4>
                <p style="margin: 0; color: #64748b; font-size: 13px;">Size: <strong>\${sale.size}</strong> | Qty: <strong>\${sale.quantity}</strong></p>
                <p style="margin: 4px 0 0 0; font-weight: bold; color: #0f172a;">$\${Number(sale.unitPrice).toFixed(2)} each</p>
              </td>
            </tr>
          </table>
          <div style="margin-top: 20px; background: #f8fafc; padding: 14px; border-radius: 6px; font-size: 14px;">
            <div style="display: flex; justify-content: space-between; font-weight: bold; color: #0f172a;">
              <span>Total Paid:</span>
              <span style="color: #059669;">$\${Number(sale.totalRevenue).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    \`;
    MailApp.sendEmail({
      to: sale.customerEmail,
      subject: subject,
      htmlBody: bodyHtml
    });
  } catch (e) {
    Logger.log("Email error: " + e);
  }
}
