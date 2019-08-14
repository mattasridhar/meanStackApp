const mongoose = require('mongoose');

const appRecruiterSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: false
    },
    salary: {
        type: String,
        required: false
    },
    location: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    qualification: {
        type: String,
        required: false
    },
    recruiter: {
        type: String,
        required: false
    },
});

const AppRecruiter = module.exports = mongoose.model('appRecruiter', appRecruiterSchema);