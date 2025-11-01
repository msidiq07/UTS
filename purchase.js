function formatRupiah(number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(number);
}
document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("purchasedList");
  const empty = document.getElementById("noPurchase");
  let purchases = JSON.parse(localStorage.getItem("purchasedItems")) || [];
  purchases = purchases.filter(order => {
    return (
      order &&
      order.buyer &&
      order.buyer.nama &&
      order.items &&
      Array.isArray(order.items) &&
      order.items.length > 0 &&
      order.total > 0
    );
  });

  localStorage.setItem("purchasedItems", JSON.stringify(purchases));
  if (purchases.length === 0) {
    empty.style.display = "block";
    list.innerHTML = "";
    return;
  }
  purchases.reverse();
  list.innerHTML = purchases.map(order => `
    <div class="purchase-record">
      <h3><i class="fa-solid fa-calendar"></i> ${order.date}</h3>
      <p><strong>Nama:</strong> ${order.buyer.nama}</p>
      <p><strong>Alamat:</strong> ${order.buyer.alamat}</p>
      <p><strong>Metode Pembayaran:</strong> ${order.buyer.pembayaran}</p>
      <div class="bought-items">
        ${order.items.map(item => `
          <div class="bought-item">
            <img src="${item.image}" alt="${item.name}">
            <div>
              <p><strong>${item.name}</strong></p>
              <p>${item.quantity}x ${formatRupiah(item.price)} = 
                 <strong>${formatRupiah(item.price * item.quantity)}</strong></p>
            </div>
          </div>
        `).join('')}
      </div>
      <p class="total"><strong>Total:</strong> ${formatRupiah(order.total)}</p>
    </div>
  `).join('');
});
