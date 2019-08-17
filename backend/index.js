//importing libraries

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var http = require('http');

// //declaring constants
const PORT = process.env.PORT || 8080;
const HOST = '127.0.0.1';
const mongoURI = 'mongodb+srv://overlordsridhar:Sri19dhar@inyugomean-6nh8y.gcp.mongodb.net/test?retryWrites=true&w=majority';
//const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/meanStackApp';
const services = require('./services/serviceUrls');
const concernServices = require('./services/concernUrls');
const recruiterServices = require('./services/recruiterUrls');
const studentServices = require('./services/studentUrls');

var app = express();

//connecting MongoDb
/* mongoose.connect(mongoURI, { useNewUrlParser: true, useFindAndModify: false });

mongoose.connection.on('connected', () => {
    console.log("meanStackApp DB connected");
});

mongoose.connection.on('error', (e) => {
    console.log(e + " \nError while connecting to meanStackApp");
}); */

const MongoClient = require('mongodb').MongoClient;
const gcpbucket = 'gs://demo-visionapi-atlas';
const uri = "mongodb+srv://overlordsridhar:Sri19dhar@inyugomeancluster-a604b.gcp.mongodb.net/test?retryWrites=true&w=majority";
/* const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
}); */

MongoClient.connect(uri, { useNewUrlParser: true }, (err, database) => {
    if (err) {
        return console.log(err);
    }
    console.log('Successfully connected to MongoDB Atlas');
    db = database;
    // start the express web server listening on 8080
    app.listen(PORT, () => {
        console.log('listening on ' + PORT);
        console.log('Input GCP bucket is set to ' + gcpbucket);
    });
});


//app functions
app.use(cors());
app.use(bodyParser.json());

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
