const mongoose = require('mongoose');

const appStudentSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    jobId: {
        type: String,
        required: true
    },
    studentId: {
        type: String,
        required: true
    },
    student: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    about: {
        type: String,
        required: false
    },
    qualification: {
        type: String,
        required: false
    },
    company: {
        type: String,
        required: false
    },
});

const AppStudent = module.exports = mongoose.model('appStudent', appStudentSchema);