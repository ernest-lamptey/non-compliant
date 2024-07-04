const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');

puppeteer.use(StealthPlugin());

const companyContacts = []
async function scrapeCompanyAddress(companyName) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.setDefaultTimeout(15000)

  try {
    // Go to the website
    await page.goto(`https://www.dnb.com/site-search-results.html#BusinessDirectoryPageNumber=1&BusinessDirectorySearch=${encodeURI(companyName)}&ContactDirectoryPageNumber=1&MarketplacePageNumber=1&SiteContentPageNumber=1&tab=Business%20Directory`);

    await page.waitForSelector('#truste-consent-button')

    await page.click('#truste-consent-button')

    // // Wait for the search input to be rendered
    console.log(`company name: ${companyName}`)
    await page.waitForSelector('.z_20f9dcf9d844d2bf_tableCompanyNameLink', { timeout: 5_000} );
    await page.click('.z_20f9dcf9d844d2bf_tableCompanyNameLink');
      
    // Wait for the search results to load and display the results
    await page.waitForSelector('.company_profile_overview_body', { timeout: 5_000});

    // // Extract the address of the first result
    const address = await page.evaluate(() => {
      const firstResult = document.querySelector('#hero-company-link');
      if (firstResult) {
        return firstResult.href
      } else {
        return 'Address not found';
      }
    });

    console.log(`Result: ${address}`)
    companyContacts.push({company: companyName, website: address});
  } catch (error) {
    companyContacts.push({company: companyName, website: 'Company not found'});
    console.error("Something went wrong: ")
  } finally {
    await browser.close();
  }

}

async function run () {
  const farm = JSON.parse(fs.readFileSync('nursery-greenhouse.json', 'utf8'));
  // Replace 'Company Name' with the name of the company you want to search for
  for (let company of farm) {
    try {
      await scrapeCompanyAddress(company.company);
    } catch (error) {
      console.error("Something went wrong");
    }
  }
}

async function main() {
  await run();
  fs.writeFileSync('company-contacts.json', JSON.stringify(companyContacts, null, 2));
  console.log('Data written to file');
  process.exit();
}

main();