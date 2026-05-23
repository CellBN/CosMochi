// Product Data
const products = [
    { id: 1, name: 'Merkurius', flavor: 'Oreo', price: 12000, image: 'Merkurius.png' },
    { id: 2, name: 'Venus', flavor: 'Vanila', price: 12000, image: 'Venus.png' },
    { id: 3, name: 'Bumi', flavor: 'Matcha', price: 12000, image: 'Bumi.png' },
    { id: 4, name: 'Mars', flavor: 'Stroberi', price: 12000, image: 'Mars.png' },
    { id: 5, name: 'Jupiter', flavor: 'Peanut Butter', price: 12000, image: 'Jupiter.png' },
    { id: 6, name: 'Saturnus', flavor: 'Keju', price: 12000, image: 'Saturnus.png' },
    { id: 7, name: 'Uranus', flavor: 'Mint', price: 12000, image: 'Uranus.png' },
    { id: 8, name: 'Neptunus', flavor: 'Bluberry', price: 12000, image: 'Neptunus.png' }
];

// Cart Management
let cart = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupModals();
    loadCartFromLocalStorage();
});

// Load Products
function loadProducts() {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect fill=%22%237dd3c0%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2218%22 fill=%22white%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3E${product.name}%3C/text%3E%3C/svg%3E'">
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-flavor">Rasa: ${product.flavor}</div>
                <div class="product-price">Rp ${product.price.toLocaleString('id-ID')}</div>
                <div class="product-quantity">
                    <button onclick="decreaseQty(${product.id})">-</button>
                    <input type="number" id="qty-${product.id}" value="1" min="1" onchange="validateQuantity(${product.id})">
                    <button onclick="increaseQty(${product.id})">+</button>
                </div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">TAMBAH KE KERANJANG</button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Quantity Functions
function increaseQty(productId) {
    const input = document.getElementById(`qty-${productId}`);
    input.value = parseInt(input.value) + 1;
}

function decreaseQty(productId) {
    const input = document.getElementById(`qty-${productId}`);
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

function validateQuantity(productId) {
    const input = document.getElementById(`qty-${productId}`);
    if (parseInt(input.value) < 1) {
        input.value = 1;
    }
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const quantity = parseInt(document.getElementById(`qty-${productId}`).value);
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            flavor: product.flavor,
            price: product.price,
            quantity: quantity
        });
    }
    
    saveCartToLocalStorage();
    updateCartCount();
    alert('Produk ditambahkan ke keranjang!');
    document.getElementById(`qty-${productId}`).value = 1;
}

// Update Cart Count
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

// Save Cart to Local Storage
function saveCartToLocalStorage() {
    localStorage.setItem('cosmochi_cart', JSON.stringify(cart));
}

// Load Cart from Local Storage
function loadCartFromLocalStorage() {
    const saved = localStorage.getItem('cosmochi_cart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCartCount();
    }
}

