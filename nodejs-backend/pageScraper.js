const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const axios = require('axios');

const scraperObject = {
	
	async search(mangaName){
		//Fucntion to add manga search fucntionality
		const url = `https://mangafire.to/filter?keyword=${encodeURIComponent(mangaName)}`;
		const { data } = await axios.get(url);

        const $ = cheerio.load(data);

		const results = [];
		$('div.inner').each((i, elem) => {
			const link = $(elem).find('a').attr('href');
			const image = $(elem).find('img').attr('src');
			const title = $(elem).find('a:nth-child(2)').first().text();
			results.push({image,link,title});
		});

		return results; 
	},



    async scraper(newUrl) {

		const response  = await axios.get(newUrl);

		const $ = cheerio.load(response.data);

		const chapters = [];
		$('li.item').each((j, elems) => {
			const chapterInfo = $(elems).find('span').text();
			const chapterLink = $(elems).find('a').attr('href');
			chapters.push({chapterInfo,chapterLink});
		});

        return chapters; // Return the scraped chapters
    }
};

module.exports = scraperObject; 