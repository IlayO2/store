// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyA5ANgDMzSTI263rM-j2Z4GEaovvNdjzCA",
  authDomain: "streetcore-store.firebaseapp.com",
  projectId: "streetcore-store",
  storageBucket: "streetcore-store.firebasestorage.app",
  messagingSenderId: "1041046487034",
  appId: "1:1041046487034:web:9d1bc33de7f9c19147ae43",
  measurementId: "G-27HST3Q0EP"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// ActionCodeSettings לדוגמה
export const actionCodeSettings = {
  url: 'https://streetcore-store.web.app/finishSignUp',
  handleCodeInApp: true,
  linkDomain: 'streetcore-store.firebaseapp.com'
};