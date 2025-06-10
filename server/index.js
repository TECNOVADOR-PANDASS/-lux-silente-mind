const pool = require("./db");

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error de conexión:", err);
  } else {
    console.log("¡HoloMente conectado a Railway!", res.rows[0]);
  }
});
