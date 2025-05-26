// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'saveToSheet') {
    // Get the script URL from storage
    chrome.storage.sync.get(['scriptUrl'], function(result) {
      if (!result.scriptUrl) {
        console.error('Google Apps Script URL not configured');
        return;
      }

      // Send data to Google Apps Script
      fetch(result.scriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request.data)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Success:', data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    });
  }
}); 