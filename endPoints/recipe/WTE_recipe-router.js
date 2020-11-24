const path = require('path');
const express = require('express');
const xss = require('xss');
const WTE_RecipeServices = require('./WTE_recipe-services');
const { v4: uuidv4 } = require('uuid');
const { serialize } = require('v8');

const recipeRouter = express.Router();
const jsonParser = express.json();

const serializeRecipe = recipeInfo => ({
    id: xss(recipeInfo.id),
    recipe_name: xss(recipeInfo.recipe_name),
    recipe_image_link: xss(recipeInfo.recipe_image_link),
    serving_size: xss(recipeInfo.serving_size),
    total_calories: xss(recipeInfo.total_calories),
    cook_time: xss(recipeInfo.cook_time),
    cooking_instruction_link: xss(recipeInfo.cooking_instruction_link),
    user_id: xss(recipeInfo.user_id)
})

recipeRouter
    .route('/')

    .post(jsonParser, (req, res, next) => {
        const { recipe_name, recipe_image_link, serving_size, total_calories, cook_time, cooking_instruction_link, user_id } = req.body;
        let id = req.body.id;
        
        if(id === undefined) {
            id = uuidv4();
        }

        const newRecipeInfo = {id, recipe_name, recipe_image_link, serving_size, total_calories, cook_time, cooking_instruction_link, user_id };

        for(const [key, value] of Object.entries(newRecipeInfo)) {
            if(value === undefined || value === '')
                return res.status(400).json({
                    error: {message: `Missing '${key}' value.`}
                })
        }

        WTE_RecipeServices.insertRecipe(
            req.app.get('db'),
            newRecipeInfo
        )
        
        .then(recipe => {
            res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${recipe.id}`))
                .json(serializeRecipe(recipe))
        })

        .catch(next)
    })

recipeRouter
    .route('/:user_id')

    .get((req, res, next) => {

        WTE_RecipeServices.getRecipeByUserId(
            req.app.get('db'),
            req.params.user_id
        )

        .then(user => {
            res.json(user)
        })

        .catch(next)
    })

recipeRouter
    .route('/:recipe_id')

    .delete((req, res, next) => {

        WTE_RecipeServices.deleteRecipeById(
            req.app.get('db'),
            req.params.recipe_id
        )

        .then(deleted_recipe => {
            res
                .status(204)
                .json({message: `${deleted_recipe.recipe_name} was deleted`})
                .end()
        })

        .catch(next)
    })

module.exports = recipeRouter;

   
