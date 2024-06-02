CREATE DATABASE IF NOT EXISTS user_db;

USE user_db;

DROP TABLE IS EXISTS user_db;

CREATE TABLE
    user_account (
        user_id VARCHAR(255),
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        token VARCHAR(255),
        create_date TIMESTAMP,
        create_by VARCHAR(255),
        update_date TIMESTAMP,
        update_by VARCHAR(255),
        PRIMARY KEY (user_id),
        FOREIGN KEY (create_by) REFERENCES user_account (user_id),
        FOREIGN KEY (update_by) REFERENCES user_account (user_id)
    );