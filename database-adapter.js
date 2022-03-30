const { paths } = require('./const');
const userAdapter = require('./database-adapter/user');
const exerciseAdapter = require('./database-adapter/exercise');
const Database = require('sqlite-async');
const fs = require('fs');
const { join } = require('path');

/**
 * Opens the database and provides it back to the caller
 *
 * @return {Promise<Database>} Promise that resolves with database instance
 */
const getDb = () => {
  return Database.open(join(__dirname, paths.DB_PATH));
};

/**
 * Retrieves all user records from the database
 *
 * @return {Array<Object>} Array of found users
 */
const getAllUsers = async () => {
  const db = await getDb();

  return await userAdapter.getAll(db);
};

/**
 * Create a db record for the user with the provided username
 *
 * @param {String} username - The provided username
 * @return {Object} The user object
 */
const insertUser = async (username) => {
  const db = await getDb();

  return await userAdapter.insert(db, username);
};

/**
 * Retrieves the user with the provided id from the database
 * 
 * @param {Number} userId - The user's id
 * @return {Object} The user object
 */
const getUserById = async (userId) => {
  const db = await getDb();

  return await userAdapter.getById(db, userId);
};

/**
 * Inserts a new exercise record into the database
 * 
 * @param {Number} userId - The id of the user for which the exercise is added
 * @param {String} description - Text containing the description of the exercise
 * @param {Number} duration - The duration of the exercise, in minutes
 * @param {String} date - A string representation of the date of the exercise
 * @return {Object} User object with the exercise fields added
 */
const insertExercise = async (userId, description, duration, date) => {
  const db = await getDb();

  const user = await getUserById(userId);

  return await exerciseAdapter.insert(db, user, description, duration, date);
};

/**
 * Gets user info including exercises
 * 
 * @param {Number} userId - Id of the user whose logs should be rertrieved
 * @return {Object} User object with logs array containing their exercises
 */
const getUserLogs = async (userId, ...params) => {
  try {
    const user = await getUserById(userId);
    const logs = await getExercisesForUser(userId, ...params);
    const count = await getExerciseCountForUser(userId, ...params);
    return { _id: userId, username: user.username, logs, count };
  } catch (error) {
    throw error;
  }
};

/**
 * Gets all exercises for a certain user
 * 
 * @param {Number} userId - Id of the user whose exercises should be fetched
 * @param {String} from - String representation of date from which to retrieve
 * exercises
 * @param {String} to - String representation of date up to which to retrieve
 * exercises
 * @param {Number} limit - Upper limit to how many records to retrieve
 * @return {Array<Object>} Array of exercises for provided user
 */
const getExercisesForUser = async (userId, from, to, limit) => {
  const db = await getDb();
  return await exerciseAdapter.getAll(db, userId, from, to, limit);
};

/**
 * Gets the total number of exercises for a given user
 * 
 * @param {Number} userId - Id of the user whose exercises should be fetched
 * @param {String} from - String representation of date from which to calculate
 * @param {String} to - String representation of date up to which to calculate
 * @return {Number} Total number of exerecises for the given user
 */
 const getExerciseCountForUser = async (userId, from, to) => {
  const db = await getDb();
  return await exerciseAdapter.getCount(db, userId, from, to);
};


module.exports = { 
  getAllUsers,
  insertUser,
  insertExercise,
  getUserLogs
};

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
 * Run this function to populate the user table with dummy data
 */
const populateUsers = async () => {
  await insertUser('user1');
  await insertUser('user2');
  await insertUser('user3');
};

/**
 * Run this function to populate the exercise table with dummy data
 */
 const populateExercises = async () => {
  await insertExercise(1, 'Shoulder press', 10, '2022-03-13');
  await insertExercise(1, 'Leg press', 20, '2022-02-11');
  await insertExercise(1, 'Pushups', 13, '2022-02-22');

  await insertExercise(2, 'Running', 45, '2021-12-23');
  await insertExercise(2, 'Pushups', 10, '2020-09-25');

  await insertExercise(3, 'Pullups', 25, '2022-03-20');
};
