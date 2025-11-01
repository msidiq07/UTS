const JASTIP_FEE = 100000;
    function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
    }

    function getCart() {
        const cartString = localStorage.getItem('shoppingCart');
        return cartString ? JSON.parse(cartString) : [];
    }
    function saveCart(cart) {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        renderCart(); 
    }
    function changeQuantity(itemId, delta) {
        let cart = getCart();
        const itemIndex = cart.findIndex(item => item.id === itemId);

        if (itemIndex !== -1) {
            cart[itemIndex].quantity += delta;
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
            }
        }
        saveCart(cart);
    }
    function removeItem(itemId) {
        if (confirm("Apakah Anda yakin ingin menghapus item ini dari keranjang?")) {
            let cart = getCart();
            const newCart = cart.filter(item => item.id !== itemId);
            saveCart(newCart);
        }
    }

    function getProductImageFallback(itemName) {
        const lower = itemName.toLowerCase();
        if (lower.includes('nike')) return 'img/Nike2.jpg';
        if (lower.includes('gucci')) return 'img/Gucci 2.jpg';
        if (lower.includes('rolex')) return 'img/jam.jpg';
        if (lower.includes('dior')) return 'img/Dior2.jpg';
        if (lower.includes('macbook')) return 'img/Macbook.jpg';
        if (lower.includes('jbl')) return 'img/JBL.jpg';
        if (lower.includes('arcteryx')) return 'img/Arcteryx Jacket.jpg';
        if (lower.includes('canon')) return 'img/Cannon.jpg';
        if (lower.includes('salomon')) return 'img/Salomon XT-6.jpg';
        if (lower.includes('airpods')) return 'img/Airpods.jpg';
        return 'img/default.jpg'; // default jika tidak ada gambar
    }

    function renderCart() {
        const cart = getCart();
        const itemsContainer = document.getElementById('cartItemsContainer');
        const summaryDiv = document.getElementById('cartSummary');
        let subtotal = 0;

        itemsContainer.innerHTML = '';
        summaryDiv.innerHTML = '';

        if (cart.length === 0) {
            itemsContainer.innerHTML = '<p class="empty-cart">Keranjang Anda kosong. Yuk, <a href="product.html">tambah produk</a>!</p>';
            summaryDiv.innerHTML = `<a href="checkout.html" class="btn btn-primary" disabled><i class="fa-solid fa-lock"></i> Lanjut ke Checkout</a>`;
            return;
        }

        let itemsHTML = cart.map(item => {
            const totalItemPrice = item.price * item.quantity;
            subtotal += totalItemPrice;

            const imageSrc = item.image && item.image.trim() !== "" 
                ? item.image 
                : getProductImageFallback(item.name);

            return `
                <div class="cart-item">
                <img src="${imageSrc}" alt="${item.name}" class="item-img">
                <div class="item-details">
                <span class="item-name">${item.name}</span>
                <span class="item-options">${item.options || ''}</span>
                <span class="item-price-unit">${formatRupiah(item.price)} / unit</span>
                <button onclick="removeItem('${item.id}')" class="btn-remove">
                <i class="fa-solid fa-trash"></i> Hapus
                </button>
                </div>
                <div class="item-quantity">
                <button onclick="changeQuantity('${item.id}', -1)" class="qty-btn">-</button>
                <input type="number" value="${item.quantity}" min="1" readonly>
                <button onclick="changeQuantity('${item.id}', 1)" class="qty-btn">+</button>
                </div>
                <div class="item-total-price">
                     ${formatRupiah(totalItemPrice)}
                    </div>
                </div>
            `;
        }).join('');

        itemsContainer.innerHTML = itemsHTML;
        const grandTotal = subtotal + JASTIP_FEE;
        summaryDiv.innerHTML = `
            <div class="summary-line">
                <span>Subtotal Produk:</span>
                <span class="price-value">${formatRupiah(subtotal)}</span>
            </div>
            <div class="summary-line">
                <span>Biaya Jastip & Handling:</span>
                <span class="price-value">${formatRupiah(JASTIP_FEE)}</span>
            </div>
            <div class="summary-line grand-total-line">
                <strong>Total Pembayaran:</strong>
                <strong class="price-value grand-total">${formatRupiah(grandTotal)}</strong>
            </div>
            <a href="checkout.html" class="btn btn-primary"><i class="fa-solid fa-lock"></i> Lanjut ke Checkout</a>
        `;
    }
    document.addEventListener('DOMContentLoaded', renderCart);