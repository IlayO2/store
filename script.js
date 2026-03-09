import { auth, db } from "./firebase.js";
import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, updateProfile } 
  from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

/* ---------- הגדרות קישור אימייל ---------- */
const actionCodeSettings = {
  url: 'http://127.0.0.1:5500/register.html', // חייב להיות אותו דומיין המדויק שהוספת ל-Firebase
  handleCodeInApp: true
};

/* ---------- שלב 1: שליחת אימייל לאימות ---------- */
const sendEmailBtn = document.getElementById('send-email-btn');
const emailMsg = document.getElementById('email-msg');

if(sendEmailBtn){
  sendEmailBtn.addEventListener('click', () => {
    const email = document.getElementById('email').value;
    if(!email) { alert('הכנס אימייל'); return; }

    sendSignInLinkToEmail(auth, email, actionCodeSettings)
      .then(() => {
        window.localStorage.setItem('emailForSignIn', email); // שמירת האימייל כדי להשלים הרשמה
        emailMsg.style.color = "green";
        emailMsg.textContent = 'קישור אימות נשלח! בדוק את האימייל (גם בספאם)';
      })
      .catch((error) => {
        emailMsg.style.color = "red";
        emailMsg.textContent = error.message;
      });
  });
}

/* ---------- שלב 2: בדיקה אם הקישור נכון ---------- */
window.addEventListener('load', () => {
  const url = window.location.href;

  if(isSignInWithEmailLink(auth, url)){
    let email = window.localStorage.getItem('emailForSignIn');
    if(!email){
      email = window.prompt('הכנס את האימייל שלך כדי להשלים את ההתחברות');
    }

    signInWithEmailLink(auth, email, url)
      .then(() => {
        window.localStorage.removeItem('emailForSignIn');
        alert('האימייל אושר! המשך למילוי פרטי משתמש.');
        window.location.href = 'register.html';
      })
      .catch((error) => {
        alert(error.message);
      });
  }
});

/* ---------- שלב 3: סיום הרשמה - פרטים אישיים ---------- */
const completeBtn = document.getElementById('complete-register');
if(completeBtn){
  completeBtn.addEventListener('click', async () => {
    const name = document.getElementById('full-name').value;
    const gender = document.getElementById('gender').value;
    const password = document.getElementById('password').value;
    const phone = document.getElementById('phone').value;
    const terms = document.getElementById('terms').checked;

    if(!name || !gender || !password || !phone || !terms){
      alert('מלא את כל השדות ואשר את התנאים');
      return;
    }

    if(!/\d/.test(password) || password.length < 5){
      alert('הסיסמה חייבת להיות לפחות 5 תווים ולכלול מספר');
      return;
    }

    const user = auth.currentUser;
    if(user){
      try{
        await updateProfile(user, { displayName: name });
        await setDoc(doc(db, "users", user.uid), {
          name: name,
          gender: gender,
          phone: phone,
          email: user.email
        });
        alert('ההרשמה הושלמה!');
        window.location.href = 'home.html'; // כאן תוכל לשים את דף הבית של החנות
      } catch(e){
        alert(e.message);
      }
    } else {
      alert('שגיאה: המשתמש לא התחבר');
    }
  });
}

/* ---------- שלב 4: הצגת / הסתרת סיסמה ---------- */
const togglePassword = document.getElementById('toggle-password');
if(togglePassword){
  togglePassword.addEventListener('click', () => {
    const passwordInput = document.getElementById('password');
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
  });
}

/* ---------- שלב 5: החלפת שפה עברית ↔ אנגלית ---------- */
const langBtn = document.getElementById('lang-switch');
if(langBtn){
  langBtn.addEventListener('click', () => {
    const html = document.documentElement;
    if(html.lang === 'he'){
      html.lang = 'en';
      document.querySelectorAll('p, h2, h3, input, button').forEach(el => {
        if(el.placeholder === "Email") el.placeholder = "Email";
        if(el.placeholder === "שם מלא") el.placeholder = "Full Name";
        if(el.placeholder === "סיסמא (לפחות 5 תווים עם מספר)") el.placeholder = "Password (min 5 chars with number)";
        if(el.placeholder === "מספר טלפון") el.placeholder = "Phone Number";
      });
    } else {
      html.lang = 'he';
      location.reload();
    }
  });
}
// כפתור הרשמה
document.getElementById('sign-up-btn').addEventListener('click', () => {
  window.location.href = 'login.html';
});
