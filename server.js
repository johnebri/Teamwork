const express = require('express');
const dotenv = require('dotenv');
const babelpolyfill = require('babel-polyfill');
const checkAuth = require('./middleware/check-auth');

const ReflectionWithDB = require('./src/app/controllers/Reflection');
const Users = require('./src/app/controllers/Users');
const Articles = require('./src/app/controllers/Articles');

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

app.post('/api/v1/auth/create-user', Users.create);
app.post('/api/v1/auth/signin', Users.signin);

app.post('/api/v1/articles', checkAuth, Articles.create_article);
app.patch('/api/v1/articles/:id', checkAuth, Articles.edit_article);
app.delete('/api/v1/articles/:id', checkAuth, Articles.delete_article);
app.post('/api/v1/articles/:id/comment', checkAuth, Articles.comment_on_article);
app.get('/api/v1/articles/:id', checkAuth, Articles.get_article);