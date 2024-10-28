// Function to create a new post
function createPost() {
  const postContent = document.getElementById('postContent').value;
  const imageUpload = document.getElementById('imageUpload');
  const imageFile = imageUpload.files[0];
  const author = prompt("Please enter your username:"); // Get author's name

  if (postContent.trim() !== "" && author) { // Only proceed if author name is entered
    const timestamp = new Date().toLocaleString();
    let newPost = {
      content: postContent,
      timestamp: timestamp,
      reactions: {},
      author: author // Store the entered author name
    };

    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        newPost.imageUrl = event.target.result;
        storePost(newPost);
        displayPost(newPost);
        document.getElementById('postContent').value = "";
        imageUpload.value = '';
      };
      reader.readAsDataURL(imageFile);
    } else {
      storePost(newPost);
      displayPost(newPost);
      document.getElementById('postContent').value = "";
    }
  }
}

// Function to store a post in local storage
function storePost(post) {
  let posts = getPosts();
  posts.push(post);
  localStorage.setItem('posts', JSON.stringify(posts));
}

// Function to get posts from local storage
function getPosts() {
  let posts = localStorage.getItem('posts');
  if (posts) {
    return JSON.parse(posts);
  } else {
    return [];
  }
}

// Function to display a post
function displayPost(post) {
  const newPost = document.createElement('div');
  newPost.classList.add('post');

  let postHTML = `
        <h3>${post.author}</h3>
        <p class="timestamp">${post.timestamp}</p>
        <p>${post.content}</p>
    `;

  if (post.imageUrl) {
    postHTML += `<img src="${post.imageUrl}" alt="Post Image">`;
  }

  postHTML += `
        <div class="comments">
            </div>
        <textarea id="newComment" placeholder="Write your comment..."></textarea>
        <button onclick="addComment(this)">Comment</button>
        <button onclick="deletePost(this)">Delete Post</button>
        <div class="reactions" style="display:none;">
            </div>
    `;

  newPost.innerHTML = postHTML;
  document.getElementById('postsContainer').appendChild(newPost);

  // Load existing reactions from the post element (if they exist)
  const existingReactions = newPost.dataset.reactions ? JSON.parse(newPost.dataset.reactions) : {};
  // Update the post's reactions with the loaded data
  post.reactions = existingReactions;

  // Add reaction buttons to the post
  addReactionButtons(newPost, post.reactions);
  // Store reactions on the post element
  newPost.dataset.reactions = JSON.stringify(post.reactions);

  // Add "React" button if the post is not by the current user
  if (post.author !== "You") {
    const reactButton = document.createElement('button');
    reactButton.textContent = "React";
    reactButton.addEventListener('click', () => {
      const reactionsContainer = newPost.querySelector('.reactions');
      if (reactionsContainer.style.display === "none") {
        reactionsContainer.style.display = "block";
      } else {
        reactionsContainer.style.display = "none";
      }
    });
    newPost.appendChild(reactButton);
  }
}

