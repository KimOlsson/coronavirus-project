const state_abbrevations = require('../constants/us_states').state_abbrevations;
const gc = require('../constants/constants').global_constants;

const scrapedDataAsPrettyJson = (dataList) => {

  const newDataList = removeTitlesFromList(dataList);
  const containsDiscardedData = newDataList.forEach(item => item.find(colValue => colValue === gc.DISCARDED_DATA));
  if (!containsDiscardedData) console.log(`\t-> Only non-relevant data contained ${gc.DISCARDED_DATA}, hence can be ignored!`);
  
  const coronaData = {};
  newDataList.forEach(sheet => {
    sheet.forEach(row => {
      [rawProvince, rawCountry, rawTime, infections, deaths, recoveries, ...rest] = row;
      if (new Date(rawTime) < gc.START_DATE) return;

      const time     = formatTime(rawTime);
      const country  = formatCountry(rawCountry);
      const province = formatProvince(rawProvince, country);

      const hasCountryTitle =  coronaData.hasOwnProperty(gc.COUNTRY);
      if (!hasCountryTitle)    coronaData[gc.COUNTRY] = {};
      
      const hasCountryKey =    coronaData[gc.COUNTRY].hasOwnProperty(country);
      if (!hasCountryKey)      coronaData[gc.COUNTRY][country] = {};

      const hasProvinceTitle = coronaData[gc.COUNTRY][country].hasOwnProperty(gc.PROVINCE);
      if (!hasProvinceTitle)   coronaData[gc.COUNTRY][country][gc.PROVINCE] = {};

      const hasProvinceKey =   coronaData[gc.COUNTRY][country][gc.PROVINCE].hasOwnProperty(province);
      if (!hasProvinceKey)     coronaData[gc.COUNTRY][country][gc.PROVINCE][province] = {};

      const hasEntriesKey =    coronaData[gc.COUNTRY][country][gc.PROVINCE][province].hasOwnProperty(gc.ENTRIES);
      if (!hasEntriesKey)      coronaData[gc.COUNTRY][country][gc.PROVINCE][province][gc.ENTRIES] = {};

      const hasTimeKey =       coronaData[gc.COUNTRY][country][gc.PROVINCE][province][gc.ENTRIES].hasOwnProperty(time);
      // Time keys are normally unique for each province, except for US since we save only state instead of city.
      const isDuplicateUSState = country === "United States" && hasTimeKey;
      if (!hasTimeKey)         coronaData[gc.COUNTRY][country][gc.PROVINCE][province][gc.ENTRIES][time] = {};

      const oldEntry = coronaData[gc.COUNTRY][country][gc.PROVINCE][province][gc.ENTRIES][time];
      let newEntry = buildNewEntry(infections, deaths, recoveries);

      if (isDuplicateUSState) newEntry = combineDuplicateUSStateEntry(newEntry, oldEntry);

      coronaData[gc.COUNTRY][country][gc.PROVINCE][province][gc.ENTRIES][time] = newEntry;

    });
  });

  return coronaData;
}

const formatTime = (time) => {
  const formatNumber = (d) => d > 9 ? d : "0" + d;

  let date = new Date(time);
  let m   = formatNumber(date.getMonth() + 1);
  let d   = formatNumber(date.getDate());
  let y   = formatNumber(date.getFullYear());
  let hh  = formatNumber(date.getHours());
  let mm  = formatNumber(date.getMinutes());
  
  return `${m}/${d}/${y} ${hh}:${mm}`;
}

const formatCountry = (country) => {
  let result = country;
  if (country === "US") result = "United States";
  else if (country === "China") result = "Mainland China";
  return result;
}

const formatProvince = (rawProvince, country) => {
  let province = (rawProvince.length > 0) ? rawProvince : gc.NOT_SPECIFIED;
  if (country === "United States" && province.includes(',')){
    province = province.split(',')[1].trim();
    province = state_abbrevations[province];
  }
  return province;
}



const buildNewEntry = (infections, deaths, recoveries) => {
  const toNum = (v) => v ? Number(v) : 0;
  return newEntry = {
    [gc.INFECTIONS]:   toNum(infections),
    [gc.DEATHS]:       toNum(deaths),
    [gc.RECOVERIES]:   toNum(recoveries)
  };
}

const combineDuplicateUSStateEntry = (newEntry, oldEntry) => {
  return combinedEntry = {
    [gc.INFECTIONS]: (newEntry[gc.INFECTIONS] + oldEntry[gc.INFECTIONS]),
    [gc.DEATHS]:     (newEntry[gc.DEATHS]     + oldEntry[gc.DEATHS]),
    [gc.RECOVERIES]: (newEntry[gc.RECOVERIES] + oldEntry[gc.RECOVERIES])
  };
}

const removeTitlesFromList = (dataList) => dataList.map(item => item.slice(1));

module.exports = {
  scrapedDataAsPrettyJson: scrapedDataAsPrettyJson
};