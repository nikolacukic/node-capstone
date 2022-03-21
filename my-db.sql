PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS User (
    _id INTEGER PRIMARY KEY,
    username VARCHAR(40) UNIQUE
);

CREATE TABLE IF NOT EXISTS Exercise (
    id INTEGER PRIMARY KEY,
    description VARCHAR(100),
    duration INTEGER,
    date VARCHAR(15),
    user INTEGER,

    FOREIGN KEY (user) REFERENCES User(_id)
);
	