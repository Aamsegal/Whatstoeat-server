const WTE_RecipeServices = {
    //  Inserts recipe into the recipe table
    insertRecipe(knex, newRecipe) {
        return knex
            .insert(newRecipe)
            .into('whats_to_eat_recipe_table')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    //  Grabs the recipe by user id
    //will make a requets to the WTE_login_table with the generated key and if
    //they match it will return the user_id that is then used to grab the recipes
    getRecipeByUserId(knex, userLoginToken) {
        return knex
            .select('*')
            .from('whats_to_eat_recipe_table')
            .where(
                "user_id",
                knex
                    .select('login_table_user_id')
                    .from('whats_to_eat_login_table')
                    .where("id", userLoginToken)
            )
                
    },

    //  deletes a recipe
    deleteRecipeById(knex, id) {
        return knex('whats_to_eat_recipe_table')
            .where({id})
            .delete()
    },

    //  Grabs the user id from the login token for creating recipeInfo
    getUserIdByLoginToken(knex, loginToken) {
        return knex
            .from('whats_to_eat_login_table')
            .select('login_table_user_id')
            .where('id', loginToken)
    },

}

module.exports = WTE_RecipeServices;