document.addEventListener('DOMContentLoaded', function () {

    // ----------------------------
    // Posting Feature
    // ----------------------------
  
    const addPostBtn = document.getElementById('add-post-btn');
    const cancelPostBtn = document.getElementById('cancel-post-btn');
    const eventForm = document.getElementById('eventForm');
  
    if (addPostBtn && cancelPostBtn && eventForm) {
      // Only add listeners if the elements exist
      addPostBtn.addEventListener('click', function () {
        document.getElementById('post-form-popup').style.display = 'block';
      });
  
      cancelPostBtn.addEventListener('click', function () {
        document.getElementById('post-form-popup').style.display = 'none';
      });
  
      eventForm.addEventListener('submit', function (e) {
        e.preventDefault();
        console.log('Post form submission prevented.');
  
        const title = document.getElementById('eventTitle').value;
        const details = document.getElementById('eventDetails').value;
  
        const post = {
          title: title,
          details: details,
          timestamp: new Date().toLocaleString()
        };
  
        addPostToFeed(post);
  
        document.getElementById('post-form-popup').style.display = 'none';
        eventForm.reset();
      });
  
      function addPostToFeed(post) {
        const feedContainer = document.getElementById('feed-container');
  
        const postElement = document.createElement('div');
        postElement.classList.add('event-post');
  
        postElement.innerHTML = `
          <h3>${post.title}</h3>
          <p>${post.details}</p>
          <small>Posted on ${post.timestamp}</small>
        `;
  
        feedContainer.prepend(postElement);
      }
    } else {
      console.error("Post form elements not found.");
    }
  
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
  
        if (email.endsWith('@psu.edu')) {
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
          message.textContent = 'Please enter a valid PSU email address (e.g., name@psu.edu).';
        }
      });
  
      verificationForm.addEventListener('submit', function (e) {
        e.preventDefault();
        console.log('Verification form submission prevented.');
  
        const email = document.getElementById('email').value;
        const verificationCode = document.getElementById('verificationCode').value;
        const message = document.getElementById('message');
  
        fetch('http://localhost:3000/verify-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, code: verificationCode }),
        })
        .then((response) => response.text())
        .then((data) => {
          if (data === 'Code verified, login successful!') {
            message.textContent = '';
            alert('Login successful! Redirecting to LionLink...');
            window.location.href = 'index.html';
          } else {
            message.textContent = 'Invalid verification code. Please try again.';
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          message.textContent = 'Error verifying code. Please try again.';
        });
      });
    } else {
      console.error("Email or verification form elements not found.");
    }
  
  });
  