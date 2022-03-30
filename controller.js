const dbAdapter = require('./database-adapter');
const { parseValue } = require('./utils');

/**
 * Fetches all users
 *
 * @return {Array<Object>} Array of found users
 */
const getAllUsers = async () => {
  return await dbAdapter.getAllUsers();
};

/**
 * Creates a new user with the provided username
 *
 * @param {String} username - The provided username
 * @return {Object} The user object
 */
const insertUser = async (username) => {
  if (username) {
    return await dbAdapter.insertUser(username);
  } else {
    throw { code: 400, message: 'Username not provided'};
  }
};


/**
 * Inserts a new exercise record into the database
 * 
 * @param {Number} userId - The id of the user for which the exercise is added
 * @param {Object} body - Request body that was sent to the server
 * @param {String} body.description - Text containing the description of the exercise
 * @param {Number} body.duration - The duration of the exercise, in minutes
 * @param {String} body.date - A string representation of the date of the exercise
 * @return {Object} User object with the exercise fields added
 */
const insertExercise = async (userId, body) => {
  const { description, duration, date } = body;

  if (!description || !duration) {
    throw { code: 400, message: 'Please provide exercise description and duration' };
  }

  if (typeof duration !== 'number') {
    throw { code: 400, message: `Exercise duration should be a whole number. You provided ${duration}` };
  }

  if (typeof date !== 'string') {
    throw { code: 400, message: 'Date should be a string in YYYY-MM-DD (ISO) format' };
  }

  const creationDate = date ? Date.parse(date) : Date.now();

  if(isNaN(creationDate)) {
    throw { code: 400, message: 'Please provide a valid date in YYYY-MM-DD (ISO) format' };
  } else {
    const dateString = new Date(creationDate).toISOString().split('T')[0];
    return await dbAdapter.insertExercise(userId, description, duration, dateString);
  }
};

/**
 * Gets user info including exercises
 * 
 * @param {Number} userId - Id of the user whose logs should be retrieved
 * @param {Object} queryParams - Query parameters sent to filter the logs
 * @param {String} queryParams.from - String representation of date from which to retrieve exercises
 * @param {String} queryParams.to - String representation of date up to which to retrieve exercises
 * @param {String} queryParams.limit - Upper limit to how many records to retrieve
 * @return {Object} User object with logs array containing their exercises
 */
const getUserLogs = async (userId, queryParams) => {
  const { from, to, limit } = queryParams;
  let fromDate;
  let toDate;
  let recordLimit;

    if (from) {
      const fromDateInMillis = parseValue(
        from,
        Date.parse,
        `The parameter 'from' must be provided in the format YYYY-MM-DD. You provided '${from}'`
      );
      fromDate = new Date(fromDateInMillis).toISOString();
    }
    
    if (to) {
      const toDateInMillis = parseValue(
        to,
        Date.parse,
        `The parameter 'to' must be provided in the format YYYY-MM-DD. You provided '${to}'`
      );
      toDate = new Date(toDateInMillis).toISOString();
    }
    
    if (limit) {
      recordLimit = parseValue(
        limit,
        (value) => parseInt(value, 10),
        `The parameter 'limit' must be a whole number. You provided '${limit}'`
      );
    }
  
    if (fromDate && toDate && fromDate > toDate) {
      throw { code: 400, message: `'from' must be a date before 'to'!` };
    }

    return await dbAdapter.getUserLogs(userId, fromDate, toDate, recordLimit);
};

module.exports = {
    getAllUsers,
    insertUser,
    insertExercise,
    getUserLogs
};
