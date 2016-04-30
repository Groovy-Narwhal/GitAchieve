DROP TABLE IF EXISTS users;

CREATE TABLE users (
    userid serial PRIMARY KEY,
    username varchar(100) NOT NULL DEFAULT 'default',
    email varchar(100) NOT NULL
);
