let saveButton = null;
let bulkSaveButton = null;
let selectedHighlights = [];

// Create and append the save buttons to the page
function createButtons() {
  if (!saveButton) {
    saveButton = document.createElement('button');
    saveButton.className = 'web-to-sheet-save-button';
    saveButton.textContent = 'Save to Sheet';
    document.body.appendChild(saveButton);
  }

  if (!bulkSaveButton) {
    bulkSaveButton = document.createElement('div');
    bulkSaveButton.className = 'web-to-sheet-bulk-save';
    bulkSaveButton.innerHTML = `
      <span class="web-to-sheet-counter">0</span>
      <button class="web-to-sheet-bulk-button">Save All Highlights</button>
    `;
    document.body.appendChild(bulkSaveButton);

    // Add click handler for bulk save
    bulkSaveButton.querySelector('.web-to-sheet-bulk-button').addEventListener('click', saveAllHighlights);
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

// Update the counter
function updateCounter() {
  const counter = bulkSaveButton.querySelector('.web-to-sheet-counter');
  counter.textContent = selectedHighlights.length;
  
  // Show/hide bulk save button based on selection count
  if (selectedHighlights.length > 0) {
    bulkSaveButton.style.display = 'flex';
  } else {
    bulkSaveButton.style.display = 'none';
  }
}

// Save all highlights
function saveAllHighlights() {
  if (selectedHighlights.length === 0) return;

  console.log('Saving highlights:', selectedHighlights);

  // Send all highlights to background script
  chrome.runtime.sendMessage({
    action: 'saveToSheet',
    data: selectedHighlights
  }, response => {
    console.log('Response from background script:', response);
  });

  // Clear the highlights array
  selectedHighlights = [];
  updateCounter();
}

// Handle text selection
document.addEventListener('mouseup', function(e) {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();
  
  if (selectedText) {
    createButtons();
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
      const highlight = {
        text: selectedText,
        url: window.location.href,
        title: document.title,
        timestamp: new Date().toISOString()
      };

      console.log('Adding highlight:', highlight);

      // Add to highlights array
      selectedHighlights.push(highlight);
      updateCounter();

      // Hide the single save button
      saveButton.style.display = 'none';
    }
  }
}); 