const router = require("express").Router({ mergeParams: true });

//error handler
const methodNotAllowed = require("../errors/methodNotAllowed");

//controller
const controller = require("./tables.controller");

router
  .route("/")
  .post(controller.create)
  .get(controller.list)
  .all(methodNotAllowed);

module.exports = router;
