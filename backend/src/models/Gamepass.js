const mongoose = require('mongoose');

const gamepassSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    priceRobux: {
        type: Number,
        required: true
    },
    priceReal: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        default: 0
    },
    image: String,
    active: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Gamepass', gamepassSchema);
