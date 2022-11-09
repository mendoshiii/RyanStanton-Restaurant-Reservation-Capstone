/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */
const router = require("express").Router();

//error handler
const methodNotAllowed = require("../errors/methodNotAllowed");

// controller import
const controller = require("./reservations.controller");

router
  .route("/:reservation_id/status")
  .get(controller.read)
  .put(controller.updateStatus)
  .all(methodNotAllowed);

router
  .route("/:reservation_id")
  .get(controller.read)
  .put(controller.update)
  .all(methodNotAllowed);
router
  .route("/")
  .post(controller.create)
  .get(controller.list)
  .all(methodNotAllowed);

module.exports = router;
