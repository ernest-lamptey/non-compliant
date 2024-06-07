const puppeteer = require('puppeteer');

async function scrapeCompanyAddress(companyName) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // Go to the website
  await page.goto(`https://www.dnb.com/site-search-results.html#BusinessDirectoryPageNumber=1&BusinessDirectorySearch=${encodeURI(companyName)}&ContactDirectoryPageNumber=1&MarketplacePageNumber=1&SiteContentPageNumber=1&tab=Business%20Directory`);

  
  await page.waitForSelector('#truste-consent-button')

  await page.click('#truste-consent-button')

  // // Wait for the search input to be rendered
  await page.waitForSelector('.z_20f9dcf9d844d2bf_tableCompanyNameLink');
  await page.click('.z_20f9dcf9d844d2bf_tableCompanyNameLink');
    
  
  // await page.waitForNavigation();
  // await page.keyboard.press('Enter');




  // Wait for the search results to load and display the results
  await page.waitForSelector('.company_profile_overview_body');

  // // Extract the address of the first result
  const address = await page.evaluate(() => {
    const firstResult = document.querySelector('#hero-company-link');
    if (firstResult) {
      return firstResult.href
    } else {
      return 'Address not found';
    }
  });

  console.log(`Address for ${companyName}: ${address}`);

  // await browser.close();
}

// Replace 'Company Name' with the name of the company you want to search for
scrapeCompanyAddress("GAVIN'S STOCK FARM").catch(console.error);