// Display Cart
function displayCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666;">Keranjang belanja Anda kosong</p>';
        document.getElementById('total-price').textContent = '0';
        return;
    }
    
    let total = 0;
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItemEl = document.createElement('div');
        cartItemEl.className = 'cart-item';
        cartItemEl.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name} (${item.flavor})</div>
                <div class="cart-item-price">Rp ${item.price.toLocaleString('id-ID')} x ${item.quantity}</div>
            </div>
            <div class="cart-item-controls">
                <button onclick="decreaseCartQty(${index})">-</button>
                <input type="number" value="${item.quantity}" onchange="updateCartQty(${index}, this.value)" min="1">
                <button onclick="increaseCartQty(${index})">+</button>
                <button class="remove-item-btn" onclick="removeFromCart(${index})">×</button>
            </div>
        `;
        cartItems.appendChild(cartItemEl);
    });
    
    document.getElementById('total-price').textContent = total.toLocaleString('id-ID');
}

// Cart Quantity Functions
function increaseCartQty(index) {
    cart[index].quantity++;
    saveCartToLocalStorage();
    updateCartCount();
    displayCart();
}

function decreaseCartQty(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    }
    saveCartToLocalStorage();
    updateCartCount();
    displayCart();
}

function updateCartQty(index, value) {
    const qty = parseInt(value);
    if (qty >= 1) {
        cart[index].quantity = qty;
    } else {
        cart[index].quantity = 1;
    }
    saveCartToLocalStorage();
    updateCartCount();
    displayCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCartToLocalStorage();
    updateCartCount();
    displayCart();
}

// Modal Management
function setupModals() {
    const cartModal = document.getElementById('cart-modal');
    const checkoutModal = document.getElementById('checkout-modal');
    const qrisModal = document.getElementById('qris-modal');
    const successModal = document.getElementById('success-modal');
    const cartIcon = document.querySelector('.cart-icon');
    const closes = document.querySelectorAll('.close');
    
    cartIcon.addEventListener('click', function() {
        displayCart();
        cartModal.style.display = 'block';
    });
    
    closes.forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === cartModal) {
            cartModal.style.display = 'none';
        }
        if (event.target === checkoutModal) {
            checkoutModal.style.display = 'none';
        }
        if (event.target === qrisModal) {
            qrisModal.style.display = 'none';
        }
        if (event.target === successModal) {
            successModal.style.display = 'none';
        }
    });
    
    // Checkout Form
    document.getElementById('checkout-form').addEventListener('submit', function(e) {
        e.preventDefault();
        processOrder();
    });
}

// Proceed to Checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Keranjang belanja Anda kosong!');
        return;
    }
    
    document.getElementById('cart-modal').style.display = 'none';
    document.getElementById('checkout-modal').style.display = 'block';
}

// Show QRIS
function showQRIS() {
    document.getElementById('qris-modal').style.display = 'block';
}

// Process Order
function processOrder() {
    console.log('processOrder berjalan');
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const payment = document.querySelector('input[name="payment"]:checked');
    
    if (!name || !phone || !payment) {
        alert('Silakan isi semua data yang diperlukan!');
        return;
    }
    
    // Create Order Summary
    let orderDetails = `Pesanan dari: ${name}\nNo. WA: ${phone}\n\nDetail Pesanan:\n`;
    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        orderDetails += `- ${item.name} (${item.flavor}) x${item.quantity} = Rp ${itemTotal.toLocaleString('id-ID')}\n`;
    });
    orderDetails += `\nTotal: Rp ${total.toLocaleString('id-ID')}\nMetode Pembayaran: ${payment.value === 'qris' ? 'QRIS' : 'Tunai'}`;
    // Save order
    const order = {
        name: name,
        phone: phone,
        payment: payment.value,
        items: cart,
        total: total,
        date: new Date().toLocaleString('id-ID')
    };
    
    const orders = JSON.parse(localStorage.getItem('cosmochi_orders') || '[]');
    orders.push(order);
    localStorage.setItem('cosmochi_orders', JSON.stringify(orders));
    
    // Show Success Modal
    document.getElementById('checkout-modal').style.display = 'none';
    const successModal = document.getElementById('success-modal');
    
    let summaryText = `<strong>Pesanan Berhasil Dibuat!</strong><br><br>`;
    summaryText += `<strong>Nama:</strong> ${name}<br>`;
    summaryText += `<strong>Total:</strong> Rp ${total.toLocaleString('id-ID')}<br>`;
    summaryText += `<strong>Metode Pembayaran:</strong> ${payment.value === 'qris' ? 'QRIS' : 'Tunai'}<br><br>`;
    
   const successMessage = document.getElementById('success-message');

if (successMessage) {
    successMessage.innerHTML = summaryText;
}
    successModal.style.display = 'block';
    
    // Countdown
    let countdown = 15;
    const countdownEl = document.getElementById('countdown');
    const interval = setInterval(() => {
        countdown--;
        countdownEl.textContent = countdown;
        if (countdown === 0) {
            clearInterval(interval);
            successModal.style.display = 'none';
            resetCheckoutForm();
        }
    }, 1000);
    
    // Clear cart
    cart = [];
    saveCartToLocalStorage();
    updateCartCount();
}

// Reset Checkout Form
function resetCheckoutForm() {
    document.getElementById('checkout-form').reset();
    document.getElementById('name').value = '';
    document.getElementById('phone').value = '';

    const payment = document.querySelector('input[name="payment"]:checked');

    if (payment) {
        payment.checked = false;
    }
}

function setupBannerScroll() {
    const wrapper = document.getElementById('banners-wrapper');
    let startX = 0;
    let currentX = 0;
    let isScrolling = false;

    wrapper.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isScrolling = true;
    });

    wrapper.addEventListener('touchmove', (e) => {
        if (!isScrolling) return;
        currentX = e.touches[0].clientX;
    });

    wrapper.addEventListener('touchend', () => {
        if (!isScrolling) return;
        isScrolling = false;

        const diff = startX - currentX;
        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentBannerIndex < 1) {
                goToBanner(currentBannerIndex + 1);
            } else if (diff < 0 && currentBannerIndex > 0) {
                goToBanner(currentBannerIndex - 1);
            }
        }
    });
}

function goToProducts() {
    document.getElementById('landing').style.display = 'none';
    document.getElementById('navbar').classList.add('show');
    window.scrollTo(0, 0);
}
