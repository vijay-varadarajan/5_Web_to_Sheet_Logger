# Web to Sheet Logger Chrome Extension

A Chrome extension that allows users to highlight text on any webpage and save it to a Google Sheet along with metadata (timestamp and page URL).

## Features

- Highlight text on any webpage
- Save highlighted text with metadata to Google Sheets
- Simple and intuitive user interface
- Configurable Google Apps Script URL

## Setup Instructions

1. **Create a Google Apps Script**

   Create a new Google Apps Script project with the following code:

   ```javascript
   function doPost(e) {
     var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     var data = JSON.parse(e.postData.contents);
     
     sheet.appendRow([
       data.timestamp,
       data.text,
       data.url,
       data.title
     ]);
     
     return ContentService.createTextOutput(JSON.stringify({ 'result': 'success' }))
       .setMimeType(ContentService.MimeType.JSON);
   }
   ```

2. **Deploy the Google Apps Script**
   - Click on "Deploy" > "New deployment"
   - Choose "Web app"
   - Set "Execute as" to your account
   - Set "Who has access" to "Anyone"
   - Click "Deploy"
   - Copy the Web App URL

3. **Install the Chrome Extension**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the extension directory
   - Click the extension icon and paste your Google Apps Script Web App URL

## Usage

1. Select any text on a webpage
2. Click the "Save to Sheet" button that appears
3. The text and metadata will be saved to your Google Sheet

## Data Format

The extension saves the following data to your Google Sheet:
- Timestamp
- Selected text
- Page URL
- Page title

## Support

For issues or feature requests, please create an issue in the repository. 