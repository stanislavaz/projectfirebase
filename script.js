// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";
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

// Function to create a new post
async function createPost() {
  const postContent = document.getElementById("postContent").value;
  const imageUpload = document.getElementById("imageUpload");
  const imageFile = imageUpload.files[0];
  const username = getOrCreateUsername();

  if (!postContent.trim()) {
    alert("Post content cannot be empty.");
    return;
  }

  // Save date as a timestamp for accurate sorting and parsing
  const newPost = {
    content: postContent,
    timestamp: new Date().toISOString(),
    author: username,
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
    const postData = doc.data();
    postsArray.push({ ...postData, id: doc.id });
  });

  postsArray.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  postsArray.forEach((post) => displayPost(post));
}

// Function to display a post in the DOM
function displayPost(post) {
  const postElement = document.createElement("div");
  postElement.classList.add("post");

  // Convert ISO string to readable format and handle parsing errors
  const formattedDate = post.timestamp
    ? new Date(post.timestamp).toLocaleString()
    : "Date not available";

  let postHTML = `
    <h3>${post.author}</h3>
    <p class="timestamp">${formattedDate}</p>
    <p>${post.content}</p>
  `;

  if (post.imageUrl) {
    postHTML += `<img src="${post.imageUrl}" alt="Post Image" style="max-width: 100%; height: auto; margin-top: 10px;">`;
  }

  postElement.innerHTML = postHTML;

  document.getElementById("postsContainer").prepend(postElement);
}

// Load posts on page load
window.onload = loadPosts;

// Attach event listener to the Post button
document.getElementById("postButton").addEventListener("click", createPost);
