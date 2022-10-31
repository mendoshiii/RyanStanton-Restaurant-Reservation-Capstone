const service = require("./seats.service");

//error handlers
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

// middleware

async function seatExists(req, res, next) {
  const seat_id = res.locals.seat_id;
  const seat = await service.read(seat_id);
  if (seat) {
    res.locals.seat = seat;
    next();
  } else {
    next({
      status: 404,
      message: `seat cannot be found. ${seat_id}`,
    });
  }
}

async function reservationExists(req, res, next) {
  const reservation_id = res.locals.reservation_id;
  const reservation = await service.read(reservation_id);

  if (reservation) {
    res.locals.reservation = reservation;
    next();
  } else {
    next({
      status: 404,
      message: `Reservation cannot be found. ${reservation_id}`,
    });
  }
}

// crud
async function update(req, res) {
  const updatedSeat = {
    ...req.body.data,
    seat_id: res.locals.seat.seat_id,
  };

  const data = await service.update(updatedSeat);
  res.json({ data });
}

async function destroy(req, res) {
  const { seat } = res.locals;
  await service.delete(seat.seat_id);
  res.sendStatus(204);
}

module.exports = {
  update: [seatExists, asyncErrorBoundary(update)],
  delete: [seatExists, asyncErrorBoundary(destroy)],
};
