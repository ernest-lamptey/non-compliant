const puppeteer = require('puppeteer');
const fs = require('fs');
const csv = require('csv-parser');

async function scrape() {
  // Launch a new browser instance
  const browser = await puppeteer.launch({ headless: true });

  // Open a new page
  const page = await browser.newPage();

  // Navigate to the website
  await page.goto('https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/employers-non-compliant.html');

  // Wait for the necessary DOM to be rendered
  await page.waitForSelector('h1');

  // Extract the data
const data = await page.evaluate(() => {
  const table = document.querySelector('#table1');
  const body = table.querySelector('tbody');
  const rows = Array.from(body.querySelectorAll('tr')).map(row => row.innerText);
  const nonCompliant = rows.map(item => {
    const [company, legalName, address] = item.split('\t');
    return { company, legalName, address };
  });
  return nonCompliant;
});

  // Print the data
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));

  // Close the browser
  await browser.close();
}

// // Run the scrape function
// scrape().catch(console.error);


function extractItems() {
  const results = []

  fs.createReadStream('companies.csv')
  .pipe(csv({
    headers: false
  }))
  .on('data', (data) => {
    const row = Object.values(data);
    if (row[4] === '9617-Labourers in food, beverage and associated products processing' && parseInt(row[row.length - 1]) > 9) {
      results.push({district: row[0], type: row[1], company: row[2], address: row[3], noc: row[4], available: parseInt(row[row.length - 1])});
    }
  })
  .on('end', () => {
    console.log(results);
    fs.writeFileSync('results.json', JSON.stringify(results, null, 2));
  });
}

// extractItems();