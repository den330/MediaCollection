const asynchandler = require('express-async-handler');
const userModel = require('../model/User');

const inserUser = asynchandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new Error('Email is required');
    }
    try {
        const user = await userModel.insertUser(email);
        return res.status(200).json(user);
    } catch (error) {
        throw new Error('Error inserting user');
    }
});

const getUser = asynchandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new Error('Email is required');
    }
    try {
        const user = await userModel.findUser(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(user);
    } catch (error) {
        throw new Error('Error getting user');
    }
});

const addBook = asynchandler(async (req, res) => {
    const { email, ISBN } = req.body;
    if (!email || !ISBN) {
        throw new Error('Email and ISBN are required');
    }
    try {
        const user = await userModel.findUser(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const book = await user.addBook(ISBN);
        return res.status(200).json(book);
    } catch (error) {
        throw new Error('Error adding book');
    }
});

const removeBook = asynchandler(async (req, res) => {
    const { email, ISBN } = req.body;
    if (!email || !ISBN) {
        throw new Error('Email and ISBN are required');
    }
    try {
        const user = await userModel.findUser(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.removeBook(ISBN);
        return res.status(200).json({ message: 'Book removed successfully' });
    } catch (error) {
        throw new Error('Error removing book');
    }
});

const addMusic = asynchandler(async (req, res) => {
    const { email, ISRC } = req.body;
    if (!email || !ISRC) {
        throw new Error('Email and ISRC are required');
    }
    try {
        const user = await userModel.findUser(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const music = await user.addMusic(ISRC);
        return res.status(200).json(music);
    } catch (error) {
        throw new Error('Error adding music');
    }
});

const removeMusic = asynchandler(async (req, res) => {
    const { email, ISRC } = req.body;
    if (!email || !ISRC) {
        throw new Error('Email and ISRC are required');
    }
    try {
        const user = await userModel.findUser(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.removeMusic(ISRC);
        return res.status(200).json({ message: 'Music removed successfully' });
    } catch (error) {
        throw new Error('Error removing music');
    }
});

const findUserWithMatchingRefreshToken = asynchandler(async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        throw new Error('Refresh token is required');
    }
    try {
        const user = await userModel.findUserWithMatchingRefreshToken(refreshToken);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json(user);
    } catch (error) {
        throw new Error('Error finding user with matching refresh token');
    }
});

module.exports = {
    inserUser,
    getUser,
    addBook,
    removeBook,
    addMusic,
    removeMusic,
    findUserWithMatchingRefreshToken
};