// Function to get the username for the current user
async function getUserName() {
  const userID = getUserID();
  let usernames = await getUsernamesFromDatabase();
  return usernames[userID] || null;
}

// Function to set the username for the current user
async function setUserName(username) {
  const userID = getUserID();
  let usernames = await getUsernamesFromDatabase();
  usernames[userID] = username;
  await saveUsernamesToDatabase(usernames);
}

// Function to create a new post
async function createPost() {
  const postContent = document.getElementById('postContent').value;
  const imageUpload = document.getElementById('imageUpload');
  const imageFile = imageUpload.files[0];
  const userID = getUserID();
  let username = await getUserName();

  if (postContent.trim() !== "" && username) { // Only proceed if username is set
    const timestamp = new Date().toLocaleString();
    let newPost = {
      content: postContent,
      timestamp: timestamp,
      reactions: {},
      author: username // Store the username as the author
    };

    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        newPost.imageUrl = event.target.result;
        savePostToDatabase(newPost);
        displayPost(newPost);
        document.getElementById('postContent').value = "";
        imageUpload.value = '';
      };
      reader.readAsDataURL(imageFile);
    } else {
      savePostToDatabase(newPost);
      displayPost(newPost);
      document.getElementById('postContent').value = "";
    }
  } else if (postContent.trim() !== "" && !username) {
    // Prompt for username if it's not set
    username = prompt("Please enter your username:");
    if (username) {
      await setUserName(username); // Store the username in the database
      await createPost(); // Retry creating the post
    }
  }
}

// Function to store a post in the database
async function savePostToDatabase(post) {
  try {
    const posts = await getPostsFromDatabase(); // Get posts from database
    posts.push(post);
    await savePostsToDatabase(posts); // Save updated posts to database
  } catch (error) {
    console.error('
