//importing libraries
const express = require('express');
const router = express.Router();

const AppUserSchema = require('../schema/appUserSchema');


//defining the service url functionalities
router.get('/test', (req, res, next) => {
    console.log("Testing Login API")
    res.send("Login Service Test Successfull");
});

router.get('/getSessionUser/:id', (req, res, next) => {
    console.log("SessionId: ", req.params.id);
    AppUserSchema.findOne({ '_id': req.params.id }, function (err, user) {
        if (err) {
            res.json(err);
        } else {
            res.json(user);
        }
    });
});

router.get('/getUsers', (req, res, next) => {
    AppUserSchema.find(function (err, user) {
        if (err) {
            res.json(err);
        } else {
            res.json(user);
        }
    });
});

router.post('/addUser', (req, res, next) => {
    let appUser = new AppUserSchema({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        contact: req.body.contact,
        username: req.body.username,
        password: req.body.password,
        isAdmin: req.body.isAdmin,
        isStudent: req.body.isStudent,
        isRecruiter: req.body.isRecruiter,
        address: req.body.address,
        referrerName: req.body.referrerName
    });

    appUser.save(function (err, response) {
        if (err) {
            res.json({ response: 'User has not been added due to: ' + err });
        } else {
            res.json({ response: 'User has been added successfully. New user ID: ' + response._id });
        }
    });
});

router.put('/editUser/:id', (req, res, next) => {
    AppUserSchema.findOneAndUpdate({ _id: req.params.id }, {
        $set: {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            contact: req.body.contact,
            username: req.body.username,
            password: req.body.password,
            isAdmin: req.body.isAdmin,
            isStudent: req.body.isStudent,
            isRecruiter: req.body.isRecruiter,
            address: req.body.address,
            referrerName: req.body.referrerName
        }
    }, function (err, response) {
        if (err) {
            res.json({ response: 'User has not been edited due to: ' + err });
        } else {
            res.json({ response: 'User has been edited successfully. Edited User ID: ' + response._id });
        }
    });
});

router.delete('/deleteUser/:id', (req, res, next) => {
    AppUserSchema.findOneAndDelete({ _id: req.params.id }, function (err, response) {
        if (err) {
            res.json({ response: 'User has not been deleted due to: ' + err });
        } else {
            res.json({ response: 'User has been deleted successfully.' });
        }
    });
});

module.exports = router;