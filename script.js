// Function to create a new post
async function createPost() {
  const postContent = document.getElementById("postContent").value;
  const imageUpload = document.getElementById("imageUpload");
  const imageFile = imageUpload.files[0];
  let username = localStorage.getItem("username");

  if (!username) {
    username = prompt("Enter your username:");
    if (username) localStorage.setItem("username", username);
  }

  if (!postContent.trim()) {
    alert("Post content cannot be empty.");
    return;
  }

  const newPost = {
    content: postContent,
    timestamp: new Date().toLocaleString(),
    author: username
  };

  // Handle image upload if a file is provided
  if (imageFile) {
    const reader = new FileReader();
    reader.onload = async (event) => {
      newPost.imageUrl = event.target.result;
      await savePostToServer(newPost); // Save to server once image is loaded
      loadPosts(); // Reload posts to show the new one
    };
    reader.readAsDataURL(imageFile);
  } else {
    await savePostToServer(newPost); // Save to server if no image
    loadPosts();
  }

  // Clear form after posting
  document.getElementById("postContent").value = "";
  document.getElementById("imageUpload").value = "";
}

// Function to save a post to the server
async function savePostToServer(post) {
  try {
    const response = await fetch('/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(post)
    });
    if (!response.ok) throw new Error("Failed to save post");
  } catch (error) {
    console.error("Error saving post:", error);
  }
}

// Function to load posts from the server
async function loadPosts() {
  try {
    const response = await fetch('/posts');
    const data = await response.json();
    const posts = data.posts || [];

    // Clear existing posts
    const postsContainer = document.getElementById("postsContainer");
    postsContainer.innerHTML = "";

    // Display each post
    posts.forEach(displayPost);
  } catch (error) {
    console.error("Error loading posts:", error);
  }
}

// Function to display a post in the DOM
function displayPost(post) {
  const postElement = document.createElement("div");
  postElement.classList.add("post");

  let postHTML = `
    <h3>${post.author}</h3>
    <p class="timestamp">${post.timestamp}</p>
    <p>${post.content}</p>
  `;

  if (post.imageUrl) {
    postHTML += `<img src="${post.imageUrl}" alt="Post Image">`;
  }

  postElement.innerHTML = postHTML;
  document.getElementById("postsContainer").appendChild(postElement);
}

// Load posts on page load
window.onload = loadPosts;

// Attach event listener to the Post button
document.getElementById("postButton").addEventListener("click", createPost);
