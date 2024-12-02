const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Path to the posts JSON file  
const postsFilePath = path.join(__dirname, 'posts.json');

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Load posts from JSON file
function loadPosts() {
  try {
    const data = fs.readFileSync(postsFilePath, 'utf8');
    return JSON.parse(data).posts || [];
  } catch (error) {
    console.error("Error reading posts.json:", error);
    return [];
  }
}

// Save posts to JSON file
function savePosts(posts) {
  try {
    fs.writeFileSync(postsFilePath, JSON.stringify({ posts }, null, 2), 'utf8');
  } catch (error) {
    console.error("Error writing to posts.json:", error);
  }
}

// GET endpoint to fetch all posts
app.get('/posts', (req, res) => {
  const posts = loadPosts();
  res.json({ posts });
});

// POST endpoint to add a new post
app.post('/posts', (req, res) => {
  const newPost = req.body;
  const posts = loadPosts();
  posts.push(newPost);
  savePosts(posts);
  res.status(201).json(newPost);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
