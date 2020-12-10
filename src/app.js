require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const WTE_userRouter = require('../endPoints/users/WTE_users-router');
const WTE_recipeRouter = require('../endPoints/recipe/WTE_recipe-router');
const WTE_ingredientRouter = require('../endPoints/ingredients/WTE_ingredient-router');
const WTE_allergyRouter = require('../endPoints/allergies/WTE_allergies-router');
const app = express()

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.get('/', (req, res) => {
    res.send('The server works!')
})

app.use('/api/userEndpoint', WTE_userRouter);
app.use('/api/recipeEndpoint', WTE_recipeRouter);
app.use('/api/ingredientEndpoint', WTE_ingredientRouter);
app.use('/api/allergyEndpoint', WTE_allergyRouter);

app.get('/xss', (req, res) => {
    res.cookie('secretToken', '1234567890');
    res.sendfile(_dirname + '/xss-example.htlm');
})

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = {error: {message: 'server error'}}
    } else {
        console.error(error)
        response = {message: error.message, error}
    }
    res.status(500).json(response)
})

module.exports = app

