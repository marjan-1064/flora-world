
// document.addEventListener("DOMContentLoaded", () => {
//   let count = 0;
//   const cartBtns = document.querySelectorAll('.cart-btn');
//   const cartCount = document.querySelector('.cart-count');
//   const cartitems=document.querySelector('.cart-items');

//   cartBtns.forEach((btn) => {
//     btn.addEventListener('click', () => {
//       count++;
//       cartCount.textContent = count; // update number
//       btn.textContent = "Added to Cart";
//       btn.style.backgroundColor = "gray";
//       btn.disabled = true;
//       clonecard(btn,cartBtns,cartitems);// optional: prevent adding same item twice
//     });
//   });
// });
// function clonecard(btn,cartBtns,cartitems){
//     const originalcard=btn.closest('.card-f');
//     const clone=originalcard.cloneNode(true);
//     //  cartitems.appendChild(clone);
//      document.querySelector('.cart-items').appendChild(clone);
//     // clone.querySelector(cartBtns.forEach((e)=>e.remove()))
    
// }
// ---------- UTILITY FUNCTIONS ----------

// // Get cart from localStorage
// function getCart() {
//   return JSON.parse(localStorage.getItem('cart')) || [];
// }

// // Save cart to localStorage
// function saveCart(cart) {
//   localStorage.setItem('cart', JSON.stringify(cart));
//   updateCartCount();
// }

// // Update cart icon count
// function updateCartCount() {
//   const cart = getCart();
//   document.querySelectorAll('.cart-count').forEach(el => {
//     el.textContent = cart.length;
//   });
// }

// // Add item to cart
// function addToCart(item) {
//   const cart = getCart();
//   const exists = cart.find(cartItem => cartItem.id === item.id);

//   if (!exists) {
//     cart.push(item);
//     saveCart(cart);
//   }
// }

// // Remove item from cart by ID
// function removeFromCart(id) {
//   let cart = getCart();
//   cart = cart.filter(item => item.id !== id);
//   saveCart(cart);
// }

// // ---------- PRODUCT PAGE (list.html) ----------
// function initProductPage() {
//   const buttons = document.querySelectorAll('.cart-btn');

//   buttons.forEach(button => {
//     const card = button.closest('.card-f');
//     const id = card.dataset.id;
//     const name = card.dataset.name || 'Unnamed';
//     const price = parseFloat(card.dataset.price) || 0;

//     // Disable button if already in cart
//     const cart = getCart();
//     if (cart.find(item => item.id === id)) {
//       button.textContent = "Added to Cart";
//       button.disabled = true;
//     }

//     button.addEventListener('click', () => {
//       addToCart({ id, name, price });
//       button.textContent = "Added to Cart";
//       button.disabled = true;
//     });
//   });
// }

// // ---------- CART PAGE (cart.html) ----------
// function initCartPage() {
//   const cartItemsContainer = document.querySelector('.cart-items');
//   const totalCostElement = document.querySelector('.totalcost h2');
//   const cart = getCart();

//   if (cart.length === 0) {
//     cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
//     totalCostElement.textContent = "0$";
//     return;
//   }

//   let totalCost = 0;

//   cart.forEach(item => {
//     const itemDiv = document.createElement('div');
//     itemDiv.classList.add('card-f', 'mb-3');
//     itemDiv.innerHTML = `
//       <h5>${item.name}</h5>
//       <p>Price: ${item.price}$</p>
//       <button class="btn btn-danger btn-sm remove-btn" data-id="${item.id}">Remove</button>
//     `;
//     cartItemsContainer.appendChild(itemDiv);
//     totalCost += item.price;
//   });

//   totalCostElement.textContent = `${totalCost}$`;

//   // Remove button event
//   document.querySelectorAll('.remove-btn').forEach(btn => {
//     btn.addEventListener('click', () => {
//       const id = btn.getAttribute('data-id');
//       removeFromCart(id);
//       location.reload(); // refresh page to update cart
//     });
//   });
// }

// // ---------- INITIALIZE SCRIPT ----------
// document.addEventListener('DOMContentLoaded', () => {
//   updateCartCount();

//   if (document.querySelector('.cart-btn')) {
//     initProductPage();
//   }

//   if (document.querySelector('.cart-items')) {
//     initCartPage();
//   }
// });
// ---------- UTILITY FUNCTIONS ----------

