const pageScraper = require('./pageScraper'); // Import the scraper module
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer'); // Import Puppeteer for browser automation

const app = express();
let chapterInfo = []; // Store chapter info after scraping
let searchResults = [];
// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse JSON request bodies


app.post('/search', async (req, res) => {
    const { mangaName } = req.body; // Extract the manga name from the request body
    try {
        searchResults = await pageScraper.search(mangaName); // Scrape chapters
        res.json({ results: searchResults });
    } catch (err) {
        console.error("Error during scraping:", err);
        res.status(500).json({ message: "Failed to fetch chapters." });
    }
});
app.get("/search", (req, res) => {
	res.json({ results: searchResults });
  });


// Endpoint to scrape data and fetch chapters based on manga url
app.post('/message', async (req, res) => {
    const { mangaUrl } = req.body;
    console.log(mangaUrl);
    try {
        chapterInfo = await pageScraper.scraper(mangaUrl); // Scrape chapters
        // Send the scraped chapter info back to the client
        res.json({ message: chapterInfo });
    } catch (err) {
        console.error("Error during scraping:", err);
        res.status(500).json({ message: "Failed to fetch chapters." });
    }
});

app.get("/message", (req, res) => {
	res.json({ message: chapterInfo });
  });
// Start the server on port 8000
app.listen(8000, () => {
    console.log("Server is running on port 8000.");
});