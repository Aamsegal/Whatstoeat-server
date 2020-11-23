CREATE TABLE whats_to_eat_allergy_table (
    id TEXT PRIMARY KEY,
    allergy_info TEXT NOT NULL,
    recipe_id TEXT REFERENCES whats_to_eat_recipe_table(id) on DELETE CASCADE NOT NULL
)