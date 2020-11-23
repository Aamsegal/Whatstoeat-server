CREATE TABLE whats_to_eat_ingredients_table (
    id TEXT PRIMARY KEY,
    ingredient TEXT NOT NULL,
    recipe_id TEXT REFERENCES whats_to_eat_recipe_table(id) on DELETE CASCADE NOT NULL
)