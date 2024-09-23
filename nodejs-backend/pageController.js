const pageScraper = require('./pageScraper'); // Import the scraper module
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer'); // Import Puppeteer for browser automation

const app = express();
let chapterInfo = []; // Store chapter info after scraping

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse JSON request bodies

// Function to launch the browser
async function launchBrowser() {
    const browser = await puppeteer.launch({ headless: true }); // Set headless to false for debugging
    return browser;
}

// Endpoint to scrape data and fetch chapters based on manga name
app.post('/message', async (req, res) => {
    const { mangaName } = req.body; // Extract the manga name from the request body

    try {
        const browserInstance = await launchBrowser(); // Launch the browser
        chapterInfo = await pageScraper.scraper(browserInstance, mangaName); // Scrape chapters
        await browserInstance.close(); // Close the browser after scraping
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
