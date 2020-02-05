const cheerio = require('cheerio');
const gc = require('../constants/constants').global_constants;

const reGeneralCheck = /^[A-Za-z0-9-:,/ ]{0,30}$/;

/*
 * Returns an array containing an array of worksheets, each worksheet containing
 * each row as an array. Example below with ws=worksheet, r=row
 * e.g. return: [ [[ws1r1],[ws1r2],[ws1r3]], [[ws2r1],[ws2r2],[ws2r3]], ... ]
 */
const scrapeGoogleSheetData = (html) => {
  const $ = cheerio.load(html);
  const allData = [];

  $('table.waffle').each((i, worksheet) => {
    const worksheetData = [];
    $(worksheet).find('tbody').find('tr').each((j, row) => {
      const item = $(row).find('td');
      const rowData = gatherRowData(item, i, j);
      worksheetData.push(rowData);
    });
    allData.push(worksheetData);
  });
  return allData;
}

// Some <td> cells have childrens for unknown reasons..
const findYoungestChild = (item) => {
  const hasChild = item.children().length > 0;
  if (!hasChild) return item;
  return findYoungestChild(item.children());
}

const gatherRowData = (item, i, j) => {
  const rowData = [];
  let col;

  for (col = 0; col < item.length; ++col){
    let colItem = item.eq(col);
    let colData = findYoungestChild(colItem);
    colData = colData.text().trim();
    const isEmpty = colData.length === 0;
    const isDataAllowed = reGeneralCheck.exec(colData);
    if (isDataAllowed || isEmpty) rowData.push(colData);
    else {
      rowData.push(gc.DISCARDED_DATA);
      console.log(`Worksheet ${i} at row ${j} at column ${col} contained non-allowed characters. It was replaced with ${gc.DISCARDED_DATA}.`);
    }
  }

  return rowData;
}

module.exports = {
  scrapeGoogleSheetData: scrapeGoogleSheetData
}