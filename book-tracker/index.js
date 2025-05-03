import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

//Routes
import booksRouter from "./routes/books.js";
app.use("/books", booksRouter);

//Home redirect
app.get("/", (req, res) => {
  res.redirect("/books");
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
