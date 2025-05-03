import express from "express";
import pool from "../db/index.js";

const router = express.Router();

//GET /books - show all books
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM books ORDER BY date_read DESC"
    );
    console.log(result.rows);
    res.render("index", { books: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

export default router;
