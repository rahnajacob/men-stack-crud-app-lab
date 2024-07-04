const mongoose = require("mongoose")

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    rating: Number,
    dateStarted: Date,
    completed: Boolean,
    rereads: Number
})

const Book = mongoose.model("Book", bookSchema)

module.exports = Book