// login.js
import { auth } from "./firebase.js";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

const translations = {
  he: {
    loginTitle: "כניסה ל-StreetCore",
    email: "אימייל",
    password: "סיסמה",
    loginBtn: "התחבר",
    togglePass: "הצג/הסתר סיסמה",
    resetPass: "שחזור סיסמה",
    resetPrompt: "הכנס את כתובת האימייל שלך לשחזור סיסמה:",
    resetSent: "נשלח מייל לשחזור סיסמה.",
    guestMsg: "שגיאה: ",
    registerBtn: "לא רשום? הרשם כאן!"
  },
  en: {
    loginTitle: "Login to StreetCore",
    email: "Email",
    password: "Password",
    loginBtn: "Login",
    togglePass: "Show/Hide Password",
    resetPass: "Reset Password",
    resetPrompt: "Enter your email to reset password:",
    resetSent: "Password reset email sent.",
    guestMsg: "Error: ",
    registerBtn: "Not registered? Sign up here!"
  }
};

let currentLang = 'he';

// החלפת שפה
document.getElementById('lang-switch').addEventListener('click', () => {
  currentLang = currentLang === 'he' ? 'en' : 'he';
  const t = translations[currentLang];
  document.getElementById('login-title').textContent = t.loginTitle;
  document.getElementById('email').placeholder = t.email;
  document.getElementById('password').placeholder = t.password;
  document.getElementById('loginBtn').textContent = t.loginBtn;
  document.getElementById('togglePass').textContent = t.togglePass;
  document.getElementById('resetPass').textContent = t.resetPass;
  document.getElementById('registerBtn').textContent = t.registerBtn;
  document.getElementById('lang-switch').textContent = currentLang === 'he' ? 'English' : 'עברית';
});

// התחברות
document.getElementById('loginBtn').addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = 'home.html';
  } catch (error) {
    alert(translations[currentLang].guestMsg + error.message);
  }
});

// הצג/הסתר סיסמה
document.getElementById('togglePass').addEventListener('click', () => {
  const passInput = document.getElementById('password');
  passInput.type = passInput.type === 'password' ? 'text' : 'password';
});

// שחזור סיסמה
document.getElementById('resetPass').addEventListener('click', async () => {
  const email = prompt(translations[currentLang].resetPrompt);
  if(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      alert(translations[currentLang].resetSent);
    } catch (error) {
      alert(translations[currentLang].guestMsg + error.message);
    }
  } 
});

// כפתור הרשמה
document.getElementById('registerBtn').addEventListener('click', () => {
  window.location.href = 'index.html';
});