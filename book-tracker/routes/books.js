import express from "express";
import pool from "../db/index.js";
import axios from "axios";

const router = express.Router();

//GET /books - show all books
router.get("/", async (req, res) => {
  const sort = req.query.sort;
  let query = "SELECT * FROM books";

  if (sort === "rating") {
    query += " ORDER BY rating DESC";
  } else if (sort === "date") {
    query += " ORDER BY date_read DESC";
  }

  try {
    const result = await pool.query(query);
    console.log(result.rows);
    res.render("index", { books: result.rows, sort: sort });
  } catch (error) {
    console.error("Error fetching sorted books", error);
    res.status(500).send("Server Error");
  }
});

//GET books/add - show form to add a book
router.get("/add", async (req, res) => {
  const { isbn } = req.query;

  if (!isbn) {
    return res.render("add", { bookData: null, message: null });
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
      return res.render("add", { bookData: null, message: "No results found for that ISBN." });
    }

    const bookData = {
      title: data.title || "",
      author: data.authors?.[0].name || "",
      isbn,
      cover_url: data.cover?.medium || "",
    };
    console.log(bookData);
    res.render("add", { bookData, message: null });
  } catch (error) {
    console.error(error);
    res.render("add", { bookData: null, message: null });
  }
});

router.get("/search", async (req, res) => {
  const query = req.query.query.trim();
  let isbn = '';

  try {
    let apiUrl = "";

    // Check if it's an ISBN (basic check: digits and maybe dashes)
    const isISBN = /^\d{9,13}(\-\d+)?$/.test(query);

    if (isISBN) {
      isbn = query.replace(/-/g, "");
      apiUrl = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`;
    } else {
      // Search by title
      apiUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(
        query
      )}`;
    }

    const response = await axios.get(apiUrl);

    let bookData;

    if (isISBN) {
      const key = Object.keys(response.data)[0];
      const data = response.data[key];
      if (!data) {
        return res.render("add", { bookData: null, message: { 
            title: "Nothing found",
            details1: "We couldn't find any books matching for that ISBN.",
            details2: "Double-check ISBN or try using different number.",
            image: "/images/magnifier.svg", } });
      }
      bookData = {
        title: data.title || "",
       author: data.authors?.[0].name || "",
        isbn,
       cover_url: data.cover?.large || "",
      }
      // const key = Object.keys(response.data)[0];
      // bookData = response.data[key];
      console.log(bookData);
    } else {
      const firstResult = response.data.docs[0];
      if (!firstResult) {
        return res.render("add", { bookData: null, 
          message: { 
            title: "Nothing found",
            details1: "We couldn't find any books matching for that title.",
            details2: "Double-check title or try using different keywords.",
            image: "/images/magnifier.svg", } });
      }

      bookData = {
        title: firstResult.title,
        author: firstResult.author_name ? firstResult.author_name[0] : [],
        publish_date: firstResult.first_publish_year || "",
        isbn: firstResult.isbn ? firstResult.isbn[0] : null, // Grab first ISBN
        cover_url: firstResult.cover_i
          ? `https://covers.openlibrary.org/b/id/${firstResult.cover_i}-L.jpg`
          : null,
      };
    }

    // Render your form to confirm/save the book info
    res.render("add", { bookData, message: null });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).render("add", { bookData: null, message: "Error fetching book data" });
  }
});

//POST /books/add - save book to database
router.post("/add", async (req, res) => {
  const { title, author, isbn, review, rating, date_read, cover_url } =
    req.body;
  console.log(req.body);
  try {
    await pool.query(
      `INSERT INTO books (title, author, isbn, review, rating, date_read, cover_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [title, author, isbn || null, review, rating, date_read, cover_url]
    );

    res.redirect("/books");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error saving book.");
  }
});

// GET /books/:id/view - show view.ejs
router.get("/:id/view", async (req, res) => {
  const { id } = req.params;
  console.log(req.params);

  try {
    const result = await pool.query("SELECT * FROM books where id = $1", [id]);
    const book = result.rows[0];

    if (!book) return res.status(404).send("Book not found");
    res.render("view", { book });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading book.");
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

router.get("/test-include", (req, res) => {
  res.render("test-include");
});

export default router;
