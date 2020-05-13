const { clearHash } = require("../services/cache");

module.exports = async (req, res, next) => {
  await next(); // This is done so that we can run the route handler and then execute our custom middleware code
  clearHash(req.user.id);
};
