document.addEventListener('DOMContentLoaded', function() {
  const scriptUrlInput = document.getElementById('scriptUrl');
  const saveButton = document.getElementById('saveConfig');
  const statusDiv = document.getElementById('status');

  // Load saved URL
  chrome.storage.sync.get(['scriptUrl'], function(result) {
    if (result.scriptUrl) {
      scriptUrlInput.value = result.scriptUrl;
    }
  });

  // Save URL
  saveButton.addEventListener('click', function() {
    const scriptUrl = scriptUrlInput.value.trim();
    
    if (!scriptUrl) {
      showStatus('Please enter a valid URL', 'error');
      return;
    }

    chrome.storage.sync.set({ scriptUrl: scriptUrl }, function() {
      showStatus('Configuration saved successfully!', 'success');
    });
  });

  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = type;
    setTimeout(() => {
      statusDiv.textContent = '';
      statusDiv.className = '';
    }, 3000);
  }
}); 