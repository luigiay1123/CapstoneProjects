# 📚 Book Tracker App

A simple book tracking web app built with **Node.js**, **Express**, **PostgreSQL**, and the **Open Library API**.  
You can search for books by ISBN or title, autofill their data from the API, and manage your reading list with ratings and notes.

---

## 🚀 Features

- ✅ Search books by ISBN or title
- 📖 Autofill book data from Open Library
- 📝 Add, edit, or delete your book entries
- 🌟 Rate books and add personal notes
- 📅 Sort books by rating or date read
- 🖼️ Display cover images from Open Library
- 🗃️ PostgreSQL database with full CRUD support

---

## 🛠 Tech Stack

- **Node.js**
- **Express.js**
- **EJS** templating
- **PostgreSQL** via `pg`
- **Axios** for API requests
- **HTML/CSS/JS** (Vanilla)

---

## 📦 Installation

```bash
git clone https://github.com/yourusername/book-tracker.git
cd book-tracker
npm install

🌐 Environment Setup
Create a .env file in the root folder:
DATABASE_URL=postgresql://youruser:yourpassword@localhost:5432/capstoneProject

Make sure your PostgreSQL database is created and running locally.
Use pgAdmin or the psql CLI to create your books table.

🧪 Running the Project

npm run dev

This runs the app using nodemon (make sure it's installed globally or listed in devDependencies).

Then open http://localhost:3000 in your browser.

🗃️ Database Schema
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title TEXT,
  author TEXT,
  cover_url TEXT,
  date_read DATE,
  rating INTEGER,
  review TEXT,
  isbn TEXT
);


📬 Contact
Made by Luigi Oson – feel free to share feedback or improvements!
Tweet Angela @yu_angela if you want to share your project too 🚀
```
