// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

// קונפיגורציה של Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA5ANgDMzSTI263rM-j2Z4GEaovvNdjzCA",
  authDomain: "streetcore-store.firebaseapp.com",
  projectId: "streetcore-store",
  storageBucket: "streetcore-store.firebasestorage.app",
  messagingSenderId: "1041046487034",
  appId: "1:1041046487034:web:9d1bc33de7f9c19147ae43",
  measurementId: "G-27HST3Q0EP"
};

// אתחול Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
