import { db, auth } from './firebase.js';
import { collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const favContainer = document.getElementById('favorites-container');

auth.onAuthStateChanged(async (user) => {
  if(!user){
    favContainer.innerHTML = "<p>אנא התחבר/י כדי לראות את המוצרים המועדפים שלך</p>";
    return;
  }

  const snapshot = await getDocs(collection(db, 'users', user.uid, 'savedProducts'));
  const savedIds = snapshot.docs.map(d=>d.id);
  favContainer.innerHTML = '';

  for(let id of savedIds){
    const prodDoc = await getDoc(doc(db, 'products', id));
    const prod = prodDoc.data();
    const div = document.createElement('div');
    div.className = 'product-card';
    div.innerHTML = `
      <img src="${prod.image}" alt="${prod.name}">
      <h3>${prod.name}</h3>
      <p>₪${prod.price}</p>
      <p>מידה: ${snapshot.docs.find(d=>d.id===id).data().size}</p>
    `;
    favContainer.appendChild(div);
  }
});