const puppeteer = require('puppeteer');

async function scrapeEvents() {
  try {
    // Launch the headless browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Go to the Org Central Events page
    await page.goto('https://orgcentral.psu.edu/events', {
      waitUntil: 'networkidle2',  // Wait until the page is fully loaded
    });

    // Extract the event data
    const events = await page.evaluate(() => {
      const eventElements = document.querySelectorAll('#event-discovery-list a');
      const eventsArray = [];

      eventElements.forEach(event => {
        const title = event.innerText.trim();
        const link = `https://orgcentral.psu.edu${event.getAttribute('href')}`;
        eventsArray.push({
          title,
          link
        });
      });

      return eventsArray;
    });

    console.log(events);

    // Close the browser
    await browser.close();

    return events;
  } catch (error) {
    console.error('Error scraping events:', error);
  }
}

module.exports = scrapeEvents;
