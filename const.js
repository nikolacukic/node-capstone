DB_SQL_PATH = 'my-db.sql';
DB_PATH = 'my.db';

GET_ALL_USERS_QUERY = 'SELECT _id, username FROM user';
INSERT_USER_QUERY = 'INSERT INTO user (username) VALUES (?)';

module.exports = {
  paths: {
    DB_SQL_PATH,
    DB_PATH
  },
  queries : {
    GET_ALL_USERS_QUERY,
    INSERT_USER_QUERY
  }
};
