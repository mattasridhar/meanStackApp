const mongoose = require('mongoose');

const appConcernSchema = mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: false
    },
});

const AppConcern = module.exports = mongoose.model('appConcern', appConcernSchema);