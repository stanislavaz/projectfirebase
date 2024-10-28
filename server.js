const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Initialize posts data from JSON file
let posts = [];
const postsFilePath = path.join(__dirname, 'posts.json');

try {
  const data = fs.readFileSync(postsFilePath, 'utf8');
  posts = JSON.parse(data).posts || [];
} catch (error) {
  console.error("Error reading posts.json:", error);
}

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // For parsing JSON requests

// Endpoint to fetch all posts
app.get('/posts', (req, res) => {
  res.json({ posts });
});

// Endpoint to create a new post
app.post('/posts', (req, res) => {
  const newPost = req.body; // Get the new post from the request body
  posts.push(newPost); // Add the new post to the posts array
  
  try {
    // Write updated posts to posts.json
    fs.writeFileSync(postsFilePath, JSON.stringify({ posts }, null, 2), 'utf8');
    res.status(201).json(newPost); // Send a response with the new post
  } catch (error) {
    console.error("Error writing to posts.json:", error);
    res.status(500).send("Error saving post");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
