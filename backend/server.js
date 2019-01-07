const express = require('express');
const requireDir = require('require-dir');
const mongoose = require('mongoose');
const cors = require('cors');
const port = 3000;

const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);

mongoose.connect('mongodb://localhost:27017/twitter', {
    useNewUrlParser: true
});

app.use((req, res, next) => {
    req.io = io;
    return next();
})

app.use(express.json());
app.use(cors());
requireDir('./src/models');
app.use(require('./src/routes'));

server.listen(port, () => {
    console.log("Server is running");
})