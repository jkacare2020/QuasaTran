// src/firebase/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDVTUQ4a4fSSee2wtgchSEIhoUjuEOQ4hM",
  authDomain: "guasar-jason2024.firebaseapp.com",
  projectId: "guasar-jason2024",
  storageBucket: "guasar-jason2024.appspot.com",
  messagingSenderId: "674790374620",
  appId: "1:674790374620:web:686549913e10282b728819",
};

// const firebaseConfig = {
//   apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
//   authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.VUE_APP_FIREBASE_APP_ID,
// };

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export { firebaseApp, auth, db, storage };

// Firebase configuration using environment variables
// const firebaseConfig = {
//   apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
//   authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.VUE_APP_FIREBASE_APP_ID,
// };

// Log environment variables to verify (optional; remove in production)
// console.log("Firebase API Key:", process.env.VUE_APP_FIREBASE_API_KEY);
// console.log("Firebase Auth Domain:", process.env.VUE_APP_FIREBASE_AUTH_DOMAIN);
