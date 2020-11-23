CREATE TABLE whats_to_eat_recipe_table (
    id TEXT PRIMARY KEY,
    recipe_name TEXT NOT NULL,
    recipe_image_link TEXT NOT NULL,
    serving_size INTEGER NOT NULL,
    total_calories INTEGER NOT NULL,
    cook_time INTEGER NOT NULL,
    cooking_instrunction_link TEXT NOT NULL,
    user_id TEXT REFERENCES whats_to_eat_user_table ON DELETE CASCADE NOT NULL
)