import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-storage.js";

// Firebase configuration and initialization
const firebaseConfig = {
  apiKey: "AIzaSyBVh0DfMKE1IKTMadyTLO_c54Y6o5BCnTY",
  authDomain: "liebe-f332d.firebaseapp.com",
  projectId: "liebe-f332d",
  storageBucket: "liebe-f332d.appspot.com",
  messagingSenderId: "199124008155",
  appId: "1:199124008155:web:04f7f5582811693fdda0fe",
  measurementId: "G-TE1VF9N946"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Function to prompt for a username once and store it in localStorage
function getOrCreateUsername() {
  let username = localStorage.getItem("username");
  if (!username) {
    username = prompt("Enter your username:");
    if (username) localStorage.setItem("username", username);
  }
  return username;
}

// Function to generate and store a unique userID if not already present
function generateUserID() {
  const newUserID = `user-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  localStorage.setItem("userID", newUserID);
  return newUserID;
}

// Function to create a new post
async function createPost() {
  const postContent = document.getElementById("postContent").value;
  const imageUpload = document.getElementById("imageUpload");
  const imageFile = imageUpload.files[0];
  const username = getOrCreateUsername();
  const userID = localStorage.getItem("userID") || generateUserID();

  if (!postContent.trim()) {
    alert("Post content cannot be empty.");
    return;
  }

  const newPost = {
    content: postContent,
    timestamp: new Date().toLocaleString(),
    author: username,
    userID: userID,
  };

  if (imageFile) {
    const imageUrl = await uploadImage(imageFile);
    newPost.imageUrl = imageUrl;
  }

  await savePostToDatabase(newPost);
  loadPosts();

  document.getElementById("postContent").value = "";
  document.getElementById("imageUpload").value = "";
}

// Function to upload image to Firebase Storage
async function uploadImage(file) {
  const storageRef = ref(storage, `images/${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

// Function to save post to Firestore
async function savePostToDatabase(post) {
  try {
    await addDoc(collection(db, "posts"), post);
    console.log("Post added successfully");
  } catch (error) {
    console.error("Error adding post:", error);
  }
}

// Function to load posts from Firestore
async function loadPosts() {
  const querySnapshot = await getDocs(collection(db, "posts"));
  const postsContainer = document.getElementById("postsContainer");
  postsContainer.innerHTML = "";

  const postsArray = [];
  querySnapshot.forEach((doc) => {
    postsArray.push({ id: doc.id, ...doc.data() });
  });

  postsArray.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  postsArray.forEach((post) => {
    displayPost(post, postsContainer);
  });
}

// Function to display a post in the DOM
function displayPost(post, container) {
  const postElement = document.createElement("div");
  postElement.classList.add("post");

  let formattedDate;
  if (post.timestamp) {
    try {
      const date = new Date(post.timestamp);
      formattedDate = date.toLocaleString();
    } catch (error) {
      console.error("Error parsing date:", error);
      formattedDate = post.timestamp;
    }
  } else {
    formattedDate = "Date not available";
  }

  let postHTML = `
    <h3>${post.author}</h3>
    <p class="timestamp">${formattedDate}</p>
    <p>${post.content}</p>
  `;

  if (post.imageUrl) {
    postHTML += `<img src="${post.imageUrl}" alt="Post Image" style="max-width: 100%; height: auto; margin-top: 10px;">`;
  }

  const currentUserID = localStorage.getItem("userID");
  if (currentUserID === post.userID) {
    postHTML += `<button class="deleteButton" onclick="deletePost('${post.id}')">Delete</button>`;
  }

  postElement.innerHTML = postHTML;
  container.appendChild(postElement);
}

// Function to delete a post from Firestore
async function deletePost(postId) {
  try {
    const postRef = doc(db, "posts", postId);
    await deleteDoc(postRef);
    alert("Post deleted successfully.");
    loadPosts();
  } catch (error) {
    console.error("Error deleting post:", error);
    alert("An error occurred while deleting the post.");
  }
}

// Load posts on page load
window.onload = loadPosts;

// Attach event listener to the Post button
document.getElementById("postButton").addEventListener("click", createPost);
