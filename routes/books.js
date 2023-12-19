const express = require("express");
const Book = require("../models/book");
const bookSchemaNew = require('../schemas/bookSchemaNew.json')
const bookSchemaUpdate = require('../schemas/bookSchemaUpdate.json')
const jsonschema = require('jsonschema')
const ExpressError = require('../expressError')

const router = new express.Router();


/** GET / => {books: [book, ...]}  */

router.get("/", async function (req, res, next) {
  try {
    const books = await Book.findAll(req.query);
    return res.json({ books });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]  => {book: book} */

router.get("/:id", async function (req, res, next) {
  try {
    // id must be an isbn
    const book = await Book.findOne(req.params.id);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

/** POST /   bookData => {book: newBook}  */

router.post("/", async function (req, res, next) {
  try {
    const result = jsonschema.validate(req.body,bookSchemaNew)
    if(result.valid){
      const book = await Book.create(req.body);
      return res.status(201).json({ book });
    } else{
      const errorsArray = result.errors.map(r => r.stack)
      const e = new ExpressError(errorsArray, 400)
      return next(e)
    } 
  } catch (err) {
    return next(err);
  }
});

/** PUT /[isbn]   bookData => {book: updatedBook}  */

router.put("/:isbn", async function (req, res, next) {
  try {
    const result = jsonschema.validate(req.body, bookSchemaUpdate)
    if(result.valid){
      const book = await Book.update(req.params.isbn, req.body);
      return res.json({ book });
    } else{
      const errorsArray = result.errors.map(r => r.stack)
      const e = new ExpressError(errorsArray, 400)
    }
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[isbn]   => {message: "Book deleted"} */

router.delete("/:isbn", async function (req, res, next) {
  try {
    await Book.remove(req.params.isbn);
    return res.json({ message: "Book deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
