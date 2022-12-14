const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
const mongoose = require('mongoose');
const cors = require("cors")
const app = express();
const multer= require("multer");
const morgan = require('morgan')
const { AppConfig } = require('aws-sdk');
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use( multer().any())

app.use(morgan('dev'))

mongoose.connect("mongodb+srv://arijit8637:WTqiGxjIFMSg5nxn@cluster0.u6fy9.mongodb.net/project-In-Work?retryWrites=true&w=majority", {
        useNewUrlParser: true
    })
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))


app.use('/',route);


app.listen(process.env.PORT || 4000, function() {
    console.log('Express app running on port ' + (process.env.PORT || 4000))
});