const router = require("express").Router();

//error handler
const methodNotAllowed = require("../errors/methodNotAllowed");

//controller
const controller = require("./tables.controller");

router
  .route("/:table_id/seat")
  .put(controller.seatTable)
  .delete(controller.finishTable)
  .all(methodNotAllowed);

router
  .route("/")
  .post(controller.create)
  .get(controller.list)
  .all(methodNotAllowed);

module.exports = router;
