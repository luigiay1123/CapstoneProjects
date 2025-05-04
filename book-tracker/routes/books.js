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

// GET /books/:id/edit - show edit form
router.get("/:id/edit", async (req, res) => {
  const { id } = req.params;
  console.log(req.params);

  try {
    const result = await pool.query("SELECT * FROM books where id = $1", [id]);
    const book = result.rows[0];

    if (!book) return res.status(404).send("Book not found");
    res.render("edit", { book });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading book.");
  }
});

//POST /books/:id/edit - update book
router.post("/:id/edit", async (req, res) => {
  const { id } = req.params;
  const { title, author, review, rating, date_read } = req.body;

  try {
    await pool.query(
      `UPDATE books SET title=$1, author=$2, review=$3, rating=$4, date_read=$5 WHERE id=$6`,
      [title, author, review, rating, date_read, id]
    );

    res.redirect("/books");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating book.");
  }
});

//POST /books/:id/delete - delete book
router.post("/:id/delete", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM books WHERE id=$1", [id]);
    res.redirect("/books");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting book.");
  }
});

export default router;
