const mongoose = require('mongoose')

const TranslationSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    language1: {
        type: String,
        required: true
    },
    language2: {
        type: String,
        required: true
    },
    l1_text: {
        type: String,
        required: true
    },
    l2_text: {
        type: String,
        required: true
    },
    wortart: {
        type: String,
        required: true
    },
    synonyme1: {
        type: [String],
        required: true
    },
    synonyme2: {
        type: [String],
        required: true
    },
    freq: {
        type: Number,
        required: true
    }
})

mongoose.model('Translation', TranslationSchema)