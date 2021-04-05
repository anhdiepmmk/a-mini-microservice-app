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

app.get('/posts', async(req, res) => {
  res.json(posts);
});

app.post('/events', (req, res) => {
  console.log('Received event: ', req.body);
  
  const { type, data } = req.body;
  if (type === 'PostCreated') {
      const { id, title } = data;
      posts[id] = { id, title, comments: [] };
  }

  if (type === 'CommentCreated') {
      const { id, content, postId, status } = data;
      const post = posts[postId];
      if (post) {
        post.comments.push({
            id, content, status,
        });
      }
  }

  if (type === 'CommentUpdated') {
      const { id, content, postId, status } = data;
      const post = posts[postId];
      if (post) {
        const comment = post.comments.find(comment => comment.id === id);
        if (comment) {
          comment.status = status;
          comment.content = content;
        }
      }
  }
  res.sendStatus(200);
});

const PORT = 8002 || process.env.PORT;
app.listen(PORT, () => {
 console.log(`Listening on ${PORT}`);
});