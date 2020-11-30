CREATE TABLE whats_to_eat_login_table (
    id TEXT PRIMARY KEY,
    login_table_user_id TEXT REFERENCES whats_to_eat_user_table ON DELETE CASCADE
)