// Get cart from localStorage
function getCart() {
  let cart=JSON.parse(localStorage.getItem('cart')) || [];
cart=cart.filter(item=>item.id && item.name && item.price>0);
return cart;
}

// Save cart to localStorage and update count
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

// Update cart icon count on all elements with .cart-count
function updateCartCount() {
  const cart = getCart();
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
  });
}

// Add item to cart, with image and quantity support
function addToCart(item) {
  const cart = getCart();
  const exists = cart.find(cartItem => cartItem.id === item.id);

  if (!exists) {
    item.quantity = 1;
    cart.push(item);
    saveCart(cart);
  }
}

// Remove item from cart by ID
function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== id);
  saveCart(cart);
}

// Change quantity of a cart item by change (+1 or -1)
function changeQuantity(id, change) {
  let cart = getCart();
  cart = cart.map(item => {
    if (item.id === id) {
      item.quantity = (item.quantity || 1) + change;
      if (item.quantity < 1) item.quantity = 1; // prevent less than 1
    }
    return item;
  });
  saveCart(cart);
}

// ---------- PRODUCT PAGE (list.html) ----------
function initProductPage() {
  const buttons = document.querySelectorAll('.cart-btn');

  buttons.forEach(button => {
    const card = button.closest('.card-f');
    const id = card.dataset.id;
    const name = card.dataset.name || 'Unnamed';
    const price = parseFloat(card.dataset.price) || 0;
    const img = card.querySelector('img')?.src || 'images/HERO-1.jpg';

    // Disable button if already in cart
    const cart = getCart();
    if (cart.find(item => item.id === id)) {
      button.textContent = "Added to Cart";
      button.disabled = true;
    }

    button.addEventListener('click', () => {
      addToCart({ id, name, price, image: img });
      button.textContent = "Added to Cart";
      button.disabled = true;
    });
  });
}

// ---------- CART PAGE (cart.html) ----------
function initCartPage() {
  const cartItemsContainer = document.querySelector('.cart-items');
  const totalCostElement = document.querySelector('.totalcost h2');
  let cart = getCart();

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    totalCostElement.textContent = "0$";
    return;
  }

  cartItemsContainer.innerHTML = ""; // clear previous content
  let totalCost = 0;

  cart.forEach(item => {
    if (!item.quantity) item.quantity = 1;

    const itemDiv = document.createElement('div');
    itemDiv.classList.add('card-f', 'mb-3', 'd-flex', 'align-items-center', 'gap-3');

    itemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 5px;">
      <div style="flex-grow: 1;">
        <h5>${item.name}</h5>
        <p>Price: ${item.price}$</p>
        <div class="quantity-control">
          <button class="btn btn-sm btn-secondary decrement-btn" data-id="${item.id}">-</button>
          <span class="quantity" data-id="${item.id}">${item.quantity}</span>
          <button class="btn btn-sm btn-secondary increment-btn" data-id="${item.id}">+</button>
        </div>
      </div>
      <button class="btn btn-danger btn-sm remove-btn" data-id="${item.id}">Remove</button>
    `;

    cartItemsContainer.appendChild(itemDiv);
    totalCost += item.price * item.quantity;
  });

  totalCostElement.textContent = `${totalCost.toFixed(2)}$`;

  // Remove button event
  document.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      removeFromCart(id);
      initCartPage();  // update UI & totals
      updateCartCount();
    });
  });

  // Increment button event
  document.querySelectorAll('.increment-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      changeQuantity(id, 1);
      initCartPage();
      updateCartCount();
    });
  });

  // Decrement button event
  document.querySelectorAll('.decrement-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      changeQuantity(id, -1);
      initCartPage();
      updateCartCount();
    });
  });
}

// ---------- INITIALIZE SCRIPT ----------
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();

  if (document.querySelector('.cart-btn')) {
    initProductPage();
  }

  if (document.querySelector('.cart-items')) {
    initCartPage();
  }
  // Add checkout button listener here
  const checkoutBtn = document.querySelector('.checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const cart = getCart();
      if (cart.length === 0) {
        alert("Your cart is empty! Please add some items before checkout.");
      } else {
        localStorage.removeItem('cart');  // Clear the cart
        window.location.href = "thankyou.html";  // Redirect to thank you page
      }
    });
  }

});