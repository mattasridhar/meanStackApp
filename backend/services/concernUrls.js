//importing libraries
const express = require('express');
const router = express.Router();

const AppConcernSchema = require('../schema/appConcernSchema');


//defining the service url functionalities
router.get('/testConcerns', (req, res, next) => {
    console.log("Testing ContactUs API")
    res.send("Contact-Us Service Test Successfull");
});

router.get('/getAllConcerns', (req, res, next) => {
    AppConcernSchema.find(function (err, concern) {
        if (err) {
            res.json(err);
        } else {
            res.json(concern);
        }
    })
})

router.post('/answerConcern', (req, res, next) => {
    console.log(req.body);
    let appConcern = new AppConcernSchema({
        question: req.body.question,
        answer: req.body.answer,
    });

    appConcern.save(function (err, response) {
        if (err) {
            res.json({ response: 'Concern has not been added due to: ' + err });
        } else {
            res.json({ response: 'Concern has been successfully addressed. New concern ID: ' + response._id });
        }
    });
});

router.get('/getSearchResponse/:question', (req, res, next) => {
    console.log("Search Ques: ", req.params);
    AppConcernSchema.findOne({ question: req.params.question },
        function (err, concern) {
            if (err) {
                res.json(err);
            } else {
                res.json(concern);
            }
        });
});

router.get('/getShowResponse/:question', (req, res, next) => {
    console.log("Show Ques: ", req.params);
    AppConcernSchema.findOne({ question: req.params.question },
        function (err, concern) {
            if (err) {
                res.json(err);
            } else {
                res.json(concern);
            }
        });
});

router.put('/editResponse/:id', (req, res, next) => {
    // console.log(req.params.id);
    // console.log(req.body);
    AppConcernSchema.findOneAndUpdate({ _id: req.params.id }, {
        $set: {
            question: req.body.question,
            answer: req.body.answer,
        }
    }, function (err, response) {
        if (err) {
            res.json({ response: 'Concern has not been edited due to: ' + err });
        } else {
            res.json({ response: 'Concern has been edited successfully. Edited Concern ID: ' + response._id });
        }
    });
});

router.delete('/deleteConcern/:id', (req, res, next) => {
    console.log(req.params.id);
    console.log(req.body);
    AppConcernSchema.findOneAndDelete({ _id: req.params.id }, function (err, response) {
        if (err) {
            res.json({ response: 'Concern has not been deleted due to: ' + err });
        } else {
            res.json({ response: 'Concern has been deleted successfully.' });
        }
    });
});

module.exports = router;