const { authJwt } = require("../middleware");
const controller = require('../controllers/config.controller');

module.exports = app => {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
  app.get(`${process.env.API_PREFIX}/configs`, controller.findAll);
  app.post(`${process.env.API_PREFIX}/save`, controller.saveConfigs);
}