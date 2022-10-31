const router = require("express").Router({ mergeParams: true });

//error handler
const methodNotAllowed = require("../errors/methodNotAllowed");

//controller
const controller = require("./tables.controller");

//seat router
const seatRouter = require("../seats/seats.router");

router.use("/:table_id/seat", seatRouter);

router
  .route("/")
  .post(controller.create)
  .get(controller.list)
  .all(methodNotAllowed);

router
  .route("/:table_id")
  .get(controller.read)
  .put(controller.update)
  .delete(controller.delete)
  .all(methodNotAllowed);

module.exports = router;
