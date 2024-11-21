// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  Timestamp
} from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.1.0/firebase-storage.js";

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

// Array for stamp URLs
const stampUrls = [
  "https://i.postimg.cc/Yq5R9Htz/image-6.png",
  "https://i.postimg.cc/y8yzyBY7/image-7.png",
  "https://i.postimg.cc/TYXdVtqq/image-13.png",
  "https://i.postimg.cc/VvXb75V7/image-15.png",
  "https://i.postimg.cc/wBJyx169/image-16.png",
  "https://i.postimg.cc/T2Zspwvp/image-17.png",
  "https://i.postimg.cc/Xvf5cspR/image-18.png",
  "https://i.postimg.cc/nhBfHPR9/image-19.png",
  "https://i.postimg.cc/nL7DHpBb/image-20.png",
  "https://i.postimg.cc/Wz64K1BS/image-21.png",
  "https://i.postimg.cc/MKgWDRfx/image-22.png",
  "https://i.postimg.cc/MpGFvrpp/image-23.png",
  "https://i.postimg.cc/bvPdxMs1/image-24.png",
  "https://i.postimg.cc/MpVmZhCB/image-25.png",
  "https://i.postimg.cc/v871BGTb/image-26.png",
  "https://i.postimg.cc/1XVJG4jC/image-27.png",
  "https://i.postimg.cc/fWHVXBcr/image-28.png",
  "https://i.postimg.cc/VNd8xWrd/image-29.png",
  "https://i.postimg.cc/wTGFW5pW/image-30.png",
  "https://i.postimg.cc/3JF0NYL2/image-31.png",
  "https://i.postimg.cc/yxY4ThH1/image-32.png",
  "https://i.postimg.cc/PJ4Dgj9b/image-33.png",
  "https://i.postimg.cc/Y9M6kPWN/image-34.png",
  "https://i.postimg.cc/4yCms7MD/image-35.png", 
  "https://i.postimg.cc/j2NvSfjP/image-36.png",
  "https://i.postimg.cc/8zd3b2NM/image-37.png",
  "https://i.postimg.cc/DzLqshh3/image-38.png",
  "https://i.postimg.cc/zG9Q8q7s/image-39.png",
  "https://i.postimg.cc/N0B11Vjy/image-40.png",
  "https://i.postimg.cc/Y9fCBrcR/image-41.png",
  "https://i.postimg.cc/PxqRTy97/image-42.png",
  "https://i.postimg.cc/Jn4zmw1W/image-43.png",
  "https://i.postimg.cc/KjjVmfkz/image-44.png",
  "https://i.postimg.cc/4yrTMqLZ/image-45.png",
  "https://i.postimg.cc/90WhjyVg/image-46.png",
  "https://i.postimg.cc/hPdrq6yw/image-47.png",
  "https://i.postimg.cc/sgf4ZxDF/image-48.png",
  "https://i.postimg.cc/26CkCs7x/image-49.png",
  "https://i.postimg.cc/KzjW7QG2/image-50.png",
  "https://i.postimg.cc/mkQKhkZz/image-51.png",
  "https://i.postimg.cc/ZY7dDHJQ/image-52.png",
  "https://i.postimg.cc/fycTZM65/image-53.png",
  "https://i.postimg.cc/52MkKL5Z/image-54.png",
  "https://i.postimg.cc/mrjqHkHK/image-55.png"
];

// Array of additional image URLs for overlay stamps
const overlayImages = [
  'https://i.postimg.cc/5Nj4kDJF/image-57.png',
  'https://i.postimg.cc/sxYNnjXR/image-58.png' // Fixed the quote error here
];

// Function to randomly select a stamp overlay
function setRandomOverlay() {
  // Get all postcards
  const postcards = document.querySelectorAll('.postcard');

  postcards.forEach(postcard => {
    // Create a new div for the stamp overlay
    const overlay = document.createElement('div');
    overlay.classList.add('stamp-overlay');

    // Randomly choose a background image from the overlayImages array
    const randomImage = overlayImages[Math.floor(Math.random() * overlayImages.length)];
    overlay.style.backgroundImage = `url(${randomImage})`;

    // Append the overlay to the postcard
    postcard.appendChild(overlay);
  });
}

// Call the function to set the random overlay
document.addEventListener('DOMContentLoaded', setRandomOverlay);

// Prompt for username and store in localStorage
function getOrCreateUsername() {
  let username = localStorage.getItem("username");
  if (!username) {
    username = prompt("Bitte stelle dich vor!");
    if (username) {
      localStorage.setItem("username", username);
    } else {
      alert("Bitte gib einen Namen an!");
      return null;
    }
  }
  return username;
}

// Create a new post
async function createPost() {
  const postContent = document.getElementById("postContent").value.trim();
  const imageUpload = document.getElementById("imageUpload");
  const imageFile = imageUpload.files[0];
  const username = getOrCreateUsername();

  if (!username || !postContent) {
    alert("Bitte gib einen Namen und Inhalt an.");
    return;
  }

  try {
    let imageUrl = null;

    if (imageFile) {
      const imageRef = ref(storage, `post_images/${Date.now()}_${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(imageRef);
    }

    const newPost = {
      content: postContent,
      timestamp: Timestamp.now(),
      author: username,
      imageUrl: imageUrl || null
    };

    await addDoc(collection(db, "posts"), newPost);

    alert("Beitrag erfolgreich erstellt!");
    document.getElementById("postContent").value = '';
    imageUpload.value = '';
    loadPosts();
  } catch (error) {
    console.error("Error creating post:", error);
    alert("Fehler beim Erstellen des Beitrags.");
  }
}

// Load posts from Firestore
async function loadPosts() {
  try {
    const postsCollection = collection(db, "posts");
    const q = query(postsCollection, orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);

    const postsContainer = document.getElementById("postsContainer");
    postsContainer.innerHTML = ''; // Clear the container before loading new posts

    querySnapshot.forEach((doc) => {
      const
