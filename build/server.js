'use strict';

// import express from 'express';
var express = require('express');
var Reflection = require('./src/controllers/Reflection');
//import Reflection from './src/controllers/Reflection';

var app = express();

app.use(express.json());

app.get('/', function (req, res) {
    return res.status(200).send({ 'message': 'YAY! Congratulations! Your first endpoint is working' });
});

app.listen(3000);
console.log('app running on port ', 3000);

app.post('/api/v1/reflections', Reflection.create);
app.get('/api/v1/reflections', Reflection.getAll);
app.get('/api/v1/reflections/:id', Reflection.getOne);
app.put('/api/v1/reflections/:id', Reflection.update);
app.delete('/api/v1/reflections/:id', Reflection.delete);