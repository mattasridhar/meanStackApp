//importing libraries
const express = require('express');
const router = express.Router();

const AppRecruiterSchema = require('../schema/appRecruiterSchema');
const AppStudentSchema = require('../schema/appStudentSchema');


//defining the service url functionalities
router.get('/testStudent', (req, res, next) => {
    console.log("Testing Student API")
    res.send("Student Service Test Successfull");
});

router.get('/getAllStudents', (req, res, next) => {
    console.log("SRI in student getAllJobs");
    AppStudentSchema.find(function (err, jobs) {
        if (err) {
            res.json(err);
        } else {
            res.json(jobs);
        }
    })
});

router.get('/getAppliedJobs/:id', (req, res, next) => {
    console.log("SessionId: ", req.params.id);
    AppStudentSchema.find({ 'studentId': req.params.id }, function (err, jobs) {
        if (err) {
            res.json(err);
        } else {
            console.log("applJobs: ", jobs);
            res.json(jobs);
        }
    });
});

router.get('/getAllJobs', (req, res, next) => {
    console.log("SRI in student getAllJobs");
    AppRecruiterSchema.find(function (err, jobs) {
        if (err) {
            res.json(err);
        } else {
            res.json(jobs);
        }
    })
});

router.post('/applyJob', (req, res, next) => {
    console.log(req.body);
    let appStudentJobs = new AppStudentSchema({
        title: req.body.title,
        jobId: req.body.jobId,
        studentId: req.body.studentId,
        student: req.body.student,
        contact: req.body.contact,
        email: req.body.email,
        address: req.body.address,
        about: req.body.about,
        qualification: req.body.qualification,
        company: req.body.company,
    });

    appStudentJobs.save(function (err, response) {
        if (err) {
            res.json({ response: 'Job has not been applied due to: ' + err, status: "Error" });
        } else {
            res.json({
                response: 'Job has been successfully applied. New Applied Job ID: ' + response._id,
                status: 'Ok'
            });
        }
    });
});

router.put('/editAppliedJob/:id', (req, res, next) => {
    // console.log(req.params.id);
    // console.log(req.body);
    AppStudentSchema.findOneAndUpdate({ _id: req.params.id }, {
        $set: {
            title: req.body.title,
            jobId: req.body.jobId,
            studentId: req.body.studentId,
            student: req.body.student,
            contact: req.body.contact,
            email: req.body.email,
            address: req.body.address,
            about: req.body.about,
            qualification: req.body.qualification,
            company: req.body.company,
        }
    }, function (err, response) {
        if (err) {
            res.json({ response: 'Applied Job has not been edited due to: ' + err, status: "Error" });
        } else {
            res.json({
                response: 'Applied Job has been edited successfully. Edited Job ID: ' + response._id,
                status: 'Ok'
            });
        }
    });
});

router.delete('/deleteAppliedJob/:id', (req, res, next) => {
    console.log(req.params.id);
    console.log(req.body);
    AppStudentSchema.findOneAndDelete({ _id: req.params.id }, function (err, response) {
        if (err) {
            res.json({ response: 'Applied Job has not been deleted due to: ' + err, status: "Error" });
        } else {
            res.json({
                response: 'Applied Job has been deleted successfully.',
                status: 'Ok'
            });
        }
    });
});

module.exports = router;