const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Read the initial database file
let posts = [];
let usernames = {};
let userIDs = {};
try {
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'posts.json')));
  posts = data.posts || [];
  usernames = data.usernames || {};
  userIDs = data.userIDs || {};
} catch (error) {
  console.error('Error reading initial database file:', error);
}

// Serve static files (HTML, CSS, JavaScript)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse request bodies
app.use(express.json());

// API endpoint to get posts
app.get('/posts', (req, res) => {
  res.json({ posts });
});

// API endpoint to save posts
app.put('/posts', (req, res) => {
  posts = req.body.posts;
  saveDatabase();
  res.sendStatus(200);
});

// API endpoint to get user data
app.get('/userData', (req, res) => {
  res.json({ usernames, userIDs });
});

// API endpoint to save user data
app.put('/userData', (req, res) => {
  usernames = req.body.usernames;
  userIDs = req.body.userIDs;
  saveDatabase();
  res.sendStatus(200);
});

// Function to save the database to a JSON file
function saveDatabase() {
  try {
    fs.writeFileSync(
      path.join(__dirname, 'posts.json'),
      JSON.stringify({ posts, usernames, userIDs }),
      'utf8'
    );
  } catch (error) {
    console.error('Error saving database:', error);
  }
}

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
