CREATE TABLE products(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    image VARCHAR(100) NOT NULL,
    price INT NOT NULL,
    stock INT NOT NULL,
    description VARCHAR(100) NOT NULL
);