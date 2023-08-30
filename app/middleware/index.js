const { verifyToken } = require('./auth');
const { checkDuplicateEmail } = require('./verifySignUp');

module.exports = {
  verifyToken,
  checkDuplicateEmail,
};