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

// Generate a unique user ID once if not present
if (!localStorage.getItem("userID")) {
  const userID = 'user_' + Math.random().toString(36).substr(2, 9);
  localStorage.setItem("userID", userID);
}

const currentUserID = localStorage.getItem("userID");

// Function to create a new post
async function createPost() {
  const postContent = document.getElementById("postContent").value;
  if (!postContent.trim()) {
    alert("Post content cannot be empty.");
    return;
  }

  const username = getOrCreateUsername();
  const newPost = {
    content: postContent,
    timestamp: new Date(),
    author: username,
    userID: localStorage.getItem("userID"),
  };

  try {
    await savePostToDatabase(newPost);
    document.getElementById("postContent").value = "";
    loadPosts(); // Reload posts after successful creation
  } catch (error) {
    console.error("Error creating post:", error);
    alert("There was an issue creating the post.");
  }
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

  querySnapshot.forEach((doc) => {
    const post = { id: doc.id, ...doc.data() };
    if (post.userID === currentUserID) {
      displayPost(post);
    }
  });
}

// Function to display a post in the DOM
function displayPost(post) {
  const postElement = document.createElement("div");
  postElement.classList.add("post");

  let formattedDate;
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
  } else {
    formattedDate = "Datum nicht verfügbar";
  }

  let postHTML = `
    <h3>${post.author} (UserID: ${post.userID})</h3>
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
    const postRef = doc(db, "posts", postId);
    await deleteDoc(postRef);
    alert("Post erfolgreich gelöscht.");
    loadPosts();
  } catch (error) {
    console.error("Error deleting post:", error);
    alert("Ein Fehler ist beim Löschen des Beitrags aufgetreten.");
  }
}

// Event listener for the Post button
document.getElementById("postButton").addEventListener("click", createPost);

// Load posts on page load
loadPosts();
