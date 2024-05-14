const express= require('express');
require ('dotenv').config();
const mongoose = require("mongoose");
const User = require('./models/User.js');
const Message = require('./models/Message.js');
const jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');
var cors = require('cors');
var bcrypt = require('bcryptjs');
const ws = require('ws');
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
const bcryptSalt = bcrypt.genSaltSync(10);

app.get('/test', (req, res) => {
    res.json("test: ok");
});

app.get('/profile', (req, res) => {
    const token = req.cookies?.token;
    if(token){
        jwt.verify(token, jwtSecret, {}, (err, userdata) =>{
            if(err) throw err;
          //  console.log(userdata);
            res.json(userdata);
            
        });
    }
    else{
        res.status(401).json('no token');
    }
   
});

app.post('/login', async (req, res) => {
    const {username, password} = req.body;
    const foundUser  = await User.findOne({username});
    //console.log(foundUser);
    if(foundUser){
        const passOk = bcrypt.compareSync(password, foundUser.password);
        if(passOk){
            jwt.sign({userId: foundUser._id, username}, jwtSecret, {}, (err, token) => {
                if(err) throw err;
                res.cookie('token', token, {sameSite: 'none', secure: 'true'}).json({
                    id: foundUser._id,
                })
            });
        }
}

});


app.post('/register' , async (req, res) => {
    const {username, password} = req.body;

    try{
        const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
    const createdUser = await User.create({
        username: username, 
        password: hashedPassword});
    jwt.sign({userid : createdUser._id, username }, jwtSecret , {} , (err, token) => {
        if (err) throw err;
        res.cookie('token', token, {sameSite: "none", secure: true}).status(201).json({
            id: createdUser._id,
            
        });
    });
    } catch (err){
        if(err) throw err;
        res.status(500).json('error');
    }

   

});

const server = app.listen(4040);

const wss =  new ws.WebSocketServer({server});
wss.on('connection', (connection, req) => {

    
    const cookies = req.headers.cookie;
    if(cookies){
        const tokenCookieString = cookies.split(';').find(str => str.startsWith('token='));
        if(tokenCookieString){
            const token = tokenCookieString.split('=')[1];
            if(token){
                jwt.verify(token, jwtSecret, {}, (err, userData) => {
                    if(err) throw err;
                    const {userId, username} = userData;
                    //console.log(userData);
                    connection.userId = userId;
                    connection.username = username;
                });
            }
        }
    }

    connection.on('message', async (message) => {
        const messageData = JSON.parse(message.toString());
        const {recipient, text} = messageData;
        if(recipient && text){
            const messageDoc = await Message.create({
                sender: connection.userId,
                recipient,
                text,
            });
            [...wss.clients]
            .filter(c => c.userId === recipient)
            .forEach(c => c.send(JSON.stringify({text, 
                sender: connection.userId,
                id: messageDoc._id,
            })));
        }
    });
   // console.log([...wss.clients].map(c => c.userId));
   //online people
    [...wss.clients].forEach(client => {
        client.send(JSON.stringify(
            {online: [...wss.clients].map(c => ({userId: c.userId, username: c.username}))
        }
        ));
    });
});