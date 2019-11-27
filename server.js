const express = require('express');
const dotenv = require('dotenv');
const babelpolyfill = require('babel-polyfill');

const ReflectionWithDB = require('./src/app/controllers/Reflection');

dotenv.config();
const Reflection = ReflectionWithDB;

const app = express();
app.use(express.json())

app.get('/', (req, res) => {
    return res.status(200).send({'message': 'YAY! Congratulations! Your first endpoint is working'});
})

const port = process.env.PORT || 3000;

app.listen(port)
console.log('app running on port ', port);


app.post('/api/v1/reflections', Reflection.create);
app.get('/api/v1/reflections', Reflection.getAll);
app.get('/api/v1/reflections/:id', Reflection.getOne);
app.put('/api/v1/reflections/:id', Reflection.update);
app.delete('/api/v1/reflections/:id', Reflection.delete);