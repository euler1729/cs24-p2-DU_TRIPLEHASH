DROP TABLE IF EXISTS user;
CREATE TABLE user(
    user_id INTEGER PRIMARY KEY,
    user_name TEXT,
    email TEXT,
    password TEXT,
    role_id INTEGER
    name TEXT,
    age INTEGER,
);

DROP TABLE IF EXISTS role;
CREATE TABLE role(
    role_id INTEGER PRIMARY KEY,
    role_name TEXT 
);

DROP TABLE IF EXISTS otp;
CREATE TABLE otp(
    user_id INTEGER,
    otp TEXT,
    exp INTEGER
);
