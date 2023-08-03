import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

console.log(process.env);

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.DATABASE,
    port: process.env.MYSQL_PORT,
  })
  .promise();

async function getAllGames() {
  let result = await pool.query("SELECT * FROM game");
  return result[0];
}

async function getGameById(id) {
  let result = await pool.query("SELECT * FROM game WHERE id = ?", [id]);
  return result[0];
}

async function createGame(name) {
  let randomNumber = Math.floor(Math.random() * 10000);
  try {
    let [result] = await pool.query(
      "INSERT INTO game (name, number) VALUES (?, ?)",
      [name, randomNumber]
    );
    return getGameById(result.insertId);
  } catch (err) {
    console.log("error: ", err);
    return;
  }
}

async function deleteGame(id) {
  await pool.query("DELETE FROM game WHERE id = ?", [id]);
}

export { getAllGames, getGameById, createGame, deleteGame };
