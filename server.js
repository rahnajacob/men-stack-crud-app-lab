//IMPORTS

const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv").config()
const morgan = require("morgan")
const methodOverride = require("method-override")


//CONSTANTS

const app = express()
const Book = require("./models/book.js")


//MIDDLEWARE

app.use(morgan("dev"))
app.use(express.urlencoded({ extended: true })) //gets the form data from body of books/new in a format that isn't undefined
app.use(methodOverride("_method"))


//ROUTES

//local host landing page
app.get("/", (req, res) => {
    return res.render("index.ejs")
})

//new book form creation
app.get("/books/new", (req, res) => {
    return res.render("books/new.ejs")
})

//making each book characteristic a link (SHOW ROUTE)
app.get("/books/:bookId", async (req, res) => {
    const foundBook = await Book.findById(req.params.bookId)
    console.log(foundBook)
    res.render("books/show.ejs", { book: foundBook })
    console.log({ book: foundBook })
})

//making a DELETE route - onto the SHOW.ejs
app.delete("/books/:bookId", async (req, res) => {
    await Book.findByIdAndDelete(req.params.bookId)
    res.redirect("/books")
})

//new book form submission
app.post("/books", async (req, res) => {
    req.body.completed = Boolean(req.body.completed) //converts to boolean
    const createdBook = await Book.create(req.body) //calling the Book class from the model.js, hence capitalisation
    res.redirect("books") //back to index page, avoids page hanging after submitting and getting no response
})

//edit book info form
app.get("/books/:bookId/edit", async (req, res) => {
    const foundBook = await Book.findById(req.params.bookId)
    res.render("books/edit.ejs", {book:foundBook})
})

//getting edit book form
app.put("/books/:bookId", async (req, res) => {
    req.body.completed = Boolean(req.body.completed)
    await Book.findByIdAndUpdate(req.params.bookId, req.body)
    res.redirect(`/books/${req.params.bookId}`)
}) 

//books index page
app.get("/books", async (req, res) => {
    const allBooks = await Book.find({})
    res.render("books/index.ejs", { books: allBooks })
})


//SERVER CONNECTIONS

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Mongo more like ReadyToGo")
        app.listen((process.env.PORT), () => {
            console.log("PORT (cough cough) running")
        })
    } catch (err) {
        console.log(err, "check connect function")
    }
}

connect()