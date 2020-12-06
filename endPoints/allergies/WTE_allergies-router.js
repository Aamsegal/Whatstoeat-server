const path = require('path');
const express = require('express');
const xss = require('xss');
const WTE_AllergyServices = require('./WTE_allergies-services');
const { v4: uuidv4 } = require('uuid');
const { serialize } = require('v8');

const allergyRouter = express.Router();
const jsonParser = express.json();

const serializedAllergy = ingredientInfo => ({
    id: xss(ingredientInfo.id),
    allergy_info: xss(ingredientInfo.allergy_info),
    recipe_id: xss(ingredientInfo.recipe_id)
})

allergyRouter
    .route('/')

    // Posts an allergy
    .post(jsonParser, (req, res, next) => {
        //  Grabs allergy info
        const { allergy_info, recipe_id } = req.body;
        let id = req.body.id;

        if(id === undefined) {
            id = uuidv4();
        }

        //  Checks values of the request body
        const newAllergyInfo = { id, allergy_info, recipe_id };
        for(const [key, value] of Object.entries(newAllergyInfo)) {
            if(value === undefined || value === '') {
                return res.status(400).json({
                    error: {message: `Missing '${key}' value.`}
                })
            }
        }

        //  Posts the allergy info
        WTE_AllergyServices.insertAllergy(
            req.app.get('db'),
            newAllergyInfo
        )

        .then(allergy => {
            res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${allergy.id}`))
                .json({allergy_info: allergy.allergy_info})
        })

        .catch(next)
    })

allergyRouter
    .route('/recipe/:recipe_id')

    //  grabs all allergies from the recipe
    .get((req, res, next) => {

        WTE_AllergyServices.getAllergyByRecipeId(
            req.app.get('db'),
            req.params.recipe_id
        )

        .then(allergies => {
            res.json(allergies)
        })

        .catch(next)
    })

module.exports = allergyRouter;
