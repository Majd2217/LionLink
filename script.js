document.addEventListener('DOMContentLoaded', function () {
  const addPostBtn = document.getElementById('add-post-btn');
  const cancelPostBtn = document.getElementById('cancel-post-btn');
  const eventForm = document.getElementById('eventForm');
  const feedContainer = document.getElementById('feed-container');

  // Load posts from the server on page load
  loadPostsFromServer();

  if (addPostBtn && cancelPostBtn && eventForm) {
    // Show post form popup when "Add Post" button is clicked
    addPostBtn.addEventListener('click', function () {
      document.getElementById('post-form-popup').style.display = 'block';
    });

    // Hide post form popup when "Cancel" is clicked
    cancelPostBtn.addEventListener('click', function () {
      document.getElementById('post-form-popup').style.display = 'none';
    });

    // Submit form to create a new post
    eventForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const title = document.getElementById('eventTitle').value;
      const details = document.getElementById('eventDetails').value;

      const post = {
        title: title,
        details: details,
        timestamp: new Date().toLocaleString(),
      };

      addPostToFeed(post);
      savePostToServer(post); // Save the post to the server

      document.getElementById('post-form-popup').style.display = 'none';
      eventForm.reset();
    });
  }

  // Function to add a post to the feed
  function addPostToFeed(post) {
    const postElement = document.createElement('div');
    postElement.classList.add('event-post');

    postElement.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.details}</p>
      <small>Posted on ${post.timestamp}</small>
    `;

    feedContainer.prepend(postElement);
  }

  // Save posts to the server
  function savePostToServer(post) {
    fetch('http://localhost:3000/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    }).catch((error) => console.error('Error saving post to server:', error));
  }

  // Load posts from the server
  function loadPostsFromServer() {
    fetch('http://localhost:3000/posts')
      .then((response) => response.json())
      .then((posts) => posts.forEach(addPostToFeed))
      .catch((error) => console.error('Error loading posts from server:', error));
  }
});

  // ----------------------------
  // Email Verification Feature
  // ----------------------------

  const emailForm = document.getElementById('emailForm');
  const verificationForm = document.getElementById('verificationForm');

  if (emailForm && verificationForm) {
    emailForm.addEventListener('submit', function (e) {
      e.preventDefault();
      console.log('Email form submission prevented.');

      const email = document.getElementById('email').value;
      const message = document.getElementById('message');

      if (email.endsWith('@psu.edu') || email.endsWith('@gmail.com')) {
        fetch('http://localhost:3000/send-verification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        })
        .then((response) => response.text())
        .then((data) => {
          message.textContent = 'Verification code sent!';
          document.getElementById('verification-section').classList.remove('hidden');
        })
        .catch((error) => {
          console.error('Error:', error);
          message.textContent = 'Error sending verification code. Please try again.';
        });
      } else {
        message.textContent = 'Please enter a valid PSU or Gmail email address.';
      }
    });

    verificationForm.addEventListener('submit', function (e) {
      e.preventDefault();
      console.log('Verification form submission prevented.');

      const message = document.getElementById('message');

      // Here we simulate accepting any verification code for demo purposes
      // You can add any condition to accept the code for the demo.
      
      message.textContent = '';
      alert('Login successful! Redirecting to LionLink...');
      window.location.href = 'index.html';
    });
  } else {
    console.error("Email or verification form elements not found.");
  }

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
  // Fetch scraped events from your backend
  fetch('http://localhost:3000/scraped-events')
    .then(response => response.json())
    .then(events => {
      const eventsContainer = document.getElementById('events-list');
      eventsContainer.innerHTML = '';  // Clear existing content

      // Check if there are any events returned
      if (events.length > 0) {
        // Loop through each event and add it to the page
        events.forEach(event => {
          const eventElement = document.createElement('div');
          eventElement.classList.add('event-card');

          eventElement.innerHTML = `
            <h3>${event.title}</h3>
            <a href="${event.link}" target="_blank">More Info</a>
          `;

          eventsContainer.appendChild(eventElement);
        });
      } else {
        // If no events are found, display a message
        eventsContainer.innerHTML = '<p>No upcoming events found.</p>';
      }
    })
    .catch(error => console.error('Error fetching events:', error));
});

document.addEventListener('DOMContentLoaded', function () {
  // Fetch scraped events from your backend
  fetch('http://localhost:3000/scraped-events')
    .then(response => response.json())
    .then(events => {
      const eventsList = document.getElementById('events-list');
      eventsList.innerHTML = '';  // Clear existing content

      // Check if there are any events returned
      if (events.length > 0) {
        // Loop through each event and add it to the page
        events.forEach(event => {
          const eventElement = document.createElement('div');
          eventElement.classList.add('event-post');

          eventElement.innerHTML = `
            <h3>${event.title}</h3>
            <p>${formatEventDetails(event.title)}</p>
            <a href="${event.link}" target="_blank">More Info</a>
          `;

          eventsList.appendChild(eventElement);
        });
      } else {
        // If no events are found, display a message
        eventsList.innerHTML = '<p>No upcoming events found.</p>';
      }
    })
    .catch(error => console.error('Error fetching events:', error));
});

// Helper function to extract and format event details from the title
function formatEventDetails(title) {
  // Assuming the event details are separated by newline characters
  const details = title.split('\n');
  // Join the details with a space or format as needed
  return details.slice(1).join(' ');
}

