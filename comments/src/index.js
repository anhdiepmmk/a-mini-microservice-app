const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const { randomBytes } = require('crypto');


const app = express();
app.use(bodyParser.json());
app.use(cors({}));

const commentsByPostId = {};

app.get('/', (req, res) => {
  res.sendStatus(200);
});

app.get('/posts/:id/comments', (req, res) => {
  const id = req.params.id;
  res.send(commentsByPostId[id] || []);
});

app.post('/posts/:id/comments', async(req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];

  comments.push({
    id: commentId, content, status: 'pending',
  });

  commentsByPostId[req.params.id] = comments;

  await axios.post('http://event-bus-srv:8005/events', {
    type: 'CommentCreated',
    data: {
      id: commentId,
      content,
      postId: req.params.id,
      status: 'pending',
    },
  });

  res.status(201).json(comments);
});

app.post('/events', async (req, res) => {
  console.log('Received event: ', req.body);

  const { type, data } = req.body;

  if (type === 'CommentModerated') {
    const { postId, id, status, content } = data;
    const comments = commentsByPostId[postId];

    const comment = comments.find(comment => comment.id === id);
    if (comment) {
      comment.status = status;
      await axios.post('http://event-bus-srv:8005/events', {
        type: 'CommentUpdated',
        data: {
          id,
          status,
          postId,
          content,
        }
      });
    }
  }

  res.sendStatus(200);
});

const PORT = 8001 || process.env.PORT;
app.listen(PORT, () => {
 console.log(`Listening on ${PORT}`);
});