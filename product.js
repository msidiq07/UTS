 const productsData = {
  'sepatu': { id: 'sepatu-001', name: "Nike Air Jordan 1", price: "2500000", image: "img/Nike2.jpg", options: "Size: 40" },
  'tas': { id: 'tas-002', name: "Gucci Women's Bag", price: "19800000", image: "img/tas.jpg", options: "Warna: Black" },
  'jam': { id: 'jam-003', name: "Rolex Yacht-Master", price: "45000000", image: "img/rolex.jpg", options: "Garansi Internasional" },
  'parfum': { id: 'parfum-004', name: "Dior Sauvage 100ml", price: "2200000", image: "img/dior2.jpg", options: "Volume: 100ml" },
  'laptop': { id: 'laptop-005', name: "MacBook Air M3", price: "22000000", image: "img/macbook.jpg", options: "Varian: 8GB/256GB" },
  'headphone': { id: 'headphone-006', name: "JBL Headphone", price: "5000000", image: "img/jbl.jpg", options: "Noise Cancelling" },
  'jaket': { id: 'jaket-007', name: "Arcteryx Jacket", price: "18500000", image: "img/Arcteryx Jacket.jpg", options: "Size: L, Color: Black" },
  'kamera': { id: 'kamera-008', name: "Canon EOS R8", price: "25000000", image: "img/cannon.jpg", options: "Body Only" },
  'sneaker': { id: 'sneaker-009', name: "Salomon XT-6", price: "3500000", image: "img/Salomon XT-6.jpg", options: "Size: 40" },
  'earbuds': { id: 'earbuds-010', name: "AirPods Pro 2", price: "3800000", image: "img/airpods.jpg", options: "Original Case" }
};

function formatRupiah(number) {
    return "Rp " + number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

function getCart() {
    const cartString = localStorage.getItem('shoppingCart');
    return cartString ? JSON.parse(cartString) : [];
    }

function saveCart(cart) {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
    updateCartCount();
    }

function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalItems;
    updateCartDropdown(); 
    }

function addToCart(productKey) {
    const product = productsData[productKey];

    if (product) {
        let cart = getCart();
        const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
        showNotification(`<i class="fa-solid fa-check"></i> Kuantitas ${product.name} diperbarui!`);
     } else {
        const itemForCart = {
        id: product.id,
        name: product.name,
        price: parseInt(product.price), 
        quantity: 1,
        image: product.image,
        options: product.options
        };
        cart.push(itemForCart);
        showNotification(`<i class="fa-solid fa-check"></i> ${product.name} ditambahkan ke keranjang.`);
        }

        saveCart(cart); 
        } else {
        alert("Produk tidak ditemukan!");
            }
        }
        
function showNotification(message) {
        const notification = document.getElementById('notification');
        notification.innerHTML = message;
        notification.classList.add('show');
        setTimeout(() => notification.classList.remove('show'), 3000);
        }

const cartDropdown = document.getElementById('cartDropdown');

function updateCartDropdown() {
        const cart = getCart();
        let htmlContent = '<h4>Items di Keranjang</h4>';

        if (cart.length === 0) {
            htmlContent += '<p class="empty-cart-message">Keranjang belanja kosong.</p>';
        } else {
            cart.forEach(item => {
            htmlContent += `
                <div class="cart-item-detail">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-info">
                <p class="item-name">${item.name}</p>
                <p class="item-qty-price">${item.quantity} x ${formatRupiah(item.price)}</p>
                </div>
                </div>
                `;
                });
            }

        if (cart.length > 0) {
            const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            htmlContent += `
                <div style="text-align: center; margin-top: 10px; padding-top: 5px; border-top: 1px solid #444;">
                <p style="font-weight: 600; color: #ff1e1e; margin-bottom: 10px;">Total: ${formatRupiah(totalAmount)}</p>
                <a href="cart.html" style="text-decoration: none; background-color: #ff1e1e; color: white; padding: 8px 15px; border-radius: 20px; font-size: 0.9em; display: inline-block;">
                Lihat Keranjang
                </a>
                </div>`;
            }
            cartDropdown.innerHTML = htmlContent;
        }

        document.getElementById('cartIconContainer').addEventListener('mouseenter', () => {
            updateCartDropdown();
            cartDropdown.classList.add('show');
        });
        document.getElementById('cartIconContainer').addEventListener('mouseleave', () => {
            setTimeout(() => {
                if (!document.getElementById('cartIconContainer').matches(':hover') && !cartDropdown.matches(':hover')) {
                    cartDropdown.classList.remove('show');
                }
            }, 300);
        });
        cartDropdown.addEventListener('mouseenter', () => cartDropdown.classList.add('show'));
        cartDropdown.addEventListener('mouseleave', () => cartDropdown.classList.remove('show'));

        document.getElementById('searchInput').addEventListener('keyup', function() {
            const filter = this.value.toLowerCase();
            const products = document.querySelectorAll('.product');
            products.forEach(product => {
                const name = product.getAttribute('data-name').toLowerCase();
                const category = product.getAttribute('data-category').toLowerCase();
                product.style.display = (name.includes(filter) || category.includes(filter)) ? "" : "none";
            });
        });

        document.addEventListener('DOMContentLoaded', updateCartCount);