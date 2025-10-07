// backend/db.js
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',      // ou o host do seu servidor MySQL
  user: 'root',           // seu usuário MySQL
  password: 'root',  // senha do MySQL
  database: 'catalogo', // substitua pelo nome real do seu banco
});

export default pool;
