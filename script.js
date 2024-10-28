// Function to create a new post
async function createPost() {
  const postContent = document.getElementById('postContent').value;
  const imageUpload = document.getElementById('imageUpload');
  const imageFile = imageUpload.files[0];
  let username = getUserName() || prompt("Please enter your username:");

  if (username) {
    setUserName(username); // Save username in local storage

    const timestamp = new Date().toLocaleString();
    let newPost = {
      content: postContent,
      timestamp: timestamp,
      author: username,
      reactions: {},
    };

    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        newPost.imageUrl = event.target.result;
        savePostToLocalStorage(newPost);
        displayPost(newPost);
        clearForm();
      };
      reader.readAsDataURL(imageFile);
    } else {
      savePostToLocalStorage(newPost);
      displayPost(newPost);
      clearForm();
    }
  }
}

// Helper function to clear the form after posting
function clearForm() {
  document.getElementById('postContent').value = "";
  document.getElementById('imageUpload').value = '';
}

// Save a post to local storage
function savePostToLocalStorage(post) {
  const posts = JSON.parse(localStorage.getItem('posts')) || [];
  posts.push(post);
  localStorage.setItem('posts', JSON.stringify(posts));
}

// Load posts from local storage and display them
function loadPosts() {
  const posts = JSON.parse(localStorage.getItem('posts')) || [];
  posts.forEach(post => displayPost(post));
}

// Get the username from local storage
function getUserName() {
  return localStorage.getItem('username');
}

// Set the username in local storage
function setUserName(username) {
  localStorage.setItem('username', username);
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
      <div class="comments"></div>
      <textarea placeholder="Write your comment..."></textarea>
      <button onclick="addComment(this)">Comment</button>
      <button onclick="deletePost(this)">Delete Post</button>
  `;

  newPost.innerHTML = postHTML;
  document.getElementById('postsContainer').appendChild(newPost);
}

// Function to add a comment
function addComment(button) {
  const commentContent = button.previousElementSibling.value;
  if (commentContent.trim() !== "") {
    const newComment = document.createElement('div');
    newComment.classList.add('comment');
    newComment.textContent = commentContent;
    newComment.innerHTML += `<button onclick="deleteComment(this)">Delete Comment</button>`;
    button.parentElement.querySelector('.comments').appendChild(newComment);
    button.previousElementSibling.value = "";
  }
}

// Function to delete a post
function deletePost(button) {
  const postToDelete = button.parentElement;
  const posts = JSON.parse(localStorage.getItem('posts')) || [];
  const updatedPosts = posts.filter((post, index) => {
    return index !== Array.from(document.getElementById('postsContainer').children).indexOf(postToDelete);
  });
  localStorage.setItem('posts', JSON.stringify(updatedPosts));
  postToDelete.remove();
}

// Function to delete a comment
function deleteComment(button) {
  button.parentElement.remove();
}

// Load posts on page load
window.onload = loadPosts;

// Attach event listener to the Post button
document.getElementById('postButton').addEventListener('click', createPost);
