/* create connect/server/server.js - Corrected Version */
const express = require('express');
const cors = require('cors');
const path = require('path'); // Added path module
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
// Use absolute path for reliability
app.use(express.static(path.join(__dirname, '../public'))); 
app.use(express.json());

let exchanges = [
    { id: 1, userId: 101, type: 'offer', skill: 'Gardening', description: 'Help with flowers', location: 'Main St', points: 20 },
    { id: 2, userId: 102, type: 'need', skill: 'Cooking', description: 'Learn pasta', location: 'Oak Ave', points: 15 }
];

// Match exchanges algorithm fix: ensures user exists before matching
app.get('/api/match/:userId', (req, res) => {
    const userId = parseInt(req.params.userId);
    const userExchanges = exchanges.filter(e => e.userId === userId);
    
    if (userExchanges.length === 0) return res.json([]);

    const matches = exchanges.filter(e =>
        e.userId !== userId &&
        e.type !== userExchanges[0].type
    ).slice(0, 3);

    res.json(matches);
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    // Fix for default Leaflet marker icons not loading
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});
});


// Add this to your server.js
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

app.post('/api/analyze-skill', async (req, res) => {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
        {
            headers: { Authorization: `Bearer ${process.env.HF_TOKEN}` },
            method: "POST",
            body: JSON.stringify({
                inputs: req.body.text,
                parameters: { candidate_labels: ["repair", "education", "gardening", "tech"] }
            }),
        }
    );
    const result = await response.json();
    console.log(result)
    res.json(result);
});
