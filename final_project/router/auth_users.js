const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=> { //returns boolean
//write code to check is the username is valid
    return users.some((user) => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.

    const user = users.find((user) => user.username === username);
    return user && user.password === password;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
    const { username, password } = req.body;

    if (!isValid(username)) {
        return res.status(401).send('There are no registered users by this username.');
    }
    
    if (!authenticatedUser(username, password)) {
        return res.status(401).send('Incorrect password.');
    }

     // Generate JWT token
  const token = jwt.sign({ username }, "access", { expiresIn: '1h' });
  
  // Save the token in session
  req.session.authorization = { accessToken: token };

  return res.send('Logged in successfully!');
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
    const isbn = req.params.isbn;
    const review = req.query.review; // Use req.query.review to get the review from the URL
    const username = req.user.username; // Use the username from the authenticated user

    if (!isbn || !review) {
        return res.status(400).send('The isbn and review are required.');
    }

    let book = books[isbn];

    if (!book) {
        return res.status(404).send('Book not found.');
    }

 
    book.reviews = []; // Initialize as an empty array
    

    let userReview = book.reviews.find(r => r.username === username);

    if (userReview) {
        // Update existing review
        userReview.review = review;
    } else {
        // Add new review
        book.reviews.push({ username, review });
    }

    return res.send(`Your review for the book with ISBN ${isbn} was successfully posted. 
                     See your review here: ${JSON.stringify(book.reviews)}`);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;

    let book = books[isbn];

    if(!book) {
        return res.status(404).send('Book not found');
    }

    if (!book.reviews) {
        return res.status(404).send('No reviews to delete.')
    }

    const initialRevCount = book.reviews.length;
    book.reviews = book.reviews.filter(review => review.username !== username);

    if (book.reviews.length === initialRevCount) {
        return res.status(404).send('Review not found or already deleted.');
    }

    return res.send(`Review by ${username} for the book with the ISBN ${isbn} deleted successfully.`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
