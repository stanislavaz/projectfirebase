// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-storage.js";
import { query, orderBy, getDocs as getFirestoreDocs, collection as getCollection } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-firestore.js"; // Ensure you're importing query and orderBy correctly
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
// Function to create a new post
async function createPost() {
  const postContent = document.getElementById("postContent").value.trim();
  const imageUpload = document.getElementById("imageUpload");
  const imageFile = imageUpload.files[0];  // Getting the file from input
  const username = getOrCreateUsername();

  if (!username || !postContent) {
    alert("Der Name und seine Bedeutung sind allein schon jeden Preis wert, den du willst.");
    return;
  }

  const newPost = {
    content: postContent,
    timestamp: Timestamp.fromDate(new Date()), // Store timestamp as Firebase Timestamp
    author: username,
    userID: localStorage.getItem("userID") || generateUserID(), // Ensures userID is present
  };

  try {
    // Handle image upload if an image file is provided
    if (imageFile) {
      newPost.imageUrl = await uploadImage(imageFile);
    }

    // Add the new post document to Firestore
    await addDoc(collection(db, "posts"), newPost);
    alert("Im Briefkasten geht die Post ab!");
    document.getElementById("postContent").value = "";
    imageUpload.value = "";
    loadPosts(); // Reload posts after new post is created
  } catch (error) {
    console.error("Na sowas... Vielleicht klappt's beim nächsten Mal!", error);
    alert("Kopf hoch! Das nächste Mal klappt es ganz sicher.");
  }
}

// Function to upload an image to Firebase Storage
async function uploadImage(file) {
  const storageRef = ref(storage, `images/${file.name}`);  // Firebase Storage path
  await uploadBytes(storageRef, file);  // Upload the image file
  const imageUrl = await getDownloadURL(storageRef);  // Get the download URL of the uploaded image
  return imageUrl;  // Return the URL to associate with the post
}


// Generates a userID if none exists
function generateUserID() {
  const userID = 'user_' + Math.random().toString(36).substr(2, 9);
  localStorage.setItem("userID", userID);
  return userID;
}

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
function displayPost(post) {
  const postElement = document.createElement("div");
  postElement.classList.add("postcard");

  // Randomly select a URL for the stamp from your dataset (replace with your own URLs)
  const stampUrls = ["stamp1.png", "stamp2.png", "stamp3.png"]; // Add actual URLs here
  const randomStamp = stampUrls[Math.floor(Math.random() * stampUrls.length)];

  let formattedDate = "Date not available";
  if (post.timestamp) {
    const timestamp = post.timestamp instanceof Timestamp ? post.timestamp.toDate() : new Date(post.timestamp.seconds * 1000);
    if (timestamp instanceof Date && !isNaN(timestamp)) {
      formattedDate = timestamp.toLocaleString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
    }
  }

  // HTML structure for the postcard
  postElement.innerHTML = `
    <div class="postcard-border">
      <div class="postcard-content">
        <div class="stamp" style="background-image: url('${randomStamp}');"></div>
        <div class="addressor">
          <strong>${post.author}</strong>
          <p class="timestamp">${formattedDate}</p>
        </div>
        <div class="message">
          <p>${post.content}</p>
          ${post.imageUrl ? `<img src="${post.imageUrl}" alt="Postcard Image">` : ""}
        </div>
      </div>
    </div>
    <button class="button deleteButton" data-id="${post.id}">Löschen</button>
  `;

  document.getElementById("postsContainer").appendChild(postElement);

  const deleteButton = postElement.querySelector(".deleteButton");
  if (deleteButton) {
    deleteButton.addEventListener("click", () => {
      const confirmDelete = confirm("Sagen wir uns schon so bald Lebewohl?");
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
    alert("Die schöne Nachricht behalt ich im Herz, gewiss sei dir kein Trennungsschmerz!");
    loadPosts();
  } catch (error) {
    console.error("Hoppla! Dann sind wir wohl noch nicht Abschiedsreif!:", error);
    alert("Noch eine Weile bleib ich bei dir!");
  }
}

// Event listener for the Post button
document.getElementById("postButton").addEventListener("click", createPost);

// Load posts when the page is loaded
window.onload = loadPosts;
