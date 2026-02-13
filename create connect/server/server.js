/* server/server.js - Completely Fixed Version */
const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch'); // Moved to top with other imports
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

// AI Skill Analysis endpoint
app.post('/api/analyze-skill', async (req, res) => {
    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
            {
                headers: { 
                    Authorization: `Bearer ${process.env.HF_TOKEN}` 
                },
                method: "POST",
                body: JSON.stringify({
                    inputs: req.body.text,
                    parameters: { 
                        candidate_labels: ["repair", "education", "gardening", "cooking", "tech"] 
                    }
                }),
            }
        );
        
        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log("AI Analysis Result:", result);
        res.json(result);
        
    } catch (error) {
        console.error("AI Analysis failed:", error);
        // Return a fallback response so registration still works
        res.status(200).json({ 
            labels: ["general"],
            scores: [1.0],
            error: "AI service unavailable, using default category"
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Serving static files from: ${path.join(__dirname, '../public')}`);
});
