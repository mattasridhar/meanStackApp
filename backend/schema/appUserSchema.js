const mongoose = require('mongoose');

const appUserSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    contact: {
        type: Number,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: false
    },
    isStudent: {
        type: Boolean,
        required: false
    },
    isRecruiter: {
        type: Boolean,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    referrerName: {
        type: String,
        required: false
    }
});

const AppUser = module.exports = mongoose.model('appUser', appUserSchema);