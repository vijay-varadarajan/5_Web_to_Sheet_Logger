# Web to Sheet Logger Chrome Extension

A Chrome extension that allows users to highlight text on any webpage and save it to a Google Sheet along with metadata (timestamp, page URL, and tags).

## Features

- Highlight text(s) on any webpage
- Save highlighted text(s) with metadata to Google Sheets
- Add tags to organize your highlights
- Bulk save multiple highlights at once
- Simple and intuitive user interface

## Installation

1. **Clone or download this repository**

2. **Set up Google Apps Script**
   - Go to [Google Apps Script](https://script.google.com)
   - Create a new project
   - Copy and paste the code from `google-apps-script.js` in this repository
   - Deploy as a web app:
     - Click "Deploy" > "New deployment"
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

1. **Select Text**
   - Highlight any text - single or multiple - on a webpage
   - A "Save to Sheet" button will appear below the selection

2. **Save Highlights**
   - Click "Save to Sheet" to add the highlight to your collection
   - A counter in the bottom right shows how many highlights you've collected

3. **Add Tags and Save**
   - Click "Save All Highlights" when ready
   - In the review dialog:
     - Add tags to organize your highlights
     - Review all highlights
     - Click "Save All" to save everything to your Google Sheet

## Data Format

The extension saves the following data to your Google Sheet:
- Timestamp
- Selected text
- Page URL
- Page title
- Tags (comma-separated)

## Configuration

Google Apps Script URL:
```
https://script.google.com/home/projects/1z0bu0NIrQY3yfYUl8XJZBbJzAnYjvgVhKRUH6RLB8lE3EkJunjizSh2J/edit
```
```
https://script.google.com/macros/s/AKfycbxTejx7HtJ2wdqCs7FeigoJDIVLqw3clMQv7Gyshzxg2cpT1_qvA3d6cdW2ZnIIoH8WSQ/exec
```

Google Sheet URL:
```
https://docs.google.com/spreadsheets/d/167vSew0552M1YbQ1pJoYertV4nkc5uP6aJx4yf50KHE/edit?usp=sharing
```

## Support

For issues or feature requests, please create an issue in the repository. 