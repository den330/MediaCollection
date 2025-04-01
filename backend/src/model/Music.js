const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    artist: {
        type: String,
        required: false,
    },
    
    ISRC: {
        type: String,
        required: true,
    },

    album: {
        type: String,
        required: false,
    },
    genre: {
        type: String,
        required: false,
    },
});


musicSchema.statics.insertMusic = async function (title, ISRC, artist, album, genre, options = {}) {
    try {
        const normalizedISRC = ISRC.trim().toUpperCase();
        const normalizedTitle = title.trim();
        const normalizedArtist = artist?.trim() || 'unknown';
        const normalizedAlbum = album?.trim() || 'unknown';
        const normalizedGenre = genre?.trim() || 'unknown';
        if(!normalizedTitle || !normalizedISRC) {
            throw new Error('Title and ISRC are required');
        }
        const existingMusic = await this.findOne({ ISRC: normalizedISRC });
        if (existingMusic) {
            return existingMusic;
        }
        const newMusic = new this({
            title: normalizedTitle,
            artist: normalizedArtist,
            ISRC: normalizedISRC,
            album: normalizedAlbum,
            genre: normalizedGenre
        });
        await newMusic.save(options);
        return newMusic;
    }
    catch (error) {
        throw error
    }
};

musicSchema.statics.getMusic = async function (ISRC) {
    try {
        const normalizedISRC = ISRC.trim().toUpperCase();
        const music = await this.findOne({ ISRC: normalizedISRC });
        if (!music) {
            return null;
        }
        return music;
    } catch (error) {
        throw error
    }
};

const Music = mongoose.model('Music', musicSchema);
module.exports = Music;