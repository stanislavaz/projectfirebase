
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

// Array for stamp URLs (update these with your own URLs)
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
  "https://i.postimg.cc/bvPdxMs1/image-24.png"
  "https://i.postimg.cc/MpVmZhCB/image-25.png",
  "https://i.postimg.cc/v871BGTb/image-26.png",
  "https://i.postimg.cc/1XVJG4jC/image-27.png",
  "https://i.postimg.cc/fWHVXBcr/image-28.png",
  "https://i.postimg.cc/VNd8xWrd/image-29.png",
  "https://i.postimg.cc/wTGFW5pW/image-30.png",
  "https://i.postimg.cc/3JF0NYL2/image-31.png",
  "https://i.postimg.cc/yxY4ThH1/image-32.png",
  "https://i.postimg.cc/PJ4Dgj9b/image-33.png"
];

// Function to prompt for a username and store it in localStorage
function getOrCreateUsername() {
  let username = localStorage.getItem("username");
  if (!username) {
    username = prompt("Oh weh! Wir haben uns einander doch noch gar nicht vorgestellt... Von der sicheren Anonymität der Namenlosen können die Namhaften nur träumen!");
    if (username) {
      localStorage.setItem("username", username);
    } else {
      alert("Nenn' ich dich, so kenn' ich dich!");
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
    alert("Bitte gib deinen Namen und den Inhalt des Beitrags an.");
    return;
  }

  try {
    let imageUrl = null;

    // Upload image if available
    if (imageFile) {
      const imageRef = ref(storage, `post_images/${Date.now()}_${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(imageRef);
    }

    // Create new post object
    const newPost = {
      content: postContent,
      timestamp: Timestamp.now(), // Firestore timestamp
      author: username,
      imageUrl: imageUrl || null,
    };

    // Save post to Firestore
    await addDoc(collection(db, "posts"), newPost);

    alert("Beitrag erfolgreich erstellt!");
    document.getElementById("postContent").value = '';
    imageUpload.value = '';
    loadPosts(); // Reload posts
  } catch (error) {
    console.error("Error creating post:", error);
    alert("Fehler beim Erstellen des Beitrags. Überprüfe die Verbindung.");
  }
}

// Function to upload an image to Firebase Storage
async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch('/upload', { method: 'POST', body: formData });
  if (response.ok) {
    const data = await response.json();
    return data.imageUrl;
  }
  return null;
}

// Generates a userID if none exists
function generateUserID() {
  const userID = "user_" + Math.random().toString(36).substr(2, 9);
  localStorage.setItem("userID", userID);
  return userID;
}

// Function to load posts from Firestore in chronological order (newest first)
async function loadPosts() {
  try {
    const postsCollection = collection(db, "posts");
    const q = query(postsCollection, orderBy("timestamp", "desc")); // Newest first
    const querySnapshot = await getDocs(q);

    const postsContainer = document.getElementById("postsContainer");
    postsContainer.innerHTML = ''; // Clear existing posts

    querySnapshot.forEach((doc) => {
      const postData = doc.data();
      postData.id = doc.id; // Save document ID for potential deletions
      displayPost(postData);
    });
  } catch (error) {
    console.error("Error loading posts:", error);
    alert("Fehler beim Laden der Beiträge. Überprüfe die Verbindung.");
  }
}


// Function to display a post in the DOM
function displayPost(post) {
  const randomStamp = stampUrls[Math.floor(Math.random() * stampUrls.length)];

  const postElement = document.createElement("div");
  postElement.classList.add("postcard");

  let formattedDate = post.timestamp?.toDate
    ? post.timestamp.toDate().toLocaleString("de-DE") // Firestore timestamp
    : new Date(post.timestamp).toLocaleString("de-DE");

  postElement.innerHTML = `
    <div class="postcard-border">
      <div class="postcard-content">
        <div class="stamp" style="background-image: url('${randomStamp}');"></div>
        <div class="addressor">
          <strong>${post.author || "Anonym"}</strong>
          <p class="timestamp">${formattedDate}</p>
        </div>
        <div class="message">
          <p>${post.content}</p>
          ${post.imageUrl ? `<img src="${post.imageUrl}" alt="Postcard Image">` : ''}
        </div>
      </div>
    </div>
  `;

  document.getElementById("postsContainer").appendChild(postElement);
}


async function deletePost(postId) {
  try {
    const response = await fetch(`/posts/${postId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      alert("Die schöne Nachricht behalt ich im Herz, gewiss sei dir kein Trennungsschmerz!");
      loadPosts(); // Refresh the posts container
    } else {
      console.error("Hoppla! Dann sind wir wohl noch nicht Abschiedsreif!", response.status);
      alert("Noch eine Weile bleib ich bei dir!");
    }
  } catch (error) {
    console.error("Fehler beim Löschen des Beitrags:", error);
    alert("Fehler beim Löschen des Beitrags.");
  }
}

// Event listener for the Post button
document.getElementById("postButton").addEventListener("click", createPost);

// Load posts when the page loads
window.onload = loadPosts;
// Function to delete a post from Firestore
