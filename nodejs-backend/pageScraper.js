const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const axios = require('axios');

const scraperObject = {
    async scraper(browser, mangaName) {
        const page = await browser.newPage();
        const url = `https://mangafire.to/filter?keyword=${encodeURIComponent(mangaName)}`;
        console.log(`Navigating to ${url}...`);
        await page.goto(url);

        // Scraping logic
        const content = await page.content();
        const $ = cheerio.load(content);

		const results = [];
		$('div.inner').each((i, elem) => {
			const link = $(elem).find('a').attr('href');
			results.push(link);
		});

		//Right now this goes to the first search result immediatly
		//In future backend will not navigate to these pages
		//It will only feed this info to React frontend
		//Which will prompt user with the first 3 search results
		//And ask which one is right, then it will navigate to that page and scrape the data from that page
		const newUrl = 'https://mangafire.to'+results[0]
		//await page.goto(newUrl);

		const response  = await axios.get(newUrl);

		const $i = cheerio.load(response.data);

		const chapters = [];
		$i('li.item').each((j, elems) => {
			const chapterInfo = $(elems).find('span').text();
			const chapterLink = $(elems).find('a').attr('href');
			chapters.push({chapterInfo,chapterLink});
		});

        await page.close(); // Close the page after scraping
        return chapters; // Return the scraped chapters
    }
};

module.exports = scraperObject; // Ensure this line is correct
