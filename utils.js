const path = require('path');

/**
 * Creates an absolute path based on provided directory name
 * and file name
 *
 * @param {String} dirname - directory name
 * @param {String} filename - file name
 * @return {String} Absolute path
 */
function getAbsolutePath(dirname, filename) {
  return path.join(dirname, filename);
}

module.exports = { getAbsolutePath };
