//importing libraries

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var http = require('http');
const path = require('path');

// //declaring constants
const PORT = 1990;
const env = require('./env/environment');
const services = require('./services/serviceUrls');
const concernServices = require('./services/concernUrls');
const recruiterServices = require('./services/recruiterUrls');
const studentServices = require('./services/studentUrls');

var app = express();
const root = './';

mongoose.Promise = global.Promise;

//connecting MongoDb
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/meanStackApp', { useNewUrlParser: true, useFindAndModify: false });

mongoose.connection.on('connected', () => {
    console.log("meanStackApp DB connected");
});

mongoose.connection.on('error', (e) => {
    console.log(e + " \nError while connecting to meanStackApp");
});

//app functions
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(root, 'dist')));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/serve', services);//to handle the service calls coming from Login page
app.use('/recruiter', recruiterServices);//to handle the service calls coming from Recruiter page
app.use('/student', studentServices);//to handle the service calls coming from Student page
app.use('/contactus', concernServices);//to handle the service calls coming from Contact Us page

app.listen(PORT, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log("Application listening to port: " + PORT);
});

app.get('/', (request, response) => {
    response.send('Checking Link Succeeded');
})
