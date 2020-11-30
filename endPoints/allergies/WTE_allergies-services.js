const WTE_allergyServices = {
    //  Inserts an ingredient to the table with a recipe id
    insertAllergy(knex, newAllergy) {
        return knex
            .insert(newAllergy)
            .into('whats_to_eat_allergy_table')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    //  Grabs all ingredients for the recipe
    getAllergyByRecipeId(knex, recipeId) {
        return knex
            .select('allergy_info')
            .from('whats_to_eat_allergy_table')
            .where('recipe_id', recipeId)
    },
}

module.exports = WTE_allergyServices;