/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */
const router = require("express").Router({ mergeParams: true });

//error handler
const methodNotAllowed = require("../errors/methodNotAllowed");

const controller = require("./reservations.controller");

router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

router
  .route("/:reservation_id")
  .get(controller.read)
  .patch(controller.update)
  .delete(controller.delete)
  .all(methodNotAllowed);

module.exports = router;
