import express from 'express';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
import { Log } from '../Logging Middleware/logger.js'; 

const app = express();

const PORT = 3000;
const HOSTNAME = `http://localhost:${PORT}`;


const urlMap = new Map();        
const statsMap = new Map();      

app.use(Log);
app.use(bodyParser.json());

// Utility: Generate shortcode
function generateShortCode() {
    return uuidv4().slice(0, 6); 
}

// Utility: Expiry check
function isExpired(expiry) {
    return new Date() > new Date(expiry);
}

// POST /shorturls

app.post('/shorturls', (req, res) => {
    const { url, validity = 30, shortcode } = req.body;

    // Validate URL
    try {
        new URL(url);
    } catch {
        return res.status(400).json({ error: 'Invalid URL format' });
    }

    const code = shortcode || generateShortCode();

    if (urlMap.has(code)) {
        return res.status(409).json({ error: 'Shortcode already exists' });
    }

    const expiry = new Date(Date.now() + validity * 60000).toISOString();
    const createdAt = new Date().toISOString();

    // Save mappings
    urlMap.set(code, { url, expiry, createdAt, clickCount: 0 });
    statsMap.set(code, []);

    return res.status(201).json({
        shortLink: `${HOSTNAME}/${code}`,
        expiry
    });
});

app.get('/', (req, res) => {
    res.send("Welcome to Url Shortner");
})


// GET /:shortcode

app.get('/:shortcode', (req, res) => {
    const code = req.params.shortcode;
    const entry = urlMap.get(code);

    if (!entry) {
        return res.status(404).json({ error: 'Shortcode not found' });
    }

    if (isExpired(entry.expiry)) {
        return res.status(410).json({ error: 'Shortened URL has expired' });
    }

    // Update stats
    const interaction = {
        timestamp: new Date().toISOString(),
        referrer: req.get('Referrer') || 'Unknown',
        location: req.ip 
    };
     statsMap.get(code).push(interaction);
    entry.clickCount += 1;

    res.redirect(entry.url);
});


// GET /shorturls/:shortcode

app.get('/shorturls/:shortcode', (req, res) => {
    const code = req.params.shortcode;
    const entry = urlMap.get(code);

    if (!entry) {
        return res.status(404).json({ error: 'Shortcode not found' });
    }

    const stats = statsMap.get(code) || [];

    return res.json({
        url: entry.url,
        createdAt: entry.createdAt,
        expiry: entry.expiry,
        totalClicks: entry.clickCount,
        clicks: stats
    });
});

app.listen(PORT, () => {
    console.log(`URL Shortener service running at ${HOSTNAME}`);
});
