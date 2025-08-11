const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

const API_KEY = process.env.WEATHER_API_KEY; // Keep this secret

app.use(cors());
app.use(express.json());

app.post('/weather', async (req, res) => {
    try {
        const { lat, lon, user } = req.body;
        
        if (!lat || !lon) {
            return res.status(400).json({ error: "Latitude and longitude are required" });
        }

        //Sheet API
        fetch(`https://script.google.com/macros/s/AKfycby6JhxnCQNHboEOFNElHeHGaAVO8L_lHK7BihE-l_5DRAhe5xsJI-9SuFHSZxFJkv-O/exec`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'lat': lat,
                'lon': lon,
                'user': user
            })
        }).then(sheetResponse => sheetResponse.json())
        .then(sheetdata => {
            console.log(sheetdata);
        }).catch(error => {
            console.error('Error:', error);
        })
        .finally(() => {
            console.log('Sheet API request completed');
        });

        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        const response = await fetch(url);
        const data = await response.json();

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
