const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/events', (req, res) => {
    const event = req.body;

    axios.post('http://localhost:8000/events', event);
    axios.post('http://localhost:8001/events', event);
    axios.post('http://localhost:8002/events', event);

    res.json({
        status: 'OK',
    })
});

const port = process.env.PORT || 8005;
app.listen(port, () => {
    console.log(`Listing on port ${port}`);
});