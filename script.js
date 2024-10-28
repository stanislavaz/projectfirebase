// Function to create a new post

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBVh0DfMKE1IKTMadyTLO_c54Y6o5BCnTY",
  authDomain: "liebe-f332d.firebaseapp.com",
  projectId: "liebe-f332d",
  storageBucket: "liebe-f332d.appspot.com",
  messagingSenderId: "199124008155",
  appId: "1:199124008155:web:04f7f5582811693fdda0fe",
  measurementId: "G-TE1VF9N946"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
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
      savePostToServer(newPost); // Send post to server once image is loaded
    };
    reader.readAsDataURL(imageFile);
  } else {
    savePostToServer(newPost); // Send post to server if no image
  }

  // Clear form after posting
  document.getElementById("postContent").value = "";
  document.getElementById("imageUpload").value = "";
}

// Function to send post to the server
function savePostToServer(post) {
  fetch('/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(() => {
    loadPosts(); // Reload posts to show the new one
  })
  .catch(error => {
    console.error('Error saving post:', error);
  });
}

// Function to load posts from the server
function loadPosts() {
  fetch('/posts')
    .then(response => response.json())
    .then(data => {
      const postsContainer = document.getElementById("postsContainer");
      postsContainer.innerHTML = ""; // Clear existing posts
      data.posts.forEach(displayPost); // Display each post
    })
    .catch(error => {
      console.error('Error loading posts:', error);
    });
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
