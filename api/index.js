const express= require('express');
require ('dotenv').config();
const mongoose = require("mongoose");
const User = require('./models/User.js');
const jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');
var cors = require('cors');
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors(
    {
        credentials: true,
        origin: process.env.CLIENT_URL,
    }
));



mongoose.connect(process.env.MONGO_URL);

const jwtSecret = process.env.JWT_SECRET;

app.get('/test', (req, res) => {
    res.json("test: ok");
});

app.get('/profile', (req, res) => {
    const token = req.cookies?.token;
    if(token){
        jwt.verify(token, jwtSecret, {}, (err, userdata) =>{
            if(err) throw err;
            res.json(userdata);
        });
    }
    else{
        res.status(401).json('no token');
    }
   
});

app.post('/register' , async (req, res) => {
    const {username, password} = req.body;

    try{
    const createdUser = await User.create({username, password});
    jwt.sign({userid : createdUser._id}, jwtSecret , {} , (err, token) => {
        if (err) throw err;
        res.cookie('token', token).status(201).json({
            id: createdUser._id,
            username,
        });
    });
    } catch (err){
        if(err) throw err;
        res.status(500).json('error');
    }

   

});

app.listen(4040);