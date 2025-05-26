function doPost(e) {
    try {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      var data = JSON.parse(e.postData.contents);
      
      // Handle both single and multiple highlights
      var highlights = data.highlights || [data];
      
      // Add each highlight as a new row
      highlights.forEach(function(highlight) {
        sheet.appendRow([
          highlight.timestamp,
          highlight.text,
          highlight.url,
          highlight.title,
          highlight.tags ? highlight.tags.join(', ') : '' // Add tags as comma-separated string
        ]);
      });
      
      return ContentService.createTextOutput(JSON.stringify({ 
        'result': 'success',
        'count': highlights.length 
      }))
      .setMimeType(ContentService.MimeType.JSON);
    } catch(error) {
      return ContentService.createTextOutput(JSON.stringify({ 
        'result': 'error',
        'error': error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
    }
  }