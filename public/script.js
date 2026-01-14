document.addEventListener("DOMContentLoaded", () => {
  const cartBtn = document.getElementById("cartBtn");
  const cartPanel = document.getElementById("cart");
  const closeCart = document.getElementById("closeCart");
  const cartItemsEl = document.getElementById("cartItems");
  const cartCountEl = document.getElementById("cartCount");
  const cartTotalEl = document.getElementById("cartTotal");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const customerNameInput = document.getElementById("customerName");

  let cart = JSON.parse(localStorage.getItem("cart_v1")) || [];

  function formatRp(num) {
    return "Rp " + Number(num).toLocaleString("id-ID");
  }

  function updateCartCount() {
    const totalCount = cart.reduce((s, i) => s + i.qty, 0);
    if (cartCountEl) {
      cartCountEl.textContent = totalCount;
      cartCountEl.style.display = totalCount > 0 ? "flex" : "none";
    }
  }

  function renderCart() {
    if (!cartItemsEl) return;
    cartItemsEl.innerHTML = "";

    if (cart.length === 0) {
      cartItemsEl.innerHTML =
        '<p style="padding:6px 0;color:#444">Keranjang kosong</p>';
      if (cartTotalEl) cartTotalEl.textContent = "Rp 0";
      updateCartCount();
      localStorage.setItem("cart_v1", JSON.stringify(cart));
      return;
    }

    cart.forEach((item) => {
      const el = document.createElement("div");
      el.className = "cart-item";
      el.innerHTML = `
        <img src="${item.img || "img/placeholder.png"}" alt="">
        <div class="ci-info">
          <strong>${item.name}</strong>
          <div style="font-size:13px;color:#666">
            ${formatRp(item.price)} x ${item.qty}
          </div>
        </div>
        <div class="ci-actions">
          <button class="ci-plus" data-id="${item.id}">+</button>
          <button class="ci-minus" data-id="${item.id}">−</button>
          <button class="ci-remove" data-id="${item.id}">hapus</button>
        </div>
      `;
      cartItemsEl.appendChild(el);
    });

    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    if (cartTotalEl) cartTotalEl.textContent = formatRp(total);

    updateCartCount();
    localStorage.setItem("cart_v1", JSON.stringify(cart));
  }

  // ambil data produk
  document.querySelectorAll(".menu-item").forEach((itemEl, idx) => {
    const nameEl = itemEl.querySelector("h3");
    const priceEl = itemEl.querySelector("p");
    const imgEl = itemEl.querySelector("img");

    const name = nameEl ? nameEl.innerText.trim() : `Produk ${idx + 1}`;
    let price = 0;
    if (priceEl) {
      const digits = priceEl.innerText.replace(/[^\d]/g, "");
      price = digits ? Number(digits) : 0;
    }

    const img = imgEl ? imgEl.getAttribute("src") : "";

    const id =
      name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9\-]/g, "") +
      "-" +
      idx;

    if (!itemEl.querySelector(".add-to-cart")) {
      const btn = document.createElement("button");
      btn.className = "add-to-cart";
      btn.type = "button";
      btn.innerHTML = "➕ Tambah";

      btn.addEventListener("click", () => {
        const idxCart = cart.findIndex((i) => i.id === id);
        if (idxCart === -1) {
          cart.push({ id, name, price, img, qty: 1 });
        } else {
          cart[idxCart].qty += 1;
        }

        renderCart();
        if (cartPanel) cartPanel.classList.remove("hidden");
      });

      itemEl.appendChild(btn);
    }
  });

  // Toggle panel
  if (cartBtn) {
    cartBtn.addEventListener("click", () => {
      if (!cartPanel) return;
      cartPanel.classList.toggle("hidden");
    });
  }

  if (closeCart) {
    closeCart.addEventListener("click", () => {
      if (cartPanel) cartPanel.classList.add("hidden");
    });
  }

  // tombol + - hapus
  if (cartItemsEl) {
    cartItemsEl.addEventListener("click", (e) => {
      const id = e.target.dataset?.id;
      if (!id) return;

      const idxCart = cart.findIndex((i) => i.id === id);
      if (idxCart === -1) return;

      if (e.target.classList.contains("ci-plus")) {
        cart[idxCart].qty++;
      } else if (e.target.classList.contains("ci-minus")) {
        cart[idxCart].qty--;
        if (cart[idxCart].qty <= 0) cart.splice(idxCart, 1);
      } else if (e.target.classList.contains("ci-remove")) {
        cart.splice(idxCart, 1);
      }

      renderCart();
    });
  }

  // ===============================
  // CHECKOUT + SIMPAN KE DATABASE
  // ===============================
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Keranjang kosong.");
        return;
      }

      const customerName = customerNameInput
        ? customerNameInput.value.trim()
        : "";

      if (customerName === "") {
        alert("Masukkan nama kamu dulu!");
        if (customerNameInput) customerNameInput.focus();
        return;
      }

      let message = `Halo, saya mau pesan:%0A`;
      message += `Nama: *${customerName}*%0A%0A`;

      let total = 0;

      cart.forEach((item, i) => {
        const sub = item.price * item.qty;
        total += sub;

        message += `${i + 1}. ${item.name}%0A`;
        message += `   ${item.qty} x ${formatRp(item.price)} = ${formatRp(
          sub
        )}%0A%0A`;
      });

      message += `Total: *${formatRp(total)}*`;

      // SIMPAN KE DATABASE
      fetch("/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: customerName,
          total: total,
          items: cart,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Data tersimpan ke database:", data);
        })
        .catch((err) => {
          console.error("Gagal simpan ke database:", err);
        });

      // BUKA WHATSAPP
      const phone = "6285658241990";
      const wa = `https://wa.me/${phone}?text=${message}`;
      window.open(wa, "_blank");

      cart = [];
      renderCart();

      if (customerNameInput) customerNameInput.value = "";
      if (cartPanel) cartPanel.classList.add("hidden");
    });
  }

  renderCart();
});



