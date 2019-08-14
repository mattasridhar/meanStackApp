//importing libraries
const express = require('express');
const router = express.Router();

const AppRecruiterSchema = require('../schema/appRecruiterSchema');
const AppStudentSchema = require('../schema/appStudentSchema');


//defining the service url functionalities
router.get('/testRecruiter', (req, res, next) => {
    console.log("Testing Recruiter API")
    res.send("Recruiter Service Test Successfull");
});

router.get('/getAllJobs', (req, res, next) => {
    console.log("SRI in rcruit getAllJobs");
    AppRecruiterSchema.find(function (err, jobs) {
        if (err) {
            res.json(err);
        } else {
            res.json(jobs);
        }
    })
});

router.get('/getAllStudents', (req, res, next) => {
    console.log("SRI in rcruit getAllStudents");
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
    AppStudentSchema.find({ 'jobId': req.params.id }, function (err, jobs) {
        if (err) {
            res.json(err);
        } else {
            console.log("applJobs: ", jobs);
            res.json(jobs);
        }
    });
});

router.post('/storeJob', (req, res, next) => {
    console.log(req.body);
    let appRecruiterJobs = new AppRecruiterSchema({
        title: req.body.title,
        company: req.body.company,
        type: req.body.type,
        salary: req.body.salary,
        location: req.body.location,
        description: req.body.description,
        qualification: req.body.qualification,
        recruiter: req.body.recruiter,
    });

    appRecruiterJobs.save(function (err, response) {
        if (err) {
            res.json({ response: 'Job has not been added due to: ' + err, status: "Error" });
        } else {
            res.json({
                response: 'Job has been successfully addressed. New Job ID: ' + response._id,
                status: 'Ok'
            });
        }
    });
});

router.put('/editJob/:id', (req, res, next) => {
    // console.log(req.params.id);
    // console.log(req.body);
    AppRecruiterSchema.findOneAndUpdate({ _id: req.params.id }, {
        $set: {
            title: req.body.title,
            company: req.body.company,
            type: req.body.type,
            salary: req.body.salary,
            location: req.body.location,
            description: req.body.description,
            qualification: req.body.qualification,
            recruiter: req.body.recruiter,
        }
    }, function (err, response) {
        if (err) {
            res.json({ response: 'Job has not been edited due to: ' + err, status: "Error" });
        } else {
            res.json({
                response: 'Job has been edited successfully. Edited Job ID: ' + response._id,
                status: 'Ok'
            });
        }
    });
});

router.delete('/deleteJob/:id', (req, res, next) => {
    console.log(req.params.id);
    console.log(req.body);
    AppRecruiterSchema.findOneAndDelete({ _id: req.params.id }, function (err, response) {
        if (err) {
            res.json({ response: 'Job has not been deleted due to: ' + err, status: "Error" });
        } else {
            res.json({
                response: 'Job has been deleted successfully.',
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