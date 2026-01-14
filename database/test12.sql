CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  price INT NOT NULL,
  qty INT NOT NULL,
  subtotal INT NOT NULL
);
db_warkopbulily