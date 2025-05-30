// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBOoJ-l1ptwx4A3M09yKyWBc4KZapqW67E",
  authDomain: "omnicore-4b120.firebaseapp.com",
  projectId: "omnicore-4b120",
  storageBucket: "omnicore-4b120.firebasestorage.app",
  messagingSenderId: "1071102207648",
  appId: "1:1071102207648:web:37a8753350ee61f1554bc5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  googleProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
};
