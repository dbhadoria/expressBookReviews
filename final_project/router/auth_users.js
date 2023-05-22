const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let filtered_users = users.filter((user) => user.username === user1.username);
    if (filtered_users.length == 0) {
        return false;
    }
    return true
}

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
        return true;
    } else {
        return false;
    }
}
//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
    if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
        data: password
        }, 'access', { expiresIn: 60 * 60 * 1000});
        req.session.authorization = {
            accessToken,username
        }
    return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
    let isbn = req.params.isbn;
    let book = books[isbn];
    if (book) {
        console.log(req.session.authorization.username);
        let username = req.session.authorization.username;
        let reviews = book.reviews
        let review = req.query.review
        console.log(book);
        console.log(review);
        console.log(reviews);
        console.log(typeof(reviews));
        if (reviews.length > 0) {
            const revKeys = Object.keys(reviews);
            const matchingUsers = [];
            for (const key of revKeys) {
                if (key === username) {
                    reviews.key = review;
                    matchingUsers.push(book);
                    return res.status(200).send(`A review with an ISBN ${isbn} has been added/updated`);
                }
            }
            if (matchingUsers.length < 0) {
                let rev = {
                    1 : {username, review}
                }
                reviews.push(rev);
                console.log(book)
                books[isbn].reviews = reviews;
            } else {
                for (let i = 0; i < reviews.length; i++) {
                    if (reviews[i][0] == req.session.username) {
                        reviews[i][1] = review;
                        books[isbn].reviews = reviews;
                        return res.status(200).send(`A review with an ISBN ${isbn} has been added/updated`);
                    }
                }
            }
        } else {
            // let rev = {
            //     1 : {username, review}
            // }
            reviews.username = review;
            books[isbn].reviews = reviews;
            console.log(books[isbn]);
        }
        return res.status(200).send(`A review with an ISBN ${isbn} has been added/updated`);
    }
    return res.status(200).send("There was an Error");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
