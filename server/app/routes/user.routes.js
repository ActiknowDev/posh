const { authJwt } = require("../middleware");
const controller = require('../controllers/user.controller');

module.exports = app => {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
  app.get(`${process.env.API_PREFIX}/users`, controller.findAll);
  app.get(`${process.env.API_PREFIX}/user/:email`, controller.findOneByEmail);
  app.post(`${process.env.API_PREFIX}/users/login`, controller.login);
  app.post(`${process.env.API_PREFIX}/create`, controller.create);
  app.put(`${process.env.API_PREFIX}/users/:id/complete`, controller.completeTraining);
  // app.post(`${process.env.API_PREFIX}/users/google-login`, controller.googleLogin);
  app.get(`${process.env.API_PREFIX}/users/:employeeId`, controller.findOneByEmployeeId);
  
  app.get(`${process.env.API_PREFIX}/usersDesignations`, controller.getUsersDesignations);
}