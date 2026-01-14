const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// arahkan ke folder public
app.use(express.static(path.join(__dirname, "public")));

// endpoint checkout
app.post("/checkout", (req, res) => {
  const { customer_name, total, items } = req.body;

  const sqlOrder = "INSERT INTO orders (customer_name, total) VALUES (?, ?)";

  db.query(sqlOrder, [customer_name, total], (err, result) => {
    if (err) return res.status(500).json(err);

    const orderId = result.insertId;

    const sqlItems =
      "INSERT INTO order_items (order_id, product_name, price, qty, subtotal) VALUES ?";

    const values = items.map((item) => [
      orderId,
      item.name,
      item.price,
      item.qty,
      item.price * item.qty,
    ]);

    db.query(sqlItems, [values], (err) => {
      if (err) return res.status(500).json(err);
      res.json({ status: "success" });
    });
  });
});

app.listen(3000, () => {
  console.log("🚀 Server jalan di http://localhost:3000");
});
