const mongoose = require("mongoose")

const WishSchema = new mongoose.Schema({
    originLat: {
        type: Number,
        required: true
    },
    originLon: {
        type: Number,
        required: true
    },
    originName: {
        type: String,
        required: true
    },
    destinationLat: {
        type: Number,
        required: true
    },
    destinationLon: {
        type: Number,
        required: true
    },
    destinationName: {
        type: String,
        required: true
    },
    huts: {
        type: [String],
        default: []
    },
    peaks: {
        type: [String],
        default: []
    },
    userId: {
        type: mongoose.Types.ObjectId,
        required: true
    }
}, { timestamps: true, collection: `wishlist`});

const Wish = mongoose.model('Wish', WishSchema);

module.exports = Wish;