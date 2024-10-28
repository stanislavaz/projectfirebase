// database.js
const databasePath = 'posts.json'; // Update with your database name

// Function to get posts from the database
async function getPostsFromDatabase() {
  try {
    const response = await fetch(databasePath);
    const data = await response.json();
    return data.posts || []; // Return an empty array if the database is empty
  } catch (error) {
    console.error('Error fetching posts from database:', error);
    return []; // Return an empty array on error
  }
}

// Function to save posts to the database
async function savePostsToDatabase(posts) {
  try {
    const response = await fetch(databasePath, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ posts: posts })
    });
    if (!response.ok) {
      console.error('Error saving posts to database:', response.status);
    }
  } catch (error) {
    console.error('Error saving posts to database:', error);
  }
}

// Function to get usernames from the database
async function getUsernamesFromDatabase() {
  try {
    const response = await fetch(databasePath);
    const data = await response.json();
    return data.usernames || {}; // Return an empty object if the database is empty
  } catch (error) {
    console.error('Error fetching usernames from database:', error);
    return {}; // Return an empty object on error
  }
}

// Function to save usernames to the database
async function saveUsernamesToDatabase(usernames) {
  try {
    const response = await fetch(databasePath, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ usernames: usernames })
    });
    if (!response.ok) {
      console.error('Error saving usernames to database:', response.status);
    }
  } catch (error) {
    console.error('Error saving usernames to database:', error);
  }
}
