const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    //Write your code here
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(books[isbn]);
  }
  else {
    res.send("Unable to find book with that isbn.")
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    //Write your code here
    const reqauthor = req.params.author;

    const booksByAuthor = [];

    for (let isbn in books) {
        if (books[isbn].author === reqauthor) {
            booksByAuthor.push(books[isbn]);
        }
    }

    if (booksByAuthor.length>0) {
        res.status(200).send(booksByAuthor);
    }
    else {
        res.status(404).send(`Unable to find any books by ${reqauthor}.`);
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    //Write your code here
    const reqtitle = req.params.title;

    for (let isbn in books) {
        if (books[isbn].title === reqtitle) {
            res.status(200).send(books[isbn]);
        }
    }
    
    res.status(404).send(`Unable to find any books with this title: ${reqtitle}.`);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    if (books[isbn]) {
        res.status(200).send(books[isbn].reviews);
    }
    else {
        res.status(404).send("Unable to find book with that isbn.")
    }
});

module.exports.general = public_users;
