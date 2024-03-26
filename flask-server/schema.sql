DROP TABLE IF EXISTS user;
CREATE TABLE user(
    user_id INTEGER PRIMARY KEY,
    user_name TEXT,
    email TEXT,
    password TEXT,
    role_id INTEGER
);

DROP TABLE IF EXISTS role;
CREATE TABLE role(
    role_id INTEGER PRIMARY KEY,
    role_name TEXT 
);
