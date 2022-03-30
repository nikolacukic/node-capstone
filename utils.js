/**
 * Parses the provided value using the provided function.
 * If value cannot be parsed, throws error with the provided message.
 * 
 * @param {String} value - Value to be parsed
 * @param {Function} parsingFn - Function that parses the value
 * @param {String} message - Error message to throw if value cannot be parsed
 * @return {number} Parsed value
 */
const parseValue = (value, parsingFn, message) => {
  const parsedValue = parsingFn(value);
  if (isNaN(parsedValue)) {
    throw { code: 400, message };
  }
  return parsedValue;
};

module.exports = { parseValue };
