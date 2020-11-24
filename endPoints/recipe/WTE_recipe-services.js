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
    getRecipeByUserId(knex, user_id) {
        return knex.select('*').from('whats_to_eat_recipe_table').where('user_id', user_id)
    },

    //  deletes a recipe
    deleteRecipeById(knex, id) {
        return knex('whats_to_eat_recipe_table')
            .where({id})
            .delete()
    }

}

module.exports = WTE_RecipeServices;