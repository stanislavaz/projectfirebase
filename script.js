// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-storage.js";
import { query, orderBy, getDocs, collection } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js"; // Ensure you're importing query and orderBy correctly
import { Timestamp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";  // Import Timestamp 

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

// Function to prompt for a username and store it in localStorage
function getOrCreateUsername() {
  let username = localStorage.getItem("username");
  if (!username) {
    username = prompt("Enter your username:");
    if (username) {
      localStorage.setItem("username", username);
    } else {
      alert("Username is required to create a post.");
      return null;
    }
  }
  return username;
}

// Function to create a new post
async function createPost() {
  const postContent = document.getElementById("postContent").value.trim();
  const imageUpload = document.getElementById("imageUpload");
  const imageFile = imageUpload.files[0];
  const username = getOrCreateUsername();

  if (!username || !postContent) {
    alert("Both a username and post content are required.");
    return;
  }

  const newPost = {
    content: postContent,
    timestamp: Timestamp.fromDate(new Date()), // Ensure the timestamp is stored correctly
    author: username,
    userID: localStorage.getItem("userID") || generateUserID(), // Ensures userID is present
  };

  try {
    // Handle image upload if provided
    if (imageFile) {
      newPost.imageUrl = await uploadImage(imageFile);
    }

    await addDoc(collection(db, "posts"), newPost);
    alert("Post created successfully!");
    document.getElementById("postContent").value = "";
    imageUpload.value = "";
    loadPosts(); // Reload posts after new post is created
  } catch (error) {
    console.error("Error creating post:", error);
    alert("Failed to create post. Please try again.");
  }
}
// Function to upload an image to Firebase Storage
async function uploadImage(file) {
  const storageRef = ref(storage, `images/${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

// Generates a userID if none exists
function generateUserID() {
  const userID = 'user_' + Math.random().toString(36).substr(2, 9);
  localStorage.setItem("userID", userID);
  return userID;
}

// Function to load posts from Firestore
// Function to load posts from Firestore in chronological order (newest first)
async function loadPosts() {
  const postsQuery = query(
    collection(db, "posts"),
    orderBy("timestamp", "desc") // Orders posts by timestamp in descending order
  );

  const querySnapshot = await getDocs(postsQuery);
  const postsContainer = document.getElementById("postsContainer");
  postsContainer.innerHTML = ""; // Clear existing posts

  querySnapshot.forEach((doc) => {
    const post = { id: doc.id, ...doc.data() };
    displayPost(post); // Display all posts in chronological order
  });
}



// Function to display a post in the DOM
// Function to display a post in the DOM
// Function to display a post in the DOM
function displayPost(post) {
  const postElement = document.createElement("div");
  postElement.classList.add("post");

  let formattedDate = "Date not available";
  if (post.timestamp && post.timestamp.toDate) {
    const date = post.timestamp.toDate();
    formattedDate = date.toLocaleString('de-DE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short',
      hour12: false
    }).replace("GMT", "um");
  }

  // Modify to exclude userID display
  let postHTML = `
    <h3>${post.author}</h3> 
    <p class="timestamp">${formattedDate}</p>
    <p>${post.content}</p>
  `;

  if (post.imageUrl) {
    postHTML += `<img src="${post.imageUrl}" alt="Post Image" style="max-width: 100%; height: auto; margin-top: 10px;">`;
  }

  postHTML += `<button class="button deleteButton" data-id="${post.id}">Löschen</button>`;

  postElement.innerHTML = postHTML;
  document.getElementById("postsContainer").appendChild(postElement);

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
    await deleteDoc(doc(db, "posts", postId));
    alert("Post deleted successfully.");
    loadPosts();
  } catch (error) {
    console.error("Error deleting post:", error);
    alert("Failed to delete post.");
  }
}

// Event listener for the Post button
document.getElementById("postButton").addEventListener("click", createPost);

// Load posts when the page is loaded
window.onload = loadPosts;
