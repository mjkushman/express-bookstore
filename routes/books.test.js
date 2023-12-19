process.env.NODE_ENV = 'test';

const request = require('supertest');

const app = require('../app');
const db = require("../db");

let testGetBook
let testPostBook

beforeEach(async () => {
    // create a book
    await db.query(
        `INSERT INTO books (isbn, amazon_url, author, language, pages, publisher, title, year)
        VALUES ('1111111111', 'http://a.co/eobPtX2', 'Matthew Lane', 'english', 264, 'Princeton University Press','Power-Up: Unlocking the Hidden Mathematics in Video Games',2017)`
    );
    
    testGetBook = {
        'isbn': '1111111111',
        "amazon_url": "http://a.co/eobPtX2",
        "author": "Matthew Lane",
        "language": "english",
        "pages": 264,
        "publisher": "Princeton University Press",
        "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
        "year": 2017
    }
    
    testPostBook = {
        'isbn': '0123456789',
        "amazon_url": "http://a.co/eobPtX2",
        "author": "Test McTesty",
        "language": "english",
        "pages": 666,
        "publisher": "Test Printing Club",
        "title": "This is a Test Title",
        "year": 1999
    }
    testPutBook = {
        "amazon_url": "http://a.co/eobPtX2",
        "author": "Big McTesty",
        "language": "english",
        "pages": 999,
        "publisher": "Test Printing Club",
        "title": "Test is a Test ",
        "year": 1999
    }
})

describe("Get /", () => {
    test("Get all books from /books", async () => {
        const response = await request(app).get('/books')
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({books:expect.any(Array)})
    })

    test("Get a single book from /books/:id", async () => {
        const response = await request(app).get(`/books/${testGetBook.isbn}`)
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({book: testGetBook})
    })
})

describe(" POST /", () => {
    
    test("Add a book to /books", async ()=> {
        const response = await request(app).post('/books').send(testPostBook)
        expect(response.statusCode).toBe(201)
        expect(response.body).toEqual({book:testPostBook})
    })
})

describe(" PUT /", () => {
    test("Update a book at /:isbn with put request", async () => {
        const response = await request(app).put(`/books/${testGetBook.isbn}`)
        .send(testPutBook)

        expect(response.body.book.isbn).toBe(testGetBook.isbn)
        expect(response.body.book.title).toBe(testPutBook.title)
    })
})

describe(" DELETE /", () => {

})



afterEach(async function() {
    await db.query("DELETE FROM books")
})

afterAll(async function() {
    await db.end();
})