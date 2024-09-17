//webName takes manga name defined by user from index.js
var webName = require('./index.js');
const axios = require('axios');
const cheerio = require('cheerio');
const scraperObject = {
	url: 'https://mangafire.to/filter?keyword='+webName.mangaName,
	async scraper(browser){
		let page = await browser.newPage();
		console.log(`Navigating to ${this.url}...`);
		await page.goto(this.url);

		const { data } = await axios.get(this.url);

		const $ = cheerio.load(data);

		//Get all the manga links from the first page
		//Can modify this to also get the thmbnails of the mangas later to show user
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
		await page.goto(newUrl);

		const response  = await axios.get(newUrl);

		const $i = cheerio.load(response.data);

		const chapters = [];
		$i('li.item').each((j, elems) => {
			const chapterInfo = $(elems).find('span').text();
			const chapterLink = $(elems).find('a').attr('href');
			chapters.push({chapterInfo,chapterLink});
		});
		console.log(chapters[0]);
		//chapters list contains all chapter names and release dates
	}
}

module.exports = scraperObject;