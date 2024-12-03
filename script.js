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
  "https://i.postimg.cc/SNcvn4Yc/image-86.png",
  "https://i.postimg.cc/yx0C6ZzZ/image-87.png",
  "https://i.postimg.cc/VN0GccwS/image-88.png",
  "https://i.postimg.cc/J4tjF5M0/image-89.png",
  "https://i.postimg.cc/MH9nWHJq/image-90.png",
  "https://i.postimg.cc/Dwn7CF9c/image-91.png",
  "https://i.postimg.cc/RVPgYL8b/image-92.png",
  "https://i.postimg.cc/QCvHBPCy/image-93.png",
  "https://i.postimg.cc/0jwBz7Kv/image-95.png",
  "https://i.postimg.cc/gcxJMrPP/image-96.png",
  "https://i.postimg.cc/QCfJxt0D/image-97.png",
  "https://i.postimg.cc/GtDT6mVz/image-98.png",
  "https://i.postimg.cc/wvfk9MWp/image-99.png",
  "https://i.postimg.cc/zD4ch2j1/image-100.png",
  "https://i.postimg.cc/t4qwRZk1/image-2024-12-03-T095149-762.png",
  "https://i.postimg.cc/nccGC48t/image-2024-12-03-T095239-047.png",
  "https://i.postimg.cc/V6fdDFWf/image-2024-12-03-T095409-152.png",
  "https://i.postimg.cc/wB06TYDz/image-2024-12-03-T095500-567.png",
  "https://i.postimg.cc/L8vXhPMG/image-2024-12-03-T095720-848.png",
  "https://i.postimg.cc/RCGbsV44/image-2024-12-03-T095805-485.png",
  "https://i.postimg.cc/3RtCBNpq/image-2024-12-03-T095930-790.png",
  "https://i.postimg.cc/ZRnyJcBf/image-2024-12-03-T100103-911.png",
  "https://i.postimg.cc/Hn50C2Rq/image-2024-12-03-T100120-494.png",
  "https://i.postimg.cc/3JFpCdTF/image-2024-12-03-T100147-519.png",
  "https://i.postimg.cc/3RhYBJ72/image-2024-12-03-T100216-803.png",
  "https://i.postimg.cc/FKg2hb5J/image-2024-12-03-T100359-758.png",
  "https://i.postimg.cc/wMKfJ7pd/image-2024-12-03-T100440-444.png",
  "https://i.postimg.cc/3xDkfNMq/image-2024-12-03-T100510-357.png",
  "https://i.postimg.cc/qBhgvgqv/image-2024-12-03-T100640-440.png",
  "https://i.postimg.cc/rwpBqRyh/image-2024-12-03-T100930-735.png",
  "https://i.postimg.cc/5tCktwhm/image-2024-12-03-T101247-667.png",
  "https://i.postimg.cc/RZR79GVt/image-2024-12-03-T101430-270.png",
  "https://i.postimg.cc/RV1fQGtY/image-2024-12-03-T101525-630.png",
  "https://i.postimg.cc/hGXfw0Jc/image-2024-12-03-T101549-877.png",
  "https://i.postimg.cc/52TxHW0W/image-2024-12-03-T101611-693.png",
  "https://i.postimg.cc/mZXKZNk0/image-2024-12-03-T101741-754.png",
  "https://i.postimg.cc/qRtDzWzS/image-2024-12-03-T101829-138.png",
  "https://i.postimg.cc/Y9wLWW97/image-2024-12-03-T101936-071.png",
  "https://i.postimg.cc/7YQCNc6m/image-2024-12-03-T102007-524.png",
  "https://i.postimg.cc/1X3tGc1k/image-2024-12-03-T102132-762.png",
  "https://i.postimg.cc/4dNZqf2t/image-2024-12-03-T102328-360.png",
  "https://i.postimg.cc/KYc8SDRR/image-2024-12-03-T102352-333.png",
  "https://i.postimg.cc/s21C46M9/image-2024-12-03-T094851-332-1.png"
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
    const randomImage =
      overlayImages[Math.floor(Math.random() * overlayImages.length)];
    overlay.style.backgroundImage = `url(${randomImage})`;
    postcard.appendChild(overlay);
  });
}

// Prompt for username and save in localStorage
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

// Create a new post
async function createPost() {
  const postContent = document.getElementById("postContent").value.trim();
  const imageUpload = document.getElementById("imageUpload");
  const imageFile = imageUpload.files[0];
  const username = getOrCreateUsername();

  if (!username || !postContent) {
    alert("Leere Postkarten sind wie Plätzchen ohne Streusel...");
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
      imageUrl: imageUrl || null,
    };

    await addDoc(collection(db, "posts"), newPost);

    alert("Hier geht die Post ab!");
    document.getElementById("postContent").value = "";
    imageUpload.value = "";
    loadPosts();
  } catch (error) {
    console.error("Error creating post:", error);
    alert("zzzzzZZZZZZzzz... Hier döst der Postbote. Komm in ein ein Paar Minuten nochmals vorbei.");
  }
}

// Load posts from Firestore
async function loadPosts() {
  try {
    const postsCollection = collection(db, "posts");
    const q = query(postsCollection, orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);

    const postsContainer = document.getElementById("postsContainer");
    postsContainer.innerHTML = ""; // Clear previous posts

    querySnapshot.forEach((doc) => {
      const postData = doc.data();
      displayPost(postData);
    });

    setRandomOverlay(); // Add random overlays to posts
  } catch (error) {
    console.error("Error loading posts:", error);
    alert("Na sowas... Da muss jemand wohl seinen Briefkasten leeren.");
  }
}

// Display a single post
function displayPost(post) {
  const randomStamp = stampUrls[Math.floor(Math.random() * stampUrls.length)];
  const postElement = document.createElement("div");
  postElement.classList.add("postcard");

  let formattedDate = "Unbekanntes Datum";
  if (post.timestamp && post.timestamp.toDate) {
    formattedDate = post.timestamp.toDate().toLocaleDateString("de-DE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const formattedTime = post.timestamp.toDate().toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    });
    formattedDate += `<br>${formattedTime}`; // Add time below the date
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
          <p>Mit Liebe verfasst</p>
        </div>
      </div>
    </div>
  `;

  const postsContainer = document.getElementById("postsContainer");
  postsContainer.appendChild(postElement);
}

// Delete a post
async function deletePost(postId) {
  try {
    await deleteDoc(doc(db, "posts", postId));
    alert("Die schöne Nachricht behalt ich im Herz, gewiss sei dir kein Trennungsschmerz!");
    loadPosts();
  } catch (error) {
    console.error("Error deleting post:", error);
    alert("Hoppla! Dann sind wir wohl noch nicht abschiedsreif... Noch eine Weile bleib ich bei dir!");
  }
}

// Attach event listeners
document.getElementById("postButton").addEventListener("click", createPost);
window.onload = loadPosts;
