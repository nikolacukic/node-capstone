const { queries } = require('../const');

/**
 * Retrieves all user records from the database
 *
 * @param {Database} dbInstance - Instance of the database
 * @return {Array<Object>} Array of found users
 */
const getAll = async (dbInstance) => {
  const result = await dbInstance.all(queries.GET_ALL_USERS_QUERY);

  dbInstance.close();

  return result;
};
  
/**
 * Create a db record for the user with the provided username
 * 
 * @param {Database} dbInstance - Instance of the database
 * @param {String} username - The provided username
 * @return {Object} The user object
 */
const insert = async (dbInstance, username) => {
  try {
    const result = await dbInstance.run(queries.INSERT_USER_QUERY, username);
    dbInstance.close();
    return { username, _id: result.lastID };
  } catch (error) {
    dbInstance.close();
    throw { code: 400, message: `User with the username ${username} already exists!` };
  }
};

/**
 * Retrieves the user with the provided id from the database
 * 
 * @param {Database} dbInstance - Instance of the database
 * @param {Number} userId - The user's id
 * @return {Object} The user object
 */
const getById = async (dbInstance, userId) => {
  const user = await dbInstance.get(queries.GET_USER_BY_ID_QUERY, userId);

  if (!user) {
    throw { code: 404, message: 'The user with the provided id does not exist!' };
  }

  dbInstance.close();
  return user;
};

module.exports = {
  getAll,
  insert,
  getById
};
