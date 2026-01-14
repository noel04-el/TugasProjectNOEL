const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "db_warkopbulily", // HARUS sama dengan di HeidiSQL
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database tidak terkoneksi:", err.message);
  } else {
    console.log("✅ Database terkoneksi");
  }
});

module.exports = db;
