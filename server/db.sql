CREATE DATABASE movielist;

-- Create Users - part 1
-- CREATE TABLE users(
--     user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
--     user_name VARCHAR(255) NOT NULL,
--     user_email VARCHAR(255) NOT NULL,
--     user_password VARCHAR(255) NOT NULL
-- );

-- Craete Users - part 2
CREATE TABLE users(
    user_id uuid DEFAULT uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    roles jsonb,
    PRIMARY KEY (user_id)
);
-- If you get error because of the uuid failure, add the extension below.
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Movie - part 1
-- CREATE TABLE movies(
--     movie_id SERIAL PRIMARY KEY,
--     movie_name VARCHAR(255),
--     movie_description VARCHAR(255),
--     movie_rating INT,
--     user_id uuid NOT NULL
-- );

-- Create Movie part 2
CREATE TABLE movies(
    movie_id SERIAL,
    user_id uuid,
    movie_name VARCHAR(255),
    movie_description VARCHAR(255),
    movie_rating INT,
    movie_year INT,
    imageurl  VARCHAR(255),
   PRIMARY KEY(movie_id),
   FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- User add
INSERT INTO users(user_name, user_email, user_password, roles) VALUES ('ThangZaThang', 'thangzathang@gmail.com', 'thang123', '{"Admin": 5150,"Creator": 1994,"User": 2001}');

INSERT INTO users(user_name, user_email, user_password, roles) VALUES ('Sam', 'sam@gmail.com', 'sam123', '{"Admin": 5150,"Creator": 1994,"User": 2001}');

-- Give User permission
UPDATE users SET roles = '{"Admin": 5150,"Creator": 1994,"User": 2001}' WHERE user_email = 'sam@gmail.com';

-- User Fake movies
INSERT INTO movies(user_id, movie_name,movie_description, movie_rating) 
VALUES ('5aaf4263-f7f0-488b-a49b-04c81c9282ca', 'Avatar 2', 'Sequel to Avatar 1', 10);

INSERT INTO movies(user_id, movie_name,movie_description, movie_rating) 
VALUES ('5aaf4263-f7f0-488b-a49b-04c81c9282ca', 'Puss in Booths 2', 'Sequel to Puss In Boots 1', 10);

-- Adding New Columns to the movie table in the database movieList
-- ALTER TABLE movies
-- ADD COLUMN movie_year INT;

-- ALTER TABLE movies
-- ADD COLUMN imageUrl VARCHAR(255);