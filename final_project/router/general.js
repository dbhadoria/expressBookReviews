const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!doesExist(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
});



// Get the book list available in the shop
let myPromise1 = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Promise 1 resolved");
    }, 6000);
  });
  
public_users.get('/', function (req, res) {
    myPromise1.then((successMessage) => {
        console.log("From Callback " + successMessage);
        return res.send(JSON.stringify({ books }, null, 4));
    })
    .catch((error) => {
        console.error("Error:", error);
        return res.status(500).json({ message: 'Failed to retrieve books' });
    });
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
    myPromise1.then((successMessage) => {
        console.log("From Callback " + successMessage);
        let is = req.params.isbn;
        return res.send(books[is]);
    })
    .catch((error) => {
        console.error("Error:", error);
        return res.status(500).json({ message: 'Failed to retrieve book'});
    });
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    myPromise1.then((successMessage) => {
        console.log("From Callback " + successMessage);
        const author = req.params.author;
        const bookKeys = Object.keys(books);
        const matchingBooks = [];
        for (const key of bookKeys) {
            const book = books[key];
            if (book.author === author) {
                matchingBooks.push(book);
            }
        }
        res.send(matchingBooks);
    })
    .catch((error) => {
        console.error("Error:", error);
        return res.status(500).json({ message: 'Failed to retrieve book'});
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
    myPromise1.then((successMessage) => {
        console.log("From Callback " + successMessage);
        const title = req.params.title;
        const bookKeys = Object.keys(books);
        const matchingBooks = [];
        for (const key of bookKeys) {
            const book = books[key];
            if (book.title === title) {
                matchingBooks.push(book);
            }
        }
        res.send(matchingBooks);
    })
    .catch((error) => {
        console.error("Error:", error);
        return res.status(500).json({ message: 'Failed to retrieve book'});
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let is = req.params.isbn;
    return res.send(books[is].reviews);
});

public_users.get('/review/:isbn',function (req, res) {
    let is = req.params.isbn;
    return res.send(books[is].reviews);
});


module.exports.general = public_users;
