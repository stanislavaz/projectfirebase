
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
    alert("Der Name und seine Bedeutung sind allein schon jeden Preis wert, den du willst.");
    return;
  }

  const newPost = {
    content: postContent,
    timestamp: Timestamp.fromDate(new Date()),
    author: username,
    userID: localStorage.getItem("userID") || generateUserID()
  };

  try {
    if (imageFile) {
      newPost.imageUrl = await uploadImage(imageFile);
    }

    await addDoc(collection(db, "posts"), newPost);
    alert("Im Briefkasten geht die Post ab!");
    document.getElementById("postContent").value = "";
    imageUpload.value = "";
    loadPosts();
  } catch (error) {
    console.error("Na sowas... Vielleicht klappt's beim nächsten Mal!", error);
    alert("Kopf hoch! Das nächste Mal klappt es ganz sicher.");
  }
}

// Function to upload an image to Firebase Storage
async function uploadImage(file) {
  const storageRef = ref(storage, `images/${file.name}`);
  await uploadBytes(storageRef, file);
  const imageUrl = await getDownloadURL(storageRef);
  return imageUrl;
}

// Generates a userID if none exists
function generateUserID() {
  const userID = "user_" + Math.random().toString(36).substr(2, 9);
  localStorage.setItem("userID", userID);
  return userID;
}

// Function to load posts from Firestore in chronological order (newest first)
async function loadPosts() {
  const postsQuery = query(
    collection(db, "posts"),
    orderBy("timestamp", "desc")
  );

  const querySnapshot = await getDocs(postsQuery);
  const postsContainer = document.getElementById("postsContainer");
  postsContainer.innerHTML = "";

  querySnapshot.forEach((doc) => {
    const post = { id: doc.id, ...doc.data() };
    displayPost(post);
  });
}

// Function to display a post in the DOM
function displayPost(post) {
  const postElement = document.createElement("div");
  postElement.classList.add("postcard");

  const randomStamp = stampUrls[Math.floor(Math.random() * stampUrls.length)];

  let formattedDate = "Date not available";
  if (post.timestamp) {
    const timestamp =
      post.timestamp instanceof Timestamp
        ? post.timestamp.toDate()
        : new Date(post.timestamp.seconds * 1000);
    if (timestamp instanceof Date && !isNaN(timestamp)) {
      formattedDate = timestamp.toLocaleString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      });
    }
  }

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
          ${
            post.imageUrl
              ? `<img src="${post.imageUrl}" alt="Postcard Image">`
              : ""
          }
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
