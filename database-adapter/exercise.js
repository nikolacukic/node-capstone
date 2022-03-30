const { queries, filters } = require('../const');

/**
 * Inserts a new exercise record into the database
 * 
 * @param {Database} dbInstance - Instance of the database
 * @param {Number} userId - The id of the user for which the exercise is added
 * @param {String} description - Text containing the description of the exercise
 * @param {Number} duration - The duration of the exercise, in minutes
 * @param {String} date - A string representation of the date of the exercise
 * @return {Object} User object with the exercise fields added
 */
const insert = async (dbInstance, user, description, duration, date) => {
    try {  
      const result = await dbInstance.run(queries.INSERT_EXERCISE_QUERY, [description, duration, date, user._id]);
      dbInstance.close();
      if (result.lastID) {
        return { 
          _id: user._id,
          username: user.username,
          description,
          duration,
          date 
        };
      }
    } catch (error) {
      dbInstance.close();
      throw error;
    }
};

/**
 * Gets all exercises for a certain user
 * 
 * @param {Database} dbInstance - Instance of the database
 * @param {Number} userId - Id of the user whose exercises should be fetched
 * @param {String} from - String representation of date from which to retrieve
 * exercises
 * @param {String} to - String representation of date up to which to retrieve
 * exercises
 * @param {Number} limit - Upper limit to how many records to retrieve
 * @return {Array<Object>} Array of exercises for provided user
 */
const getAll= async (dbInstance, userId, from, to, limit) => {
  let query = queries.GET_EXERCISES_BY_USER_ID_QUERY;

  query = from ? query.concat(filters.FILTER_FROM) : query;
  query = to ? query.concat(filters.FILTER_TO) : query;
  query = limit ? query.concat(filters.FILTER_LIMIT) : query;

  try {
    const logs = await dbInstance.all(query, {
      $userId: userId,
      $from: from,
      $to: to,
      $limit: limit
    });
    dbInstance.close();
    return logs;
  } catch (error) {
    dbInstance.close();
    throw error;
  }
};

/**
 * Gets the total number of exercises for a given user
 * 
 * @param {Database} dbInstance - Instance of the database
 * @param {Number} userId - Id of the user whose exercises should be fetched
 * @param {String} from - String representation of date from which to calculate
 * @param {String} to - String representation of date up to which to calculate
 * @return {Number} Total number of exerecises for the given user
 */
const getCount = async (dbInstance, userId, from, to) => {
  let query = queries.GET_TOTAL_USER_EXERCISE_COUNT_QUERY;

  query = from ? query.concat(filters.FILTER_FROM) : query;
  query = to ? query.concat(filters.FILTER_TO) : query;

  try {
    const result = await dbInstance.get(query, {
      $userId: userId,
      $from: from,
      $to: to
    });
    dbInstance.close();
    return result.count;
  } catch (error) {
    dbInstance.close();
    throw error;
  }
};

module.exports = {
  insert,
  getAll,
  getCount
};
  