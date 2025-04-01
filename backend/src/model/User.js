const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    refreshToken: {
        type: String,
        required: false,
    },
    favoriteBooks: [{ type: String, default: [] }],
    favoriteMusic: [{ type: String, default: [] }],
});

userSchema.statics.insertUser = async function (email) {
    try {
        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await this.findOne({ email: normalizedEmail });
        if (existingUser) {
            return existingUser;
        }
        const newUser = await this.create({
            email: normalizedEmail,
        });
        return newUser;
    } catch (error) {
        throw error
    }
}

userSchema.statics.findUser = async function (email) {
    try {
        const normalizedEmail = email.trim().toLowerCase();
        const user = await this.findOne({ email: normalizedEmail });
        if (!user) {
            return null;
        }
        return user;
    } catch (error) {
        throw error
    }
}

userSchema.statics.findMatchingRefreshToken = async function (refreshToken) {
    const normalizedRefreshToken = refreshToken.trim();
    try {
        const user = await this.findOne({ refreshToken: normalizedRefreshToken });
        if (!user) {
            return null;
        }
        return user;
    } catch (error) {
        throw error
    }
}

userSchema.addBook = async function (ISBN, title, author, options = {}) {
    const session = mongoose.startSession();
    try {
        session.startTransaction();
        const normalizedISBN = ISBN.trim().toUpperCase();
        const existingISBN = this.favoriteBooks.includes(normalizedISBN);
        if (existingISBN) {
            await session.abortTransaction();
            session.endSession();
            return existingISBN;
        }

        const book = await this.model('Book').insertBook(title, normalizedISBN, author, {session});
        this.favoriteBooks.push(book.ISBN);
        await this.save({session});
        await session.commitTransaction();
        session.endSession();
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error
    }
}

userSchema.addMusic = async function (ISRC, title, artist, album, genre, options = {}) {
    const session = mongoose.startSession();
    try {
        session.startTransaction();
        const normalizedISRC = ISRC.trim().toUpperCase();
        const existingISRC = this.favoriteMusic.includes(normalizedISRC);
        if (existingISRC) {
            await session.abortTransaction();
            session.endSession();
            return existingISRC;
        }

        const music = await this.model('Music').insertMusic(title, normalizedISRC, artist, album, genre, {session});
        this.favoriteMusic.push(music.ISRC);
        await this.save({session});
        await session.commitTransaction();
        session.endSession();
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error
    }
}
