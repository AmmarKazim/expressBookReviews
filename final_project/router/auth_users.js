import { Router } from "express";
import jwt from "jsonwebtoken";
import books from "./booksdb.js";
const regd_users = Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  // Hint: The code must validate and sign in a customer based on the username and password created in Exercise 6. It must also save the user credentials for the session as a JWT.
  const { username, password } = req.body;
  if (username && password) {
    const _user = users.find((u, i) => u.username == username);
    if (_user) {
      if (_user.password == password) {
        // Generate JWT access token
        const accessToken = jwt.sign({ data: password }, "secret", {
          expiresIn: 60,
        });
        // Store access token and username in session
        req.session.authorization = { accessToken, username };
        // we could also returned this access token to client if we don't want to store login in session on our server
        res.send("User successfully logged in");
      } else {
        res.send({ message: "Wrong password" });
      }
    } else {
      res.send({ message: "User is not registered" });
    }
  } else {
    res.send({ message: "Please provide both username & password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // Hint: You have to give a review as a request query & it must get posted with the username (stored in the session) posted. If the same user posts a different review on the same ISBN, it should modify the existing review. If another user logs in and posts a review on the same ISBN, it will get added as a different review under the same ISBN.
  const { isbn } = req.params;
  const { username, feedback } = req.query;
  if (req.user) {
    if (books[isbn]) {
      if (books[isbn].reviews[username]) {
        books[isbn].reviews[username].feebdack = feedback;
        res.send({ message: "Review successfully updated" });
      } else {
        books[isbn].reviews[username] = { feebdack: feedback };
        res.send({ message: "Review successfully added" });
      }
    } else {
      res.send({ message: "Book not found" });
    }
  } else {
    res.send({ message: "User not authenticated" });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  // Hint: Filter & delete the reviews based on the session username, so that a user can delete only his/her reviews and not other users’.
  const { isbn } = req.params;
  const { username } = req.session.authorization;
  if (books[isbn]) {
    if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      res.send({ message: "Review successfully deleted" });
    } else {
      res.send({ message: "Review not found" });
    }
  } else {
    res.send({ message: "Book not found" });
  }
});

export const authenticated = regd_users;
const _isValid = isValid;
export { _isValid as isValid };
const _users = users;
export { _users as users };
