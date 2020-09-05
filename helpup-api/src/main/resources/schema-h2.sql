CREATE TABLE user_details
(
    username    VARCHAR(60) PRIMARY KEY NOT NULL,
    firstname   VARCHAR(45),
    lastname    VARCHAR(45),
    profilepic  LONGBLOB,
    city        VARCHAR(45),
    education   VARCHAR(45),
    job         VARCHAR(45),
    gender      VARCHAR(45),
    description VARCHAR(45),
    birthday    DATE,
    phonenumber VARCHAR(45),
    user_type   VARCHAR(45)
);