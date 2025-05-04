import express from "express";
import pool from "../db/index.js";
import axios from "axios";

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

//GET books/add - show form to add a book
router.get("/add", async (req, res) => {
  const { isbn } = req.query;

  if (!isbn) {
    return res.render("add", { bookData: null });
  }

  try {
    const response = await axios.get(`https://openlibrary.org/api/books`, {
      params: {
        bibkeys: `ISBN:${isbn}`,
        format: "json",
        jscmd: "data",
      },
    });
    console.log(response);
    const data = response.data[`ISBN:${isbn}`];

    if (!data) {
      return res.render("add", { bookData: null });
    }

    const bookData = {
      title: data.title || "",
      author: data.authors?.[0].name || "",
      isbn,
      cover_url: data.cover?.medium || "",
    };
    console.log(bookData);
    res.render("add", { bookData });
  } catch (error) {
    console.error(error);
    res.render("add", { bookData: null });
  }
});

//POST /books/add - save book to database
router.post("/add", async (req, res) => {
  const { title, author, isbn, review, rating, date_read, cover_url } =
    req.body;

  try {
    await pool.query(
      `INSERT INTO books (title, author, isbn, review, rating, date_read, cover_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [title, author, isbn, review, rating, date_read, cover_url]
    );

    res.redirect("/books");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error saving book.");
  }
});

export default router;
