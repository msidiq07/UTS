const JASTIP_FEE = 100000;
function formatRupiah(number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(number);
}
function getCart() {
  const cartString = localStorage.getItem("shoppingCart");
  return cartString ? JSON.parse(cartString) : [];
}
function clearCart() {
  localStorage.removeItem("shoppingCart");
}
function checkCartAndRender() {
  const cart = getCart();
  const summaryContainer = document.getElementById("orderSummaryContainer");
  const itemsList = document.getElementById("orderItemsList");
  const totalSummary = document.getElementById("orderTotalSummary");
  const emptyMessage = document.getElementById("emptyCartMessage");
  const checkoutForm = document.getElementById("checkoutForm");

  if (cart.length === 0) {
    emptyMessage.style.display = "block";
    checkoutForm.style.display = "none";
    return;
  }

  summaryContainer.style.display = "block";

  let subtotal = 0;
  let html = "";

  cart.forEach(item => {
    const totalItem = item.price * item.quantity;
    subtotal += totalItem;

    html += `
      <div class="order-item">
        <img src="${item.image}" alt="${item.name}" class="item-img">
        <div class="item-info">
          <p><strong>${item.name}</strong></p>
          <p>${item.options || ""}</p>
          <p>${item.quantity}x ${formatRupiah(item.price)}</p>
          <p><strong>${formatRupiah(totalItem)}</strong></p>
        </div>
      </div>
    `;
  });

  const total = subtotal + JASTIP_FEE;

  itemsList.innerHTML = html;
  totalSummary.innerHTML = `
    <div class="summary-line"><span>Subtotal Produk:</span><span>${formatRupiah(subtotal)}</span></div>
    <div class="summary-line"><span>Biaya Jastip:</span><span>${formatRupiah(JASTIP_FEE)}</span></div>
    <div class="summary-line grand-total"><strong>Total:</strong><strong>${formatRupiah(total)}</strong></div>
  `;
}
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("checkoutForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      completePurchase();
    });
  }
});

function completePurchase() {
  const cart = getCart();
  if (cart.length === 0) {
    alert("Keranjang kosong! Silakan tambahkan produk terlebih dahulu.");
    return;
  }

  const nama = document.getElementById("nama").value.trim();
  const telepon = document.getElementById("telepon").value.trim();
  const alamat = document.getElementById("alamat").value.trim();
  const catatan = document.getElementById("catatan").value.trim();
  const pembayaran = document.getElementById("pembayaran").value;

  if (!nama || !telepon || !alamat || !pembayaran) {
    alert("Harap lengkapi semua data wajib diisi!");
    return;
  }

  const totalHarga = cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + JASTIP_FEE;

  const orderData = {
    id: Date.now(),
    date: new Date().toLocaleString("id-ID", { dateStyle: "full", timeStyle: "short" }),
    buyer: { nama, telepon, alamat, catatan, pembayaran },
    items: cart,
    total: totalHarga
  };

  const history = JSON.parse(localStorage.getItem("purchasedItems")) || [];
  history.push(orderData);
  localStorage.setItem("purchasedItems", JSON.stringify(history));

  clearCart();

  const resultDiv = document.getElementById("checkoutResult");
  resultDiv.innerHTML = `
    <div class="success-message">
      <i class="fa-solid fa-circle-check"></i>
      <h3>Pembayaran Berhasil!</h3>
      <p>Terima kasih, <strong>${nama}</strong>! Pesanan Anda sedang diproses.</p>
      <p><strong>Metode Pembayaran:</strong> ${pembayaran}</p>
      <p><strong>Total Pembayaran:</strong> ${formatRupiah(totalHarga)}</p>
      <a href="purchase.html" class="btn btn-primary"><i class="fa-solid fa-receipt"></i> Lihat Riwayat Pembelian</a>
    </div>
  `;
  resultDiv.style.display = "block";
  document.getElementById("checkoutForm").style.display = "none";
}
