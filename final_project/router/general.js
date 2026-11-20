const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check username and password
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Username or password is missing error
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
        //Creating a promise method. The promise will get resolved when timer times out after 6 seconds.
        let myPromise = new Promise((resolve,reject) => {
            setTimeout(() => {
            resolve(books);
            },6000)})
        //Call the promise and wait for it to be resolved and then print a message.
        myPromise.then((books) => {
            return res.send(JSON.stringify({books}, null, 3));
        })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = Object.values(books)
        .find(book => book.isbn === isbn);
    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }
    return res.json(book);
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const book = Object.values(books)
        .filter(book => book.author === author);
    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }
    return res.send(JSON.stringify({book}, null, 3));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const book = Object.values(books)
        .filter(book => book.title === title);
    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }
    return res.send(JSON.stringify({book}, null, 3));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = Object.values(books)
        .find(book => book.isbn === isbn);
    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }
    return res.json(book.reviews);
});

module.exports.general = public_users;
