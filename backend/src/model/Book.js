const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: false,
    },
    ISBN: {
        type: String,
        required: true,
    },
});

bookSchema.statics.insertBook = asyncHandler(async function (title, ISBN, author) {
    const normalizedISBN = ISBN.trim().toUpperCase();
    const normalizedTitle = title.trim();
    const normalizedAuthor = author?.trim() || 'unknown';
    if (!normalizedAuthor || !normalizedISBN) {
        throw new Error('Title and ISBN are required');
    }
    const existingBook = await this.findOne({ ISBN: normalizedISBN });
    if (existingBook) {
        return existingBook;
    }
    const newBook = new this({
        title: normalizedTitle,
        ISBN: normalizedISBN,
        author: normalizedAuthor
    });
    await newBook.save();
    return newBook;
});

bookSchema.statics.getBook = asyncHandler(async function (ISBN) {
    const normalizedISBN = ISBN.trim().toUpperCase();
    const book = await this.findOne({ ISBN: normalizedISBN });
    if (!book) {
        return null;
    }
    return book;
});

const Book = mongoose.model('Book', bookSchema);