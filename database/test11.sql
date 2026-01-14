CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  total INT NOT NULL,
  order_date DATETIME DEFAULT CURRENT_TIMESTAMP
);
db_warkopbulily