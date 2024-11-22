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
  "https://i.postimg.cc/mrjqHkHK/image-55.png",
  "https://i.postimg.cc/bJ3p182C/image-71.png",
  "https://i.postimg.cc/t4vX19WB/image-72.png",
  "https://i.postimg.cc/15YTwX7V/image-73.png",
  "https://i.postimg.cc/Bv3CKG31/image-74.png",
  "https://i.postimg.cc/CxrqFT1g/image-75.png",
  "https://i.postimg.cc/fTZ2dXvb/image-76.png",
  "https://i.postimg.cc/3Jsw98dW/image-77.png",
  "https://i.postimg.cc/Jhvm7KZ0/image-78.png",
  "https://i.postimg.cc/FR4WxLQG/image-80.png",
  "https://i.postimg.cc/VsH9fCHT/image-81.png",
  "https://i.postimg.cc/BnyQtqGJ/image-82.png",
  "https://i.postimg.cc/XNGM7wYB/image-83.png",
  "https://i.postimg.cc/TwQnzyZR/image-84.png",
  "https://i.postimg.cc/nL3zZvcw/image-85.png",
  "https://i.postimg.cc/SNcvn4Yc/image-86.png","
  "https://i.postimg.cc/yx0C6ZzZ/image-87.png",
  "https://i.postimg.cc/VN0GccwS/image-88.png",
  "https://i.postimg.cc/J4tjF5M0/image-89.png",
  "https://i.postimg.cc/MH9nWHJq/image-90.png",
  "https://i.postimg.cc/Dwn7CF9c/image-91.png",
  "https://i.postimg.cc/RVPgYL8b/image-92.png",
  "https://i.postimg.cc/QCvHBPCy/image-93.png"
];

// Array of additional image URLs for overlay stamps
const overlayImages = [
  'https://i.postimg.cc/5Nj4kDJF/image-57.png',
  'https://i.postimg.cc/sxYNnjXR/image-58.png',
  'https://i.postimg.cc/5tkwn13k/image-60.png',
  'https://i.postimg.cc/ZK7K9RKg/image-61.png',
  'https://i.postimg.cc/SRLdZ3j2/image-63.png',
  'https://i.postimg.cc/Kzpx1pmT/image-65.png',
  'https://i.postimg.cc/hPYLgKx8/image-68.png',
  'https://i.postimg.cc/t4xxjfhY/image-70.png'
];

// Function to randomly select a stamp overlay
function setRandomOverlay() {
  const postcards = document.querySelectorAll(".postcard");
  postcards.forEach((postcard) => {
    const overlay = document.createElement("div");
    overlay.classList.add("stamp-overlay");
    const randomImage = overlayImages[Math.floor(Math.random() * overlayImages.length)];
    overlay.style.backgroundImage = `url(${randomImage})`;
    postcard.appendChild(overlay);
  });
}

// Prompt for username and save in localStorage
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
      console.log("Uploading image...");
      await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(imageRef);
      console.log("Image uploaded. URL:", imageUrl);
    }

    const newPost = {
      content: postContent,
      timestamp: Timestamp.now(),
      author: username,
      imageUrl: imageUrl || null
    };

    console.log("Adding new post to Firestore:", newPost);
    await addDoc(collection(db, "posts"), newPost);

    alert("Beitrag erfolgreich erstellt!");
    document.getElementById("postContent").value = "";
    imageUpload.value = "";
    await loadPosts();
  } catch (error) {
    console.error("Error creating post:", error);
    alert("Fehler beim Erstellen des Beitrags.");
  }
}

// Load posts from Firestore
async function loadPosts() {
  try {
    console.log("Fetching posts from Firestore...");
    const postsCollection = collection(db, "posts");
    const q = query(postsCollection, orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);

    const postsContainer = document.getElementById("postsContainer");
    if (!postsContainer) {
      console.error("Posts container not found in DOM.");
      return;
    }

    postsContainer.innerHTML = ""; // Clear previous posts

    querySnapshot.forEach((doc) => {
      const postData = doc.data();
      console.log("Fetched post data:", postData);
      displayPost(postData);
    });

    setRandomOverlay(); // Add random overlays to posts
  } catch (error) {
    console.error("Error loading posts:", error);
    alert("Fehler beim Laden der Beiträge.");
  }
}

// Display a single post
function displayPost(post) {
  console.log("Rendering post:", post); // Debugging line
  const randomStamp = stampUrls[Math.floor(Math.random() * stampUrls.length)];
  const postElement = document.createElement("div");
  postElement.classList.add("postcard");

  let formattedDate = "Unbekanntes Datum";
  if (post.timestamp && post.timestamp.toDate) {
    formattedDate = post.timestamp.toDate().toLocaleDateString("de-DE", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    const formattedTime = post.timestamp.toDate().toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit"
    });
    formattedDate += `<br>${formattedTime}`;
  }

  postElement.innerHTML = `
    <div class="postcard-border">
      <div class="postcard-content">
        <div class="stamp" style="background-image: url('${randomStamp}');"></div>
        <div class="post-header">
          <strong class="author">${post.author || "Anonym"}</strong>
          <p class="timestamp">${formattedDate}</p>
        </div>
        <div class="message">
          <p>${post.content}</p>
          ${post.imageUrl ? `<img src="${post.imageUrl}" alt="Postcard Image">` : ""}
        </div>
        <div class="post-footer">
          <p>Mit Liebe geschrieben</p>
        </div>
      </div>
    </div>
  `;

  const postsContainer = document.getElementById("postsContainer");
  postsContainer.appendChild(postElement);
}

// Attach event listeners
document.getElementById("postButton").addEventListener("click", createPost);
window.onload = async () => {
  console.log("Page loaded. Loading posts...");
  await loadPosts();
};
