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
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
