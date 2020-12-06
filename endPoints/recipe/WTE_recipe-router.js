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

const serializedDeleted = deletedInfo => ({
    
})

recipeRouter
    .route('/')
    
    //  posts a recipe. First grabs the user id by using the login token
    //then uses the user_id to post the recipe connected to that use
    .post(jsonParser, (req, res, next) => {
        //  Grabs important data from the body
        const { loginToken, recipe_name, recipe_image_link, serving_size, total_calories, cook_time, cooking_instruction_link } = req.body;
        let  id = req.body.id;
        let user_id = '';

        //  check if an id is present (for testing purposes)
        if(id === undefined) {
            id = uuidv4();
        }

        //  Check to see if values are empty and if they are it wont do the api call
        const newRecipeInfo = {id, recipe_name, recipe_image_link, serving_size, total_calories, cook_time, cooking_instruction_link};
        for(const [key, value] of Object.entries(newRecipeInfo)) {
            if(value === undefined || value === '')
                return res.status(400).json({
                    error: {message: `Missing '${key}' value.`}
                })
        }

        //  Grabs the user id using the login token
        WTE_RecipeServices.getUserIdByLoginToken(
            req.app.get('db'),
            loginToken
        )
        
        //  uses the saved id for the api call to add a recipe
        .then(received_User_Id => {
            user_id = received_User_Id;

            newRecipeInfo.user_id = user_id[0].login_table_user_id;
            
            //  makes a call to add the recipe
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
        })

        .catch(next)
    })

recipeRouter
    .route('/getRecipe/:user_login_token')

    //  in one service, it grabs the user_id by using the login token, then 
    //grabs the recipes with that info
    .get((req, res, next) => {

        WTE_RecipeServices.getRecipeByUserId(
            req.app.get('db'),
            req.params.user_login_token
        )

        .then(recipe => {
            res.json(recipe)
        })

        .catch(next)
    })

recipeRouter
    .route('/deleteRecipe/:recipe_id')

    .delete((req, res, next) => {

        WTE_RecipeServices.deleteRecipeById(
            req.app.get('db'),
            req.params.recipe_id
        )

        .then(deleted_recipe => {
            res
                .status(204)
                .json({message: `${deleted_recipe.recipe_name} was deleted`})
                //.end()
        })

        .catch(next)
    })

module.exports = recipeRouter;

   
