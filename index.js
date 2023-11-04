const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const routes = require('./src/routes');

const index = express();

index.use(bodyParser.json());
index.use('/images', express.static(path.join(__dirname, 'images')));

index.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

index.use('/api/v1', routes);

mongoose.connect('mongodb://localhost:27017/play-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('You are connected to player-db!');
        index.listen(3000);
    })
    .catch((error) => {
        console.log('Connection to player-db failed', error);
    });
