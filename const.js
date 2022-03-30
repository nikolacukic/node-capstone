DB_SQL_PATH = 'my-db.sql';
DB_PATH = 'my.db';

GET_ALL_USERS_QUERY = 'SELECT * FROM user';
INSERT_USER_QUERY = 'INSERT INTO user (username) VALUES (?)';
GET_USER_BY_ID_QUERY = 'SELECT * FROM user WHERE _id = ?';

INSERT_EXERCISE_QUERY = 'INSERT INTO exercise (description, duration, date, user) VALUES (?, ?, ?, ?)';
GET_EXERCISES_BY_USER_ID_QUERY = 'SELECT description, duration, date FROM exercise WHERE user = $userId';
GET_TOTAL_USER_EXERCISE_COUNT_QUERY = 'SELECT COUNT(*) as count FROM exercise WHERE user = $userId';

FILTER_FROM = ' AND date > $from';
FILTER_TO = ' AND date < $to';
FILTER_LIMIT = ' LIMIT $limit';

module.exports = {
  paths: {
    DB_SQL_PATH,
    DB_PATH
  },
  queries : {
    GET_ALL_USERS_QUERY,
    INSERT_USER_QUERY,
    GET_USER_BY_ID_QUERY,
    INSERT_EXERCISE_QUERY,
    GET_EXERCISES_BY_USER_ID_QUERY,
    GET_TOTAL_USER_EXERCISE_COUNT_QUERY
  },
  filters: {
    FILTER_FROM,
    FILTER_TO,
    FILTER_LIMIT
  }
};
