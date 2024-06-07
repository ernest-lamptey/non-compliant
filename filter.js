const fs = require('fs');

// Read the nursery-greenhouse.json file
const nurseryData = JSON.parse(fs.readFileSync('general-farm.json', 'utf8'));

// Read the non-compliant.json file
const nonCompliantData = JSON.parse(fs.readFileSync('non-compliant.json', 'utf8'));


// Create a set of non-compliant addresses for faster lookup
const nonCompliantAddresses = new Set(nonCompliantData.map(item => item.address));
const nonCompliantCompanies = new Set(nonCompliantData.map(item => item.company));
const nonCompliantLegalNames = new Set(nonCompliantData.map(item => item.legalName));

// Filter out the non-compliant addresses
const filteredData = nurseryData.filter(item => {
  return !nonCompliantAddresses.has(item.address) && !nonCompliantCompanies.has(item.company) && !nonCompliantLegalNames.has(item.legalName);
});

// Write the filtered data back to the nursery-greenhouse.json file
// fs.writeFileSync('data.json', JSON.stringify(filteredData, null, 2));

console.log('initial: ', nurseryData.length)
console.log('final: ', filteredData.length);
// fs.writeFileSync('non.json', JSON.stringify(restructuredNon, null, 2));
