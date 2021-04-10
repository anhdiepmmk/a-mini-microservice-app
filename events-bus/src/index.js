const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const events = [];

app.post('/events', (req, res) => {
    console.log('Received event: ', req.body);
    
    const event = req.body;
    events.push(event);

    axios.post('http://posts-clusterip-srv:8000/events', event);
    // axios.post('http://localhost:8001/events', event);
    // axios.post('http://localhost:8002/events', event);
    // axios.post('http://localhost:8003/events', event);

    res.json({
        status: 'OK',
    })
});

app.get('/events', (req, res) => {
    res.send(events);
});

const port = process.env.PORT || 8005;
app.listen(port, () => {
    console.log(`Listing on port ${port}`);
});