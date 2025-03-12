import { Router } from "express";
import books from "./booksdb.js";
import { isValid } from "./auth_users.js";
import { users } from "./auth_users.js";
import axios from "axios";

const public_users = Router();

public_users.post("/register", (req, res) => {
  // Hint: The code should take the ‘username’ and ‘password’ provided in the body of the request for registration. If the username already exists, it must mention the same & must also show other errors like eg. when username &/ password are not provided.
  const { username, password } = req.body;
  if (username && password) {
    const _user = users.find((u, i) => u.username == username);
    if (_user) {
      res.send({ message: "User already registered. Please sign-in instead" });
    } else {
      users.push({ username: username, password: password });
      res.send({ message: "User successfully registered. Please sign-in" });
    }
  } else {
    res.send({ message: "Please provide both username & password" });
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  // Hint: Use the JSON.stringify method for displaying the output neatly
  res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  // Hint: Retrieve the ISBN from the request parameters
  const { isbn } = req.params;
  if (books[isbn]) {
    res.send(books[isbn]);
  } else {
    res.send({ message: "Book found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  // Hints:
  // 1. Obtain all the keys for the ‘books’ object.
  // 2. Iterate through the ‘books’ array & check the author matches the one provided in the request parameters.
  const { author } = req.params;
  let _books = [];
  for (const key in books) {
    if (Object.hasOwnProperty.call(books, key)) {
      const book = books[key];
      book.isbn = key;
      if (
        book.author.trim().toLowerCase().includes(author.trim().toLowerCase())
      ) {
        _books.push(book);
      }
    }
  }
  res.send(_books);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  // Hint: This will be similar to Exercise 3
  const { title } = req.params;
  let _books = [];
  for (const key in books) {
    if (Object.prototype.hasOwnProperty.call(books, key)) {
      const book = books[key];
      if (
        book.title.trim().toLowerCase().includes(title.trim().toLowerCase())
      ) {
        _books.push(book);
      }
    }
  }
  res.send(_books);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  // Hint: Get the book reviews based on ISBN provided in the request parameters.
  const { isbn } = req.params;
  if (books[isbn]) {
    res.send(books[isbn].reviews);
  } else {
    res.send({ message: "Book found" });
  }
});

export const general = public_users;

// ==================================== Async-Await with Axios ==================================

// get all the books
async function getAllBooks() {
  try {
    const { data } = await axios.get("http://localhost:5000/");
    return data;
  } catch (error) {
    console.log(error);
  }
}

// get book by isbn
async function getBookByISBN(isbn) {
  return new Promise((resolve, reject) => {
    axios
      .get(`http://localhost:5000/isbn/${isbn}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

// get book by author
async function getBookByAuthor(author) {
  try {
    const { data } = await axios.get(`http://localhost:5000/author/${author}`);
    return data;
  } catch (error) {
    console.log(error);
  }
}

// get book by title
async function getBookByTitle(title) {
  try {
    const { data } = await axios.get(`http://localhost:5000/title/${title}`);
    return data;
  } catch (error) {
    console.log(error);
  }
}
