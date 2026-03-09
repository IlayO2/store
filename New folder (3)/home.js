import { db, auth } from './firebase.js';
import { collection, getDocs, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const productsContainer = document.getElementById('products-container');
const searchInput = document.getElementById('search-input');
let allProducts = [];

// טעינת מוצרים מ-Firestore
async function loadProducts() {
  const snapshot = await getDocs(collection(db, 'products'));
  allProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  renderProducts(allProducts);
}

// הצגת מוצרים
function renderProducts(products) {
  productsContainer.innerHTML = '';
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <a href="product.html?id=${product.id}">
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>₪${product.price}</p>
      </a>
      <button class="add-cart">🛒</button>
      <button class="add-favorites">❤️</button>
    `;
    productsContainer.appendChild(card);

    // הוספה לסל
    card.querySelector('.add-cart').addEventListener('click', async () => {
      if (!auth.currentUser) return alert("אנא התחבר/י כדי להוסיף לסל");
      const cartRef = doc(db, 'users', auth.currentUser.uid, 'cart', product.id);
      const cartDoc = await getDoc(cartRef);
      if (cartDoc.exists()) {
        await setDoc(cartRef, { quantity: cartDoc.data().quantity + 1, size: null });
      } else {
        await setDoc(cartRef, { quantity: 1, size: null });
      }
      alert("המוצר נוסף לסל בהצלחה!");
    });

    // הוספה למועדפים
    card.querySelector('.add-favorites').addEventListener('click', async () => {
      if (!auth.currentUser) return alert("אנא התחבר/י כדי להוסיף למועדפים");
      const favRef = doc(db, 'users', auth.currentUser.uid, 'savedProducts', product.id);
      await setDoc(favRef, { size: null });
      alert("המוצר נוסף למועדפים!");
    });
  });
}

// חיפוש אוטומטי
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  const filtered = allProducts.filter(p =>
    p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)
  );
  renderProducts(filtered);
});

// קטגוריות
document.querySelectorAll('.categories button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.categories button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const category = btn.dataset.category;
    const filtered = allProducts.filter(p => p.category === category);
    renderProducts(filtered);
  });
});

loadProducts();