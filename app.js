const request = require('request');
const fs = require('fs');

const scrapeToArray = require('./helpers/scrapeGoogleSheetData.js').scrapeGoogleSheetData;
const dataToJson = require('./helpers/scrapedDataToPrettyJson.js').scrapedDataAsPrettyJson;

// Google sheet must be in htmlview to be scrapeable ( /htmlview in url).
const coronaDataUrl = "https://docs.google.com/spreadsheets/d/1wQVypefm946ch4XDp37uZ-wartW4V7ILdg-qYiDXUHM/htmlview"

request(coronaDataUrl, (err, res, html) => {
  if (!err && res.statusCode == 200){
    const scrapedData = scrapeToArray(html);
    const scrapedDataAsPrettyJson = dataToJson(scrapedData);

    const fileContent = JSON.stringify(scrapedDataAsPrettyJson, null, 4);
    const filename = `coronavirus_data_${Date.now()}.json`;

    fs.writeFile(filename, fileContent, (err) => {
      if (err) throw err;
      console.log(`File ${filename} has been created and saved!`);
    });
  }
});

