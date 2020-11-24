CREATE TABLE whats_to_eat_user_table (
    id TEXT PRIMARY KEY,
    account_name TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    user_password TEXT NOT NULL,
    user_email TEXT NOT NULL UNIQUE
)