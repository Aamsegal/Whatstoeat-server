const WTE_ingredientServices = {
    //  Inserts an ingredient to the table with a recipe id
    insertIngredient(knex, newIngredient) {
        return knex
            .insert(newIngredient)
            .into('whats_to_eat_ingredients_table')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    //  Grabs all ingredients for the recipe
    getIngredientByRecipeId(knex, recipeId) {
        return knex
            .select('ingredient')
            .from('whats_to_eat_ingredients_table')
            .where('recipe_id', recipeId)
    },
}

module.exports = WTE_ingredientServices;