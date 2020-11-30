const path = require('path');
const express = require('express');
const xss = require('xss');
const WTE_IngredientServices = require('./WTE_ingredient-services');
const { v4: uuidv4 } = require('uuid');
const { serialize } = require('v8');

const ingredientRouter = express.Router();
const jsonParser = express.json();

const serializedIngredient = ingredientInfo => ({
    id: xss(ingredientInfo.id),
    ingredient: xss(ingredientInfo.ingredient),
    recipe_id: xss(ingredientInfo.recipe_id)
})

ingredientRouter
    .route('/')

    //  Posts an ingredient
    .post(jsonParser, (req, res, next) => {
        //  Grabs info from request body
        const { ingredient, recipe_id } = req.body;
        let id = req.body.id;
        
        if(id === undefined) {
            id = uuidv4();
        }

        //  Checks the values of the request body to see if the essentials exists
        const newIngredientInfo = { id, ingredient, recipe_id };
        for(const [key, value] of Object.entries(newIngredientInfo)) {
            if(value === undefined || value === '')
                return res.status(400).json({
                    error: {message: `Missing '${key} value.'`}
                })
        }

        //  Posts the ingredient info
        WTE_IngredientServices.insertIngredient(
            req.app.get('db'),
            newIngredientInfo
        )

        .then(ingredient => {
            res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${ingredient.id}`))
                .json(serializedIngredient(ingredient))
        })

        .catch(next)
    })

ingredientRouter
    .route('/recipe/:recipe_id')

    .get((req, res, next) => {

        WTE_IngredientServices.getIngredientByRecipeId(
            req.app.get('db'),
            req.params.recipe_id
        )

        .then(ingredients => {
            res.json(ingredients)
        })

        .catch(next)
    })

module.exports = ingredientRouter;
