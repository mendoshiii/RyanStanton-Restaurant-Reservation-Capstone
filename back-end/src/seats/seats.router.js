const router = require("express").Router();

const methodNotAllowed = require("../errors/methodNotAllowed");

const controller = require("./seats.controller");

router
  .route("/")
  .put(controller.update)
  .delete(controller.delete)
  .all(methodNotAllowed);

module.exports = router;
