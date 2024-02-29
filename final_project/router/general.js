const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

//Create a promise to retrieve all books.
const getAll = new Promise((resolve,reject) => {
    resolve(JSON.stringify(books));
})

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  getAll.then((successMessage) => {
    res.send(successMessage);
  });
});

// Use a promise to get book by ISBN
const getByISBN = function (isbn) {
  return new Promise((resolve,reject) => {
    if (isbn in books) {
      resolve(JSON.stringify(books[isbn]));
    }
    else {
      resolve(isbn + " was not found");
    }
    })
};

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = parseInt(req.params.isbn);
  getByISBN(isbn).then((successMessage) => {
    res.send(successMessage);
  });
 });
  
// Use a promise to get book by author
const getByAuthor = function (author) {
  return new Promise((resolve,reject) => {
    let list = {};
    for (const [key, value] of Object.entries(books))
    {
      if (value.author === author) {
        list[key] = value;
      }
    }
    resolve(JSON.stringify(list))
  })
};

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author;
  getByAuthor(author).then((successMessage) => {
    res.send(successMessage);
  });
});

// Use a promise to get book by title
const getByTitle = function (title) {
  return new Promise((resolve,reject) => {
    let list = {};
    for (const [key, value] of Object.entries(books))
    {
      if (value.title === title) {
        list[key] = value;
      }
    }
    resolve(JSON.stringify(list))
  })
};

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;
  getByTitle(title).then((successMessage) => {
    res.send(successMessage);
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = parseInt(req.params.isbn);
  if (isbn in books)
  {
    res.send(JSON.stringify(books[isbn].reviews));
  }
  else
  {
    res.send(isbn + " was not found")
  }
});

module.exports.general = public_users;
