const express = require('express');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    

    if (req.body.username && req.body.password) {
        for (let user in users) {
            if (user === req.body.username) {
                return res.status(404).send(`The username ${user} already exists.`);
            }
        }
        
        const newUser = {
            username: req.body.username, 
            password: req.body.password
        };

        users.push(newUser);
        
        return res.status(200).send(`The user "${req.body.username}" was successfuly registered!`);
    }

    else {
        return res.status(404).send('Please enter username and password.');

    }
});


/*public_users.get('/',function (req, res) {
    //Write your code here
    res.send(JSON.stringify(books, null, 4));
});*/

// Get all books
public_users.get('/books', function (req, res) {
    const getBooks = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({books}, null, 4)));
      });
      getBooks.then(() => console.log("Resolved"));
  });

// Get book details based on ISBN
public_users.get('/books/isbn/:isbn',function (req, res){
  //Write your code here
    const isbn = req.params.isbn;
  
    const getBooksISBN = new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } 
        else {
            reject("Unable to find book with that isbn.");
        };
    });

    getBooksISBN
        .then(book => { 
            res.status(200).send(book);
        })
        .catch(error => {
            res.status(404).send(error);
        })
        .finally(() => {
            console.log("Promise resolved or rejected.");
        });
  });
  

  
// Get book details based on author
public_users.get('/books/author/:author',function (req, res) {
    //Write your code here
    const reqauthor = req.params.author;

    const getBookByAuthor = new Promise ((resolve, reject) => {
        const booksByAuthor = [];
        for (let isbn in books) {
            if (books[isbn].author === reqauthor) {
                booksByAuthor.push(books[isbn]);
            }
        } 
        if (booksByAuthor.length>0) {
            resolve(booksByAuthor);
        }
        else {
        reject(`Unable to find any books by ${reqauthor}.`);
        }
    });
    
    getBookByAuthor
        .then(bbauthor => { 
            res.status(200).send(bbauthor);
        })
        .catch(error => {
            res.status(404).send(error);
        })
        .finally(() => {
            console.log("Resolved or Rejected.");
        });
});

// Get all books based on title
public_users.get('/books/title/:title', function (req, res) {
    //Write your code here
    const reqtitle = req.params.title;

    const getBookByTitle = new Promise ((resolve, reject) => {
        for (let isbn in books) {
            if (books[isbn].title === reqtitle) {
                resolve(books[isbn]);
            }
        };

        reject(`Unable to find any books with this title: ${reqtitle}.`);
    });
    
    getBookByTitle
        .then(bbtitle => {
            res.status(200).send(bbtitle);
        })
        .catch(error => {
            res.status(404).send(error);
        })
        .finally(() => {
            console.log("Resolved or Rejected.");
        });
    
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
