import { db, auth } from './firebase.js';
import { collection, getDocs, doc, setDoc, deleteDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const cartItemsDiv = document.getElementById('cart-items');
const subtotalEl = document.getElementById('subtotal');
const shippingEl = document.getElementById('shipping');
const totalEl = document.getElementById('total');

let cart = [];

auth.onAuthStateChanged(async (user) => {
  if (!user) {
    cartItemsDiv.innerHTML = "<p>אנא התחבר/י כדי לראות את סל הקניות שלך</p>";
    return;
  }
  await loadCart(user.uid);
});

async function loadCart(uid) {
  cartItemsDiv.innerHTML = '';
  const snapshot = await getDocs(collection(db, 'users', uid, 'cart'));
  cart = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  let subtotal = 0;

  for (let item of cart) {
    // קבלת פרטי מוצר מהאוסף הגלובלי
    const productDoc = await getDoc(doc(db, 'products', item.id));
    const productData = productDoc.data();

    subtotal += productData.price * item.quantity;

    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.alignItems = 'center';
    div.style.marginBottom = '15px';
    div.innerHTML = `
      <img src="${productData.image}" style="width:100px; margin-right:10px;" alt="${productData.name}">
      <div>
        <h3>${productData.name}</h3>
        <p>מחיר: ₪${productData.price}</p>
        <p>מידה: ${item.size}</p>
        <p>כמות: 
          <button class="minus">-</button>
          ${item.quantity}
          <button class="plus">+</button>
        </p>
        <button class="delete">הסר מהסל</button>
      </div>
    `;
    cartItemsDiv.appendChild(div);

    // כפתורים
    div.querySelector('.plus').addEventListener('click', async () => {
      if(item.quantity < 8) {
        item.quantity++;
        await setDoc(doc(db, 'users', auth.currentUser.uid, 'cart', item.id), { quantity: item.quantity, size: item.size });
        loadCart(auth.currentUser.uid);
      }
    });
    div.querySelector('.minus').addEventListener('click', async () => {
      if(item.quantity > 1) {
        item.quantity--;
        await setDoc(doc(db, 'users', auth.currentUser.uid, 'cart', item.id), { quantity: item.quantity, size: item.size });
        loadCart(auth.currentUser.uid);
      }
    });
    div.querySelector('.delete').addEventListener('click', async () => {
      await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'cart', item.id));
      loadCart(auth.currentUser.uid);
    });
  }

  subtotalEl.innerText = `סכום: ₪${subtotal}`;
  let shipping = subtotal > 300 ? 0 : 30;
  shippingEl.innerText = `משלוח: ₪${shipping}`;
  totalEl.innerText = `סה"כ: ₪${subtotal + shipping}`;
}