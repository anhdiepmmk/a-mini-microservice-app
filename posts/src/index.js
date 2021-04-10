const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { randomBytes } = require('crypto');
const axios = require('axios');

// TODO: Tracing
// https://github.com/openzipkin/zipkin-js
// https://medium.com/trabe/tracing-express-services-with-zipkin-js-6e5c5680467e


const app = express();
app.use(bodyParser.json());
app.use(cors({}));

const posts = {};

app.get('/', (req, res) => {
  res.sendStatus(200);
});

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/posts', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const { title } = req.body;

  posts[id] = {
    id, title,
  };

  await axios.post('http://event-bus-srv:8005/events', {
    type: 'PostCreated',
    data: {
      id, title,
    }
  });

  res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
  console.log('Received event: ', req.body);
  res.sendStatus(200);
});

const PORT = 8000 || process.env.PORT;
app.listen(PORT, () => {
 console.log(`Listening on ${PORT}`);
});