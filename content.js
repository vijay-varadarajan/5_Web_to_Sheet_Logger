let saveButton = null;

// Create and append the save button to the page
function createSaveButton() {
  if (!saveButton) {
    saveButton = document.createElement('button');
    saveButton.className = 'web-to-sheet-save-button';
    saveButton.textContent = 'Save to Sheet';
    document.body.appendChild(saveButton);
  }
}

// Position the save button near the selection
function positionSaveButton(selection) {
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  
  saveButton.style.top = `${window.scrollY + rect.bottom + 10}px`;
  saveButton.style.left = `${window.scrollX + rect.left}px`;
  saveButton.style.display = 'block';
}

// Handle text selection
document.addEventListener('mouseup', function(e) {
  const selection = window.getSelection();
  
  if (selection.toString().trim()) {
    createSaveButton();
    positionSaveButton(selection);
  } else if (saveButton && !saveButton.contains(e.target)) {
    saveButton.style.display = 'none';
  }
});

// Handle save button click
document.addEventListener('click', function(e) {
  if (e.target.className === 'web-to-sheet-save-button') {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (selectedText) {
      const data = {
        text: selectedText,
        url: window.location.href,
        title: document.title,
        timestamp: new Date().toISOString()
      };

      // Send message to background script
      chrome.runtime.sendMessage({
        action: 'saveToSheet',
        data: data
      });

      // Hide the button after saving
      saveButton.style.display = 'none';
    }
  }
}); 