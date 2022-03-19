const { paths, queries } = require('./const');
const { getAbsolutePath } = require('./utils');
const Database = require('sqlite-async');
const fs = require('fs');

/**
 * Opens the database and provides it back to the caller
 *
 * @returns {Promise<Database>} Promise that resolves with database instance
 */
const getDb = () => {
  return Database.open(getAbsolutePath(__dirname, paths.DB_PATH));
};

/**
 * Retrieves all user records from the database
 *
 * @return {Array<Object>|boolean} Array of users, or false if no
 * records were found
 */
const getAllUsers = async () => {
  const db = await getDb();

  const result = await db.all(queries.GET_ALL_USERS_QUERY);

  db.close();

  return result;;
};

/**
 * Create a db record for the user with the provided username
 *
 * @param {String} username - The provided username
 * @return {Object|null} The user object or null if the user already
 * exists
 */
const insertUser = async username => {
  const db = await getDb();

  try {
    const result = await db.run(queries.INSERT_USER_QUERY, username);
    return { username, _id: result.lastID };
  } catch (error) {
    return null;
  }
};


module.exports = { getAllUsers, insertUser };

/*
  Everything below this line is related to DB setup.
  As the DB is already set up and ready to test, there is no need
  to run this code.
*/

/**
 * Run this function to create appropriate DB tables
 */
const createDB = async () => {
  const db = await getDb();

  const initSql = fs.readFileSync(
    getAbsolutePath(__dirname, paths.DB_SQL_PATH),
    'utf-8'
  );

  await db.exec(initSql);
  await db.close();
};

/**
 * Run this function to populate the users table with dummy data
 */
const populateUsers = async () => {
  insertUser('user1');
  insertUser('user2');
  insertUser('user3');
};
