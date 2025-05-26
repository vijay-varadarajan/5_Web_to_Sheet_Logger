// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'saveToSheet') {
    console.log('Received saveToSheet request:', request);
    
    // Get the script URL from storage
    chrome.storage.sync.get(['scriptUrl'], function(result) {
      console.log('Retrieved script URL:', result.scriptUrl);
      
      if (!result.scriptUrl) {
        console.error('Google Apps Script URL not configured');
        return;
      }

      // Handle both single and multiple highlights
      const highlights = Array.isArray(request.data) ? request.data : [request.data];
      console.log('Prepared highlights data:', highlights);

      // Send data to Google Apps Script
      fetch(result.scriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ highlights: highlights })
      })
      .then(response => {
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        return response.text().then(text => {
          try {
            return JSON.parse(text);
          } catch (e) {
            console.log('Raw response text:', text);
            throw e;
          }
        });
      })
      .then(data => {
        console.log('Success:', data);
        // Send response back to content script
        sendResponse({ success: true, data: data });
      })
      .catch(error => {
        console.error('Error details:', error);
        console.error('Error stack:', error.stack);
        // Send error back to content script
        sendResponse({ success: false, error: error.message });
      });

      // Return true to indicate we'll send a response asynchronously
      return true;
    });
  }
}); 