const { expect } = require('chai');
const { json } = require('express');
const knex = require('knex');
const supertest = require('supertest');
const { v4: uuidv4 } = require('uuid');

const app = require('../src/app');

describe('Full process of creating account, adding recipes and their extra info, then deleting the information', function() {

    before('make knex instance', () => {
        let db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })

        app.set('db', db)
    })

    //  Information for user router testing
    let generatedId = uuidv4();

    const testUser = {
        id: generatedId,
        account_name: "Test Account", 
        username: "TestAccount1234", 
        user_password: "TestAccountPassword", 
        user_email: "TestAccount1234@gmail.com"
    }

    let testUserLoginToken = '';

    let generatedId2 = uuidv4();
    const testUser2 ={
        id: generatedId2,
        account_name: "Test Account 2", 
        username: "SecondTestAccount1234", 
        user_password: "SecondTestAccountPassword", 
        user_email: "SecondTestAccount1234@gmail.com"
    }

    let testUser2LoginToken = '';

    //  Information for recipe router testing

    let generatedRecipeId1 = uuidv4();
    let generatedRecipeId2 = uuidv4();
    let generatedRecipeId3 = uuidv4();

    const testRecipe1 = {
        id: generatedRecipeId1,
        recipe_name: "Test Chocolate Cake", 
        recipe_image_link: "Test Chocolate Cake image link", 
        serving_size: 1, 
        total_calories: 30000,
        cook_time: "200 Years",
        cooking_instruction_link: "200YearChocolateCake",
        loginToken: ''
    }

    const testRecipe2 = {
        id: generatedRecipeId2,
        recipe_name: "Test Cheese Cake", 
        recipe_image_link: "Test Cheese Cake image link", 
        serving_size: 24, 
        total_calories: 4,
        cook_time: "3 Seconds",
        cooking_instruction_link: "Supersmallcheesecakelink",
        loginToken: ''
    }

    
    const testRecipe3 = {
        id: generatedRecipeId3,
        recipe_name: "Test Apple Pie", 
        recipe_image_link: "Test Apple Pie image link", 
        serving_size: 10, 
        total_calories: 4000,
        cook_time: "90 Minutes",
        cooking_instruction_link: "BubbiesApplePieRecipeLink",
        loginToken: ''
    }

    //NoToken testRecipes are used as reference for the response
    const testRecipe1NoToken = {
        id: generatedRecipeId1,
        recipe_name: "Test Chocolate Cake", 
        recipe_image_link: "Test Chocolate Cake image link", 
        serving_size: 1, 
        total_calories: 30000,
        cook_time: "200 Years",
        cooking_instruction_link: "200YearChocolateCake",
    }

    const testRecipe2NoToken = {
        id: generatedRecipeId2,
        recipe_name: "Test Cheese Cake", 
        recipe_image_link: "Test Cheese Cake image link", 
        serving_size: 24, 
        total_calories: 4,
        cook_time: "3 Seconds",
        cooking_instruction_link: "Supersmallcheesecakelink",
    }

    const testRecipe3NoToken = {
        id: generatedRecipeId3,
        recipe_name: "Test Apple Pie", 
        recipe_image_link: "Test Apple Pie image link", 
        serving_size: 10, 
        total_calories: 4000,
        cook_time: "90 Minutes",
        cooking_instruction_link: "BubbiesApplePieRecipeLink",
    }

    //  Testing USer endpoint____________________________________________
    context('1.0 Testing /api/userEndpoint .Post and .Get', () => { 

        it('1.1 (POST) /api/userEndpoint responds with 201 and the user was created', () => {
            return supertest(app)
                .post('/api/userEndpoint')
                .send(testUser)
                .expect(201)
        })

        it('1.1.1 Adding another account for testing purpose later in the suite', () => {
            return supertest(app)
                .post('/api/userEndpoint')
                .send(testUser2)
                .expect(201)
        })

        it('1.2 (GET) /api/userEndpoint/:username/:user_password responds with 200. This is used to grab the users loginToken.', () => {
            return supertest(app)
                .get(`/api/userEndpoint/${testUser.username}/${testUser.user_password}`)
                .expect(200)
                .then(res => {
                    return JSON.parse(res.text);
                })
                .then(data => {
                    testRecipe1.loginToken = data[0].id;
                    testRecipe2.loginToken = data[0].id;
                })
        })

        it('1.2 (GET) /api/userEndpoint/:username/:user_password responds with 200. This is used to grab the second users loginToken.', () => {
            return supertest(app)
                .get(`/api/userEndpoint/${testUser2.username}/${testUser2.user_password}`)
                .expect(200)
                .then(res => {
                    return JSON.parse(res.text);
                })
                .then(data => {
                    testRecipe3.loginToken = data[0].id;
                })
        })

    })
    
    //  Testing Recipe endpoint____________________________________________
    context('2.0 Testing /api/recipeEndpoint .Post and .Get', () => {

        it('2.1. (POST) /api/recipeEndpoint/ with 201 and created the recipe', () => {
            return supertest(app)
                .post('/api/recipeEndpoint')
                .send(testRecipe1)
                .expect(201)
                //  Even though serving_size and total_calories are stored as INT in the database
                //they are returned as strings because json doesn't know data types.
        })

        //console.log(testRecipe1)

        it('2.1.1 Adding extra recipe for later testing purposes', () => {
            return supertest(app)
                .post('/api/recipeEndpoint')
                .send(testRecipe2)
                .expect(201)
        })

        it('2.1.2 Adding extra recipe for later testing purposes', () => {
            return supertest(app)
                .post('/api/recipeEndpoint')
                .send(testRecipe3)
                .expect(201)
        })


        it(`2.2 (GET) /api/recipeEndpoint/:user_id. Grabs recipes for user 1`, () => {
            return supertest(app)
                .get(`/api/recipeEndpoint/getRecipe/${testRecipe1.loginToken}`)
                .expect(200, [testRecipe1NoToken, testRecipe2NoToken])
        })

        it(`2.2.1 Grabs the single recipe for the other user`, () => {
            return supertest(app)
                .get(`/api/recipeEndpoint/getRecipe/${testRecipe3.loginToken}`)
                .expect(200, [testRecipe3NoToken])
        })

    })

    //  Testing Ingredient endpoint____________________________________________
    context('3.0 Testing /api/ingredientEndpoint. This endpoint has a POST and GET', ()=> {
        it('3.1 (POST) /api/ingredientEndpoint.', () => {
            return supertest(app)
                .post('/api/ingredientEndpoint')
                .send({ingredient: "Flour", recipe_id: generatedRecipeId1})
                .expect(201, {ingredient: 'Flour'})
        })

        it('3.1.1 (POST) Adding extra ingredient for testing purposes', () => {
            return supertest(app)
                .post('/api/ingredientEndpoint')
                .send({ingredient: "Sugar", recipe_id: generatedRecipeId1})
                .expect(201, {ingredient: 'Sugar'})
        })

        it('3.2 (GET) /api/ingredientEndpoint/recipe/:recipe_id. Grabs the ingredients from the recipe', () => {
            return supertest(app)
                .get(`/api/ingredientEndpoint/recipe/${generatedRecipeId1}`)
                .expect(200, [
                    {"ingredient": "Flour"},
                    {"ingredient": "Sugar"}
                ])
        })
    })

    //  Testing Allergy endpoint____________________________________________
    context('4.0 Testing /api/allergyEndpoint. This endpoint has a POST and GET', ()=> {
        it('4.1 (POST) /api/allergyEndpoint.', () => {
            return supertest(app)
                .post('/api/allergyEndpoint')
                .send({allergy_info: "Gluten", recipe_id: generatedRecipeId1})
                .expect(201, {allergy_info: 'Gluten'})
        })

        it('4.1.1 (POST) Adding extra ingredient for testing purposes', () => {
            return supertest(app)
                .post('/api/allergyEndpoint')
                .send({allergy_info: "Milk", recipe_id: generatedRecipeId1})
                .expect(201, {allergy_info: 'Milk'})
        })

        it('4.2 (GET) /api/ingredientEndpoint/recipe/:recipe_id. Grabs the ingredients from the recipe', () => {
            return supertest(app)
                .get(`/api/allergyEndpoint/recipe/${generatedRecipeId1}`)
                .expect(200, [
                    {"allergy_info": "Gluten"},
                    {"allergy_info": "Milk"}
                ])
        })
    })
    
    //  Testing Recipe DELETE endpoint____________________________________________
    context('5.0 Testing /api/recipeEndpoint .Delete, then trying to make a get request expecting an error', () => {
        it('5.1 (DELETE) /api/recipeEndpoint/deleteRecipe/:recipe_id', () => {
            return supertest(app)
                .delete(`/api/recipeEndpoint/deleteRecipe/${testRecipe1.id}`)
                .expect(204)
        }) 

        it('5.1.1 (GET) With this get request from User1, we should only get back 1 recipe', () => {
            return supertest(app)
                .get(`/api/recipeEndpoint/getRecipe/${testRecipe1.loginToken}`)
                .expect(200, [testRecipe2NoToken])
        })
    })
    
    //  Cleaning the database for future tests____________________________________________
    context('6.0 Testing /api/userEndpoint .Delete', () => {

        it('6.1 (DELETE) /api/userEndpoint/:id/:username/:user_password responds with 204 and is deleted', () => {
            return supertest(app)
                .delete(`/api/userEndpoint/${testUser.id}/${testUser.username}/${testUser.user_password}`)
                .expect(204)
        })

        it('6.2 (DELETE) deleting second account made for testing purposed', () => {
            return supertest(app)
                .delete(`/api/userEndpoint/${testUser2.id}/${testUser2.username}/${testUser2.user_password}`)
                .expect(204)
        })
    })

})