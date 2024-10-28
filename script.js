// Function to create a new post
function createPost() {
  const postContent = document.getElementById("postContent").value;
  const imageUpload = document.getElementById("imageUpload");
  const imageFile = imageUpload.files[0];
  let username = localStorage.getItem("username");

  // Prompt for username if not set
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
    reader.onload = (event) => {
      newPost.imageUrl = event.target.result;
      savePostToLocal(newPost); // Save to localStorage once image is loaded
      loadPosts(); // Reload posts to show the new one
    };
    reader.readAsDataURL(imageFile);
  } else {
    savePostToLocal(newPost); // Save to localStorage if no image
    loadPosts();
  }

  // Clear form after posting
  document.getElementById("postContent").value = "";
  document.getElementById("imageUpload").value = "";
}

// Function to save a post to localStorage
function savePostToLocal(post) {
  const posts = JSON.parse(localStorage.getItem("posts")) || [];
  posts.push(post); // Add the new post to the array
  localStorage.setItem("posts", JSON.stringify(posts)); // Save array back to localStorage
}

// Function to load posts from localStorage
function loadPosts() {
  const posts = JSON.parse(localStorage.getItem("posts")) || [];
  const postsContainer = document.getElementById("postsContainer");

  // Clear existing posts
  postsContainer.innerHTML = "";

  // Display each post
  posts.forEach(displayPost);
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








const postsRef = firebase.database().ref('posts'); // Create a reference to the 'posts' node
const newPostRef = postsRef.push(); // Push a new post
newPostRef.set({
  content: "Hello World!",
  author: "User1",
  timestamp: new Date().toLocaleString()
});
postsRef.on('value', (snapshot) => {
  const posts = snapshot.val();
  console.log(posts); // Log posts to the console or update your UI
});
