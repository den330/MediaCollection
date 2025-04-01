const mongoose = require('mongoose');

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

bookSchema.statics.insertBook = async function (title, ISBN, author, options = {}) {
    try {
        const normalizedISBN = ISBN.trim().toUpperCase();
        const normalizedTitle = title.trim();
        const normalizedAuthor = author?.trim() || 'unknown';
        if (!normalizedTitle || !normalizedISBN) {
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
        await newBook.save(options);
        return newBook;
    } catch (error) {
        throw error
    }
};

bookSchema.statics.getBook = async function (ISBN) {
    try {
        const normalizedISBN = ISBN.trim().toUpperCase();
        const book = await this.findOne({ ISBN: normalizedISBN });
        if (!book) {
            return null;
        }
        return book;
    } catch (error) {
        throw error
    }
};

const Book = mongoose.model('Book', bookSchema);