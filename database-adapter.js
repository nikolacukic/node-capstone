const { paths, queries, filters } = require('./const');
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

  const result = await db.all(queries.GET_ALL_USERS_QUERY);

  db.close();

  return result;
};

/**
 * Create a db record for the user with the provided username
 *
 * @param {String} username - The provided username
 * @return {Object|null} The user object or null if the user already
 * exists
 */
const insertUser = async (username) => {
  const db = await getDb();

  try {
    const result = await db.run(queries.INSERT_USER_QUERY, username);
    db.close();
    return { username, _id: result.lastID };
  } catch (error) {
    db.close();
    return null;
  }
};

/**
 * Retrieves the user with the provided id from the database
 * 
 * @param {Number} userId - The user's id
 * @return {Object|null} The user object, or null if no
 * records were found with the provided id
 */
const getUserById = async (userId) => {
  const db = await getDb();

  try {
    const user = await db.get(queries.GET_USER_BY_ID_QUERY, userId);
    db.close();
    return user;
  } catch (error) {
    db.close();
    return null;
  }
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

  if (user) {
    try {
      const result = await db.run(queries.INSERT_EXERCISE_QUERY, [description, duration, date, userId]);
      db.close();
      if (result.lastID) {
        return { 
          _id: userId,
          username: user.username,
          description,
          duration,
          date 
        };
      }
    } catch (error) {
      db.close();
      throw error;
    }
  } else {
    db.close();
    throw { error: 'The user with the provided id does not exist!' };
  }
};

/**
 * Gets user info including exercises
 * 
 * @param {Number} userId - Id of the user whose logs should be rertrieved
 * @return {Object} User object with logs array containing their exercises
 */
const getUserLogs = async (userId, ...params) => {
  const user = await getUserById(userId);

  if (user) {
    try {
      const logs = await getExercisesForUser(userId, ...params);
      const count = await getExerciseCountForUser(userId, ...params);
      return { _id: userId, username: user.username, logs, count };
    } catch (error) {
      throw error;
    }
  } else {
    throw { error: 'The user with the provided id does not exist!' };
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

  let query = queries.GET_EXERCISES_BY_USER_ID_QUERY;

  query = from ? query.concat(filters.FILTER_FROM) : query;
  query = to ? query.concat(filters.FILTER_TO) : query;
  query = limit ? query.concat(filters.FILTER_LIMIT) : query;

  try {
    const logs = await db.all(query, {
      $userId: userId,
      $from: from,
      $to: to,
      $limit: limit
    });
    db.close();
    return logs;
  } catch (error) {
    db.close();
    throw error;
  }
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

  let query = queries.GET_TOTAL_USER_EXERCISE_COUNT_QUERY;

  query = from ? query.concat(filters.FILTER_FROM) : query;
  query = to ? query.concat(filters.FILTER_TO) : query;

  try {
    const result = await db.get(query, {
      $userId: userId,
      $from: from,
      $to: to
    });
    db.close();
    return result.count;
  } catch (error) {
    db.close();
    throw error;
  }
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
