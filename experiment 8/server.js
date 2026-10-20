
const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

// Sample book collection
let books = [
    { id: 1, title: "The Alchemist", author: "Paulo Coelho", year: 1988 },
    { id: 2, title: "Wings of Fire", author: "A. P. J. Abdul Kalam", year: 1999 },
    { id: 3, title: "Atomic Habits", author: "James Clear", year: 2018 }
];

let nextId = 4;

// Home route
app.get("/", (req, res) => {
    res.send("Welcome to the Book Management REST API!");
});

// READ all books
app.get("/books", (req, res) => {
    res.json(books);
});

// READ one book
app.get("/books/:id", (req, res) => {
    const book = books.find(b => b.id === Number(req.params.id));

    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);
});

// CREATE a book
app.post("/books", (req, res) => {
    const { title, author, year } = req.body;

    if (!title || !author || year === undefined) {
        return res.status(400).json({
            message: "Title, author and year are required"
        });
    }

    const newBook = { id: nextId++, title, author, year };
    books.push(newBook);

    res.status(201).json({
        message: "Book added successfully",
        book: newBook
    });
});

// UPDATE a book
app.put("/books/:id", (req, res) => {
    const id = Number(req.params.id);
    const { title, author, year } = req.body;
    const index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!title || !author || year === undefined) {
        return res.status(400).json({
            message: "Title, author and year are required"
        });
    }

    books[index] = { id, title, author, year };

    res.json({
        message: "Book updated successfully",
        book: books[index]
    });
});

// DELETE a book
app.delete("/books/:id", (req, res) => {
    const index = books.findIndex(
        b => b.id === Number(req.params.id)
    );

    if (index === -1) {
        return res.status(404).json({ message: "Book not found" });
    }

    const deletedBook = books.splice(index, 1)[0];

    res.json({
        message: "Book deleted successfully",
        book: deletedBook
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
