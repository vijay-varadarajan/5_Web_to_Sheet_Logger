let saveButton = null;
let bulkSaveButton = null;
let selectedHighlights = [];

// Debug logging function
function debugLog(action, data = null) {
  console.log(`[Web-to-Sheet Debug] ${action}`, data || '');
}

// Create and append the save buttons to the page
function createButtons() {
  debugLog('Creating buttons');
  if (!saveButton) {
    debugLog('Creating save button container');
    saveButton = document.createElement('div');
    saveButton.className = 'wts-save-container';
    saveButton.innerHTML = `
      <button class="wts-save-button">Save to Sheet</button>
    `;
    document.body.appendChild(saveButton);

    // Add event listener for save button
    saveButton.querySelector('.wts-save-button').addEventListener('click', function(e) {
      debugLog('Save button clicked');
      e.stopPropagation(); // Prevent event bubbling
      handleSaveButtonClick();
    });
  }

  if (!bulkSaveButton) {
    debugLog('Creating bulk save button');
    bulkSaveButton = document.createElement('div');
    bulkSaveButton.className = 'wts-bulk-save';
    bulkSaveButton.innerHTML = `
      <span class="wts-counter">0</span>
      <button class="wts-bulk-button">Save All Highlights</button>
    `;
    document.body.appendChild(bulkSaveButton);

    // Add click handler for bulk save
    bulkSaveButton.querySelector('.wts-bulk-button').addEventListener('click', function() {
      debugLog('Bulk save button clicked');
      showBulkSaveDialog();
    });
  }
}

// Position the save button near the selection
function positionSaveButton(selection) {
  debugLog('Positioning save button', { selection });
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  
  saveButton.style.top = `${window.scrollY + rect.bottom + 10}px`;
  saveButton.style.left = `${window.scrollX + rect.left}px`;
  saveButton.style.display = 'block';
  debugLog('Save button positioned');
}

// Handle save button click
function handleSaveButtonClick() {
  debugLog('Handling save button click');
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();
  
  if (selectedText) {
    const highlight = {
      text: selectedText,
      url: window.location.href,
      title: document.title,
      timestamp: new Date().toISOString(),
      tags: [] // Initialize with empty tags array
    };

    debugLog('Adding highlight', highlight);

    // Add to highlights array
    selectedHighlights.push(highlight);
    updateCounter();

    // Hide the save button
    saveButton.style.display = 'none';
    debugLog('Highlight added and save button hidden');
  }
}

// Update the counter
function updateCounter() {
  debugLog('Updating counter', { count: selectedHighlights.length });
  const counter = bulkSaveButton.querySelector('.wts-counter');
  counter.textContent = selectedHighlights.length;
  
  // Show/hide bulk save button based on selection count
  if (selectedHighlights.length > 0) {
    bulkSaveButton.style.display = 'flex';
  } else {
    bulkSaveButton.style.display = 'none';
  }
}

// Show bulk save dialog
function showBulkSaveDialog() {
  debugLog('Showing bulk save dialog');
  const dialog = document.createElement('div');
  dialog.className = 'wts-dialog';
  dialog.innerHTML = `
    <div class="wts-dialog-content">
      <h3>Review Highlights</h3>
      <div class="wts-highlights-list"></div>
      <div class="wts-dialog-buttons">
        <button class="wts-cancel">Cancel</button>
        <button class="wts-confirm">Save All</button>
      </div>
    </div>
  `;

  const highlightsList = dialog.querySelector('.wts-highlights-list');
  
  // Add each highlight with its tags
  selectedHighlights.forEach((highlight, index) => {
    debugLog('Adding highlight to dialog', { index, highlight });
    const highlightElement = document.createElement('div');
    highlightElement.className = 'wts-dialog-highlight';
    highlightElement.innerHTML = `
      <div class="wts-dialog-text">${highlight.text}</div>
      <div class="wts-dialog-tags">
        <input type="text" class="wts-dialog-tag-input" placeholder="Add tag...">
        <button class="wts-dialog-add-tag">+</button>
      </div>
      <div class="wts-dialog-tag-list"></div>
    `;

    // Add existing tags
    highlight.tags.forEach(tag => {
      debugLog('Adding existing tag to dialog', { tag });
      addTagToElement(highlightElement.querySelector('.wts-dialog-tag-list'), tag);
    });

    // Add tag input functionality
    const tagInput = highlightElement.querySelector('.wts-dialog-tag-input');
    const addTagButton = highlightElement.querySelector('.wts-dialog-add-tag');
    
    tagInput.addEventListener('keypress', function(e) {
      debugLog('Dialog tag input keypress', { key: e.key });
      if (e.key === 'Enter') {
        addTagToHighlight(highlightElement, tagInput, highlight);
      }
    });
    
    addTagButton.addEventListener('click', function() {
      debugLog('Dialog add tag button clicked');
      addTagToHighlight(highlightElement, tagInput, highlight);
    });

    highlightsList.appendChild(highlightElement);
  });

  // Add event listeners for dialog buttons
  dialog.querySelector('.wts-cancel').addEventListener('click', function() {
    debugLog('Dialog cancel clicked');
    dialog.remove();
  });

  dialog.querySelector('.wts-confirm').addEventListener('click', function() {
    debugLog('Dialog confirm clicked');
    // Update tags for each highlight
    const highlightElements = dialog.querySelectorAll('.wts-dialog-highlight');
    highlightElements.forEach((element, index) => {
      const tags = Array.from(element.querySelectorAll('.wts-dialog-tag'))
        .map(tag => tag.textContent.trim().slice(0, -1));
      debugLog('Updating highlight tags', { index, tags });
      selectedHighlights[index].tags = tags;
    });

    // Save all highlights
    saveAllHighlights();
    dialog.remove();
  });

  document.body.appendChild(dialog);
}

// Add tag to highlight in dialog
function addTagToHighlight(highlightElement, tagInput, highlight) {
  const tag = tagInput.value.trim();
  debugLog('Adding tag to highlight in dialog', { tag });
  if (tag) {
    addTagToElement(highlightElement.querySelector('.wts-dialog-tag-list'), tag);
    tagInput.value = '';
  }
}

// Add tag element to a container
function addTagToElement(container, tag) {
  debugLog('Adding tag element', { container, tag });
  const tagElement = document.createElement('span');
  tagElement.className = 'wts-dialog-tag';
  tagElement.innerHTML = `
    ${tag}
    <span class="wts-tag-remove"> ×</span>
  `;
  container.appendChild(tagElement);

  // Add remove functionality
  tagElement.querySelector('.wts-tag-remove').addEventListener('click', function(e) {
    e.stopPropagation(); // Prevent event bubbling
    debugLog('Removing tag element', { tag });
    tagElement.remove();
  });
}

// Save all highlights
function saveAllHighlights() {
  if (selectedHighlights.length === 0) {
    debugLog('No highlights to save');
    return;
  }

  debugLog('Saving all highlights', selectedHighlights);

  // Send all highlights to background script
  chrome.runtime.sendMessage({
    action: 'saveToSheet',
    data: selectedHighlights
  }, response => {
    debugLog('Response from background script', response);
  });

  // Clear the highlights array
  selectedHighlights = [];
  updateCounter();
  debugLog('Highlights cleared');
}

// Handle text selection
document.addEventListener('mouseup', function(e) {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();
  
  debugLog('Text selection', { selectedText });
  
  if (selectedText) {
    createButtons();
    positionSaveButton(selection);
  } else if (saveButton && !saveButton.contains(e.target)) {
    debugLog('Hiding save button');
    saveButton.style.display = 'none';
  }
}); 