// Function to add reaction buttons to a post or comment
function addReactionButtons(element, reactions) {
  const reactionContainer = element.querySelector('.reactions');

  // Sample GIF URLs (replace with your own)
  const gifUrls = {
    '👍': 'https://i.postimg.cc/DZC4Sxz8/1213-gimmefood.gif',
    '👎': 'https://i.postimg.cc/jSr2dphM/2941-bearthumbsup.gif',
    '❤️': 'https://i.postimg.cc/Hxjshdpk/4672-milk9.gif',
    '😂': 'https://i.postimg.cc/2jbnqf4Y/6461-Hug-Bear-Feels.gif',
    '🤯': 'https://i.postimg.cc/Dy1sgdjY/51520-milkandmochalove1.gif',
    '🥺': 'https://i.postimg.cc/TP3DT8RZ/58253-milkandmochalove5.gif',
    '✨': 'https://i.postimg.cc/sXBGZpGm/2660-bearslide.gif',
    '💯': 'https://i.postimg.cc/MZQj6mSK/3264-milk2.gif',
    '😎': 'https://i.postimg.cc/sDCGvGjP/5296-milk4.gif',
    '😭': 'https://i.postimg.cc/t4X1z0VY/11596-milkandmochalove4.gif',
    '😴': 'https://i.postimg.cc/s2LvyvHh/49142-milkandmochalove6.gif',
    '😮‍💨': 'https://i.postimg.cc/s2LvyvHh/49142-milkandmochalove6.gif'
  };

  for (const emoji in gifUrls) {
    const button = document.createElement('button');
    // Remove the text content
    // button.textContent = emoji;

    // Add data-emoji attribute to the button
    button.dataset.emoji = emoji;
    button.style.width = '30px';
    button.style.height = '30px';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.backgroundImage = `url(${gifUrls[emoji]})`;
    button.style.backgroundSize = 'cover';

    // Check if reaction is already added
    if (reactions && reactions[emoji]) {
      button.classList.add('active'); // Add active class for styling
    }

    button.addEventListener('click', () => {
      toggleReaction(element, emoji);
    });

    reactionContainer.appendChild(button);
  }
}

// Function to toggle a reaction
function toggleReaction(element, emoji) {
  const reactions = element.dataset.reactions ? JSON.parse(element.dataset.reactions) : {}; // Get existing reactions
  const button = element.querySelector(`button[data-emoji="${emoji}"]`);
  if (reactions[emoji]) {
    delete reactions[emoji];
    button.classList.remove('active'); // Remove active class
  } else {
    reactions[emoji] = true;
    button.classList.add('active'); // Add active class
  }
  element.dataset.reactions = JSON.stringify(reactions); // Update reactions data
  // Display the reaction
  displayReaction(element, emoji); // Call displayReaction here

  // Update the post object in local storage with the new reactions
  const posts = getPosts();
  const postIndex = Array.from(document.getElementById('postsContainer').children).indexOf(element);
  if (postIndex !== -1) {
    posts[postIndex].reactions = reactions;
    localStorage.setItem('posts', JSON.stringify(posts));
  }
}

// Function to add a comment
function addComment(button) {
  const commentContent = button.previousElementSibling.value;
  if (commentContent.trim() !== "") {
    const newComment = document.createElement('div');
    newComment.classList.add('comment');
    newComment.textContent = commentContent;
    newComment.innerHTML += `<button onclick="deleteComment(this)">Delete Comment</button>`; // Add delete button
    button.parentElement.querySelector('.comments').appendChild(newComment);
    button.previousElementSibling.value = "";
    addReactionButtons(newComment, {}); // Add reactions to the new comment

    // Add "React" button if the comment is not by the current user
    if (post.author !== "You") {
      const reactButton = document.createElement('button');
      reactButton.textContent = "React";
      reactButton.addEventListener('click', () => {
        const reactionsContainer = newComment.querySelector('.reactions');
        if (reactionsContainer.style.display === "none") {
          reactionsContainer.style.display = "block";
        } else {
          reactionsContainer.style.display = "none";
        }
      });
      newComment.appendChild(reactButton);
    }
  }
}

// Function to delete a post
function deletePost(button) {
  const postToDelete = button.parentElement;
  const posts = getPosts();
  const index = Array.from(document.getElementById('postsContainer').children).indexOf(postToDelete);

  if (index !== -1) {
    posts.splice(index, 1);
    localStorage.setItem('posts', JSON.stringify(posts));
    postToDelete.remove();
  }
}

// Function to delete a comment
function deleteComment(button) {
  const commentToDelete = button.parentElement;
  commentToDelete.remove();
}

// Function to display a reaction (implementation example)
function displayReaction(element, emoji) {
  // You can implement your specific display logic here, 
  // for example, adding the emoji to an element, or changing the button's style.
  console.log(`Reaction ${emoji} toggled on element:`, element); 
}


// Load posts from local storage on page load
window.onload = function() {
  const posts = getPosts();
  posts.forEach(post => displayPost(post));
};
