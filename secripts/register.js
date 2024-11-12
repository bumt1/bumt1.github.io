// Import Firebase initialization and Firestore
import { auth, db } from './firebaseauth.js';
import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { showGlobalNotification } from '../utils/global-notification.js';


// Register form action
document.getElementById('signUpSubmit').addEventListener('click', function (event) {
  event.preventDefault();  // Prevent form submission
  console.log("Sign-up button clicked");

  // Get email, password and other fields
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  const username = document.getElementById('registerUsername').value;  // Assuming you have a username field

  console.log("object", email , password , username)
  if (email!='' && password!='' && username!='') {
    // Create user with email and password in Firebase Authentication
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // User registration successful
        const user = userCredential.user;

        // Set the displayName (username) for the user
        await updateProfile(user, {
          displayName: username
        });

        // Store user details in Firestore
        await setDoc(doc(db, "users", user.uid), {
          username: username,
          email: user.email,
          password: password,  // Note: It's generally not recommended to store raw passwords; consider hashing
          createdAt: new Date(),
          deletedAt: null  // Add null for deletedAt as it's not yet deleted
        });

        // Store user data in sessionStorage
        sessionStorage.setItem('user', JSON.stringify(user));

        // Redirect to the account page
        window.location.href = "../account/index.html";
        showGlobalNotification('success', `Registration successful!`);
        console.log('User registered and saved to Firestore:', user);
      })
      .catch((error) => {
        // Handle errors
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Registration error:', errorCode, errorMessage);
        showGlobalNotification('error', `Error: ${errorMessage}`);

      });
  }else{
    showGlobalNotification('warning', `Please fill all mandatory fields!`);
  }

});
