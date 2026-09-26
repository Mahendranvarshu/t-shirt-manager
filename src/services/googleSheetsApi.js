// Google Sheets Web App API Integration Service

export const testGoogleSheetConnection = async (webAppUrl) => {
  if (!webAppUrl || !webAppUrl.startsWith('https://script.google.com/')) {
    return { success: false, message: 'Invalid URL. Must start with https://script.google.com/' };
  }

  try {
    const url = new URL(webAppUrl);
    url.searchParams.set('action', 'ping');
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      redirect: 'follow',
    });

    if (response.ok) {
      const data = await response.json();
      if (data.status === 'success') {
        return { success: true, message: data.message || 'Connected to Google Sheets!' };
      }
    }
    return { success: false, message: 'Received response, but status was not success.' };
  } catch (error) {
    // If CORS restricted direct read, check if URL format is valid
    console.warn('Google Sheet ping error:', error);
    return {
      success: false,
      message: 'Could not connect directly. Ensure your Web App deployment is set to "Who has access: Anyone". Error: ' + error.message
    };
  }
};

export const fetchFromGoogleSheet = async (webAppUrl) => {
  if (!webAppUrl) return null;
  try {
    const url = new URL(webAppUrl);
    url.searchParams.set('action', 'getAll');
    const response = await fetch(url.toString(), {
      method: 'GET',
      redirect: 'follow',
    });
    if (response.ok) {
      const data = await response.json();
      if (data.status === 'success') {
        return { products: data.products || [], sales: data.sales || [] };
      }
    }
    return null;
  } catch (err) {
    console.error('Failed to fetch from Google Sheets:', err);
    return null;
  }
};

export const postToGoogleSheet = async (webAppUrl, payload) => {
  if (!webAppUrl) return { success: false, message: 'No Google Sheet URL provided' };

  try {
    const response = await fetch(webAppUrl, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // Using text/plain avoids browser CORS preflight issues with Google Apps Script
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      try {
        const resData = await response.json();
        return { success: true, data: resData };
      } catch {
        return { success: true, message: 'Request accepted by Google Sheet.' };
      }
    }
    return { success: false, message: 'Server returned HTTP ' + response.status };
  } catch (err) {
    console.error('Google Sheet POST error:', err);
    return { success: false, message: err.message };
  }
};
