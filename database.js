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

// Function to get usernames and userIDs from the database
async function getUserDataFromDatabase() {
  try {
    const response = await fetch(databasePath);
    const data = await response.json();
    return { usernames: data.usernames || {}, userIDs: data.userIDs || {} }; // Return empty objects if not found
  } catch (error) {
    console.error('Error fetching user data from database:', error);
    return { usernames: {}, userIDs: {} }; // Return empty objects on error
  }
}

// Function to save usernames and userIDs to the database
async function saveUserDataToDatabase(usernames, userIDs) {
  try {
    const response = await fetch(databasePath, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ usernames: usernames, userIDs: userIDs })
    });
    if (!response.ok) {
      console.error('Error saving user data to database:', response.status);
    }
  } catch (error) {
    console.error('Error saving user data to database:', error);
  }
}
