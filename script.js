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

// Function to get a unique user ID (if not already present)
async function getUserID() {
  let userData = await getUserDataFromDatabase();
  let userID = localStorage.getItem('userID');
  if (!userID) {
    userID = Date.now().toString(36) + Math.random().toString(36).substring(2, 15); // Generate a random ID
    userData.userIDs[userID] = true; // Store the userID in the database
    await saveUserDataToDatabase(userData.usernames, userData.userIDs);
    localStorage.setItem('userID', userID);
  }
  return userID;
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
        // Refresh the display after saving
        loadPosts(); 
      };
      reader.readAsDataURL(imageFile);
    } else {
      savePostToDatabase(newPost);
      displayPost(newPost);
      document.getElementById('postContent').value = "";
      // Refresh the display after saving
      loadPosts(); 
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
    console.error('Error saving post to database:', error);
  }
}

// Function to display a post 
function displayPost(post) {
  const newPost = document.createElement('div');
  newPost.classList.add('post');

  let postHTML = `
        <h3>${post.author}</h3>
        <p class="timestamp">${post.timestamp}</p>
        <p>${post.content}</p>
    `;

  if (post.imageUrl) {
    postHTML += `<img src="${post.imageUrl}" alt="Post Image">`;
  }

  postHTML += `
        <div class="comments">
            </div>
        <textarea id="newComment" placeholder="Write your comment..."></textarea>
        <button onclick="addComment(this)">Comment</button>
        <button onclick="deletePost(this)">Delete Post</button>
        <div class="reactions" style="display:none;">
            </div>
    `;

  newPost.innerHTML = postHTML;
  document.getElementById('postsContainer').appendChild(newPost); // Add the post to the DOM

  // Load existing reactions from the post element (if they exist)
  const existingReactions = newPost.dataset.reactions ? JSON.parse(newPost.dataset.reactions) : {};
  // Update the post's reactions with the loaded data
  post.reactions = existingReactions;

  // Add reaction buttons to the post
  addReactionButtons(newPost, post.reactions);
  // Store reactions on the post element
  newPost.dataset.reactions = JSON.stringify(post.reactions);

  // Add "React" button if the post is not by the current user
  if (post.author !== await getUserName()) { 
    const reactButton = document.createElement('button');
    reactButton.textContent = "React";
    reactButton.addEventListener('click', () => {
      const reactionsContainer = newPost.querySelector('.reactions');
      if (reactionsContainer.style.display === "none") {
        reactionsContainer.style.display = "block";
      } else {
        reactionsContainer.style.display = "none";
      }
    });
    newPost.appendChild(reactButton);
  }
}


// Function to toggle a reaction
async function toggleReaction(element, emoji) {
  const reactions = element.dataset.reactions ? JSON.parse(element.dataset.reactions) : {}; // Get existing reactions
  const button = element.querySelector(`button[data-emoji="${emoji}"]`);
  if (reactions[emoji]) {
    delete reactions[emoji];
    button.classList.remove('active'); // Remove active class
  } else {
    reactions[emoji] = true;
    button.classList.add('active'); // Add active class
  }
  element.dataset.reactions = JSON.stringify(reactions); // Update reactions data
  // Display the reaction
  displayReaction(element, emoji); // Call displayReaction here

  // Update the post object in the database with the new reactions
  const posts = await getPostsFromDatabase();
  const postIndex = Array.from(document.getElementById('postsContainer').children).indexOf(element);
  if (postIndex !== -1) {
    posts[postIndex].reactions = reactions;
    await savePostsToDatabase(posts);
  }
}

// Function to add a comment
function addComment(button) {
  const commentContent = button.previousElementSibling.value;
  if (commentContent.trim() !== "") {
    const newComment = document.createElement('div');
    newComment.classList.add('comment');
    newComment.textContent = commentContent;
    newComment.innerHTML += `<button onclick="deleteComment(this)">Delete Comment</button>`; // Add delete button
    button.parentElement.querySelector('.comments').appendChild(newComment);
    button.previousElementSibling.value = "";
    addReactionButtons(newComment, {}); // Add reactions to the new comment

    // Add "React" button if the comment is not by the current user
    if (post.author !== "You") {
      const reactButton = document.createElement('button');
      reactButton.textContent = "React";
      reactButton.addEventListener('click', () => {
        const reactionsContainer = newComment.querySelector('.reactions');
        if (reactionsContainer.style.display === "none") {
          reactionsContainer.style.display = "block";
        } else {
          reactionsContainer.style.display = "none";
        }
      });
      newComment.appendChild(reactButton);
    }
  }
}

// Function to delete a post
async function deletePost(button) {
  const postToDelete = button.parentElement;
  const posts = await
