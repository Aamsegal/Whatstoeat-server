# Server Details

`Name:` What's to eat server and database

`Application Link:` [What's to Eat!](https://whats-to-eat.vercel.app/application)

`Description:` This server stores the info of the users as well as their saved recipes. Someone can create an account and search through recipes, save, delete and look at any recipes that find interesting.

`Technologies:` Javascript, Express, CORS, PG

# Endpoints

There are 4 endpoints. Allergies, Ingredients, Recipe, Users


## Allergies/Ingredient Endpoint

These two endpoint have **POST** and **GET** requests. When a recipe is saved. It will go through all of the ingredients/allergies and add them to the respective database and connects them to the saved recipe. No **Delete** required since the Ingredients/Allergies will delete with the recipe.

## Recipe Endpoint

This endpoint has **POST**, **GET** and **DELETE** requests. When the user saved a recipe, it gathers all of the required info and saved it to the recipe database and at the same time takes the id of that recipe in the database and adds Ingredient/Allergy data in their respective database. **POST** and **GET** use a login token to grab the user id and then use that user id to make their requests keeping access to the user id and other important information server side so it is never sent over the internet. **DELETE** uses the id of the recipe to remove it from the database.

**Required request body values**
    (recipe name, recipe image, serving size, calories, cook time, instructions)

## Users Endpoint

This endpoint has **POST** and **GET**. While on the front end there is code in place to prevent too long/short inputs, the backend also will prevent certain data from being the same such as username and email. **POST** takes in the user information and creates a new user, then creates a login token on the login token table connected to that user. After creating an account. The front end makes a **GET** request with the username and password, returning the login token and storing it as a cookie. With that login token, the other request for Recipe Endpoint can be made.