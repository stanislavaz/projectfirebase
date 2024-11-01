// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";
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
  const username = getOrCreateUsername(); // Get username from localStorage or prompt
  const userID = localStorage.getItem("userID") || generateUserID(); // Generate userID if not exists

  if (!postContent.trim()) {
    alert("Post content cannot be empty.");
    return;
  }

  const newPost = {
    content: postContent,
    timestamp: new Date(),
    author: username,
    userID: userID,
  };

  // Handle image upload if a file is provided
  if (imageFile) {
    const imageUrl = await uploadImage(imageFile); // Upload image and get URL
    newPost.imageUrl = imageUrl; // Add the image URL to the new post
  }

  await savePostToDatabase(newPost); // Save post to Firestore
  loadPosts(); // Reload posts to show the new one

  // Clear form after posting
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
    await addDoc(collection(db, "posts"), post); // Automatically generates a document ID
    console.log("Post added successfully");
  } catch (error) {
    console.error("Error adding post:", error);
  }
}

// Function to load posts from Firestore
async function loadPosts() {
  const querySnapshot = await getDocs(collection(db, "posts"));
  const postsContainer = document.getElementById("postsContainer");
  postsContainer.innerHTML = ""; // Clear existing posts

  const posts = [];
  querySnapshot.forEach((doc) => {
    posts.push({ id: doc.id, ...doc.data() });
  });

  // Sort posts by timestamp in descending order
  posts.sort((a, b) => b.timestamp - a.timestamp);

  posts.forEach((post) => {
    displayPost(post);
  });
}

// Function to display a post in the DOM
function displayPost(post) {
  const postElement = document.createElement("div");
  postElement.classList.add("post");

  let formattedDate;
  if (post.timestamp && post.timestamp.toDate) {
    // Convert Firestore timestamp to JavaScript Date and format it
    formattedDate = post.timestamp.toDate().toLocaleString();
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

  // Only show delete button for the post's author
  const currentUserID = localStorage.getItem("userID");
  if (currentUserID === post.userID) {
    postHTML += `<button class="button deleteButton" data-id="${post.id}">Löschen</button>`;
  }

  postElement.innerHTML = postHTML;
  document.getElementById("postsContainer").appendChild(postElement);

  // Attach event listener for delete button with confirmation pop-up
  const deleteButton = postElement.querySelector(".deleteButton");
  if (deleteButton) {
    deleteButton.addEventListener("click", () => {
      const confirmDelete = confirm("Do you really want to delete the post?");
      if (confirmDelete) {
        deletePost(post.id);
      }
    });
  }
}


// Function to delete a post from Firestore
async function deletePost(postId) {
  try {
    const postRef = doc(db, "posts", postId);
    await deleteDoc(postRef);
    alert("Post erfolgreich gelöscht.");
    loadPosts(); // Reload posts after deletion
  } catch (error) {
    console.error("Error deleting post:", error);
    alert("Ein Fehler ist beim Löschen des Beitrags aufgetreten.");
  }
}

// Function to generate a unique user ID
function generateUserID() {
  const userID = 'user_' + Math.random().toString(36).substr(2, 9);
  localStorage.setItem("userID", userID);
  return userID;
}

// Load posts on page load
window.onload = loadPosts;

// Attach event listener to the Post button
document.getElementById("postButton").addEventListener("click", createPost);
