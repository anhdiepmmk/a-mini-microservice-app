const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors({}));

const posts = {};

app.get('/', (req, res) => {
  res.sendStatus(200);
});

app.post('/events', async (req, res) => {
  console.log('Received event: ', req.body);
  const { type, data } = req.body;
  if (type === 'CommentCreated') {
    const status = data.content.includes('orange') ? 'rejected' : 'approved';
    await axios.post('http://event-bus-srv:8005/events', {
      type: 'CommentModerated',
      data: {
        id: data.id,
        postId: data.postId,
        status,
        content: data.content,
      }
    });
  }
  res.sendStatus(200);
});

const PORT = 8003 || process.env.PORT;
app.listen(PORT, () => {
 console.log(`Listening on ${PORT}`);
});