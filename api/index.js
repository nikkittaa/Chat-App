const express= require('express');
require ('dotenv').config();
const mongoose = require("mongoose");
const User = require('./models/User.js');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());
app.use(express.cookieParser());

mongoose.connect(process.env.MONGO_URL);

const jwtSecret = process.env.JWT_SECRET;

app.get('/test', (req, res) => {
    res.json("test: ok");
});

app.post('/register' , async (req, res) => {
    const {username, password} = req.body;
    const createdUser = await User.create({username, password});
    jwt.sign({userid : createdUser._id}, jwtSecret ,(err, token) => {
        if (err) throw err;
        res.cookies('token', token).status(201).json('ok');
    });

});

app.listen(4000);