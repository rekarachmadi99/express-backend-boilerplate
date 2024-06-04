CREATE DATABASE IF NOT EXISTS user_db;

USE user_db;

DROP TABLE IF EXISTS user_account;

DROP TABLE IF EXISTS user;

CREATE TABLE
    user (
        userId VARCHAR(255) NOT NULL PRIMARY KEY,
        firstName VARCHAR(255) NOT NULL,
        middleName VARCHAR(255),
        lastName VARCHAR(255),
        fullName VARCHAR(255) NOT NULL,
        initialName VARCHAR(255) NOT NULL,
        nationality VARCHAR(255),
        salutation VARCHAR(255),
        educationTitle1 VARCHAR(255),
        educationTitle2 VARCHAR(255),
        idNumber VARCHAR(255) NOT NULL,
        birthPlace TEXT,
        birthDate DATE NOT NULL,
        gender VARCHAR(255),
        religion VARCHAR(255) NOT NULL,
        race VARCHAR(255),
        dialect TEXT,
        maritalStatus VARCHAR(255) NOT NULL,
        taxRegisteredName VARCHAR(255),
        taxFileNumber VARCHAR(255),
        userPhoto VARCHAR(255),
        createdBy VARCHAR(255),
        createdAt TIMESTAMP,
        updatedBy VARCHAR(255),
        updatedAt TIMESTAMP
    );

CREATE TABLE
    user_account (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        userId VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        username VARCHAR(255),
        password VARCHAR(255),
        accountType VARCHAR(255),
        refreshToken VARCHAR(255),
        createdBy VARCHAR(255),
        createdAt TIMESTAMP,
        updatedBy VARCHAR(255),
        updatedAt TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES user (userId)
    );

INSERT INTO
    user (
        userId,
        firstName,
        lastName,
        fullName,
        initialName,
        idNumber,
        birthDate,
        religion,
        maritalStatus,
        createdAt,
        updatedAt
    )
VALUES
    (
        'user1',
        'John',
        'Doe',
        'John Doe',
        'JD',
        '123456789',
        '1990-05-15',
        'Christian',
        'Single',
        NOW (),
        NOW ()
    ),
    (
        'user2',
        'Jane',
        'Smith',
        'Jane Smith',
        'JS',
        '987654321',
        '1992-08-20',
        'Muslim',
        'Married',
        NOW (),
        NOW ()
    ),
    (
        'user3',
        'Alice',
        'Johnson',
        'Alice Johnson',
        'AJ',
        '456789123',
        '1985-02-10',
        'Jewish',
        'Divorced',
        NOW (),
        NOW ()
    );

INSERT INTO
    user_account (
        userId,
        email,
        username,
        password,
        accountType,
        refreshToken,
        createdAt,
        updatedAt
    )
VALUES
    (
        'user1',
        'john@example.com',
        'john_doe',
        'password123',
        'regular',
        'refreshToken1',
        NOW (),
        NOW ()
    ),
    (
        'user2',
        'jane@example.com',
        'jane_smith',
        'abc123',
        'premium',
        'refreshToken2',
        NOW (),
        NOW ()
    ),
    (
        'user3',
        'alice@example.com',
        'alice_j',
        'password456',
        'regular',
        'refreshToken3',
        NOW (),
        NOW ()
    );