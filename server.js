//IMPORTS

const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv").config()
const morgan = require("morgan")


//CONSTANTS

const app = express()
const Book = require("./models/book.js")


//MIDDLEWARE

app.use(morgan("dev"))
app.use(express.urlencoded({ extended: true }))


//ROUTES

//local host landing page
app.get("/", (req, res) => {
    return res.render("index.ejs")
})

//new book form creation
app.get("/books/new", (req, res) => {
    return res.render("books/new.ejs")
})

//new book form submission
app.post("/books", async (req, res) => {
    req.body.completed = Boolean(req.body.completed) //converts to boolean
    const createdBook = await Book.create(req.body) //calling the Book class from the model.js, hence capitalisation
    res.redirect("/books") //back to index page, avoids page hanging after submitting and getting no response
})

//books index page
app.get("/books", async(req, res) => {
    const allBooks = await Book.find({})
    res.render("books/index.ejs", {books:allBooks})
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