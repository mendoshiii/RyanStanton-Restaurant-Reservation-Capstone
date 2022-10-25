const reservationsService = require("./reservations.service");

//error handlers
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

//middleware/helper functions

async function reservationExists(req, res, next) {
  const reservation_id = res.locals.reservation_id;
  const reservation = await reservationsService.read(reservation_id);
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

// const VALID_PROPERTIES = [
//   "first_name",
//   "last_name",
//   "mobile_number",
//   "reservation_date",
//   "reservation_time",
//   "people",
// ]

const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
);

// NOT NEEDED (left in for brevity)
// function hasEnoughPeople(req, res, next) {
//   const peopleInParty = Number(req.body.data.people);

//   if (peopleInParty >= 1) {
//     return next();
//   }
//   next({
//     status: 400,
//     message: `Must have at least 1 person in the party to make a reservation.`,
//   });
// }

function hasValidFields(req, res, next) {
  const { data = {} } = req.body;
  const validFields = new Set([
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
    //"status",
    //"created_at",
    //"updated_at",
    //"reservation_id",
  ]);

  const invalidFields = Object.keys(data).filter(
    (field) => !validFields.has(field)
  );

  if (invalidFields.length)
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  next();
}

function hasReservationId(req, res, next) {
  const reservation =
    req.params.reservation_id || req.body?.data?.reservation_id; // if there is a req.body, check for data, if there is data, check for reservation_id.

  if (reservation) {
    res.locals.reservation_id = reservation;
    next();
  } else {
    next({
      status: 400,
      message: `missing reservation_id`,
    });
  }
}

/**
 * Check "isValidNumber" handler for reservation resources
 */
function isValidNumber(req, res, next) {
  const { data = {} } = req.body;
  console.log("this should be the number of people:", data["people"]);
  if (data["people"] === 0 || !Number.isInteger(data["people"])) {
    return next({ status: 400, message: `Invalid number of people` });
  }
  next();
}

/**
 * Check "isValidDate" handler for reservation resources
 */
function isValidDate(req, res, next) {
  const { data = {} } = req.body;
  const reservation_date = new Date(data["reservation_date"]);
  const day = reservation_date.getUTCDay(); //check this on mdn
  console.log("this is the reservation date:", reservation_date);
  if (isNaN(Date.parse(data["reservation_date"]))) {
    return next({ status: 400, message: `Invalid reservation_date` });
  }
  if (day === 2) {
    return next({ status: 400, message: `Restaurant is closed on Tuesdays` });
  }
  //changed from less than to greater than
  if (reservation_date < new Date()) {
    return next({
      status: 400,
      message: `Reservation must be set in the future`,
    });
  }
  next();
}

/*
 * Check "isTime" handler for reservation resources
 */
function isTime(req, res, next) {
  const { data = {} } = req.body;
  if (
    /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(data["reservation_time"]) ||
    /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(
      data["reservation_time"]
    )
  ) {
    return next();
  }
  next({ status: 400, message: `Invalid reservation_time` });
}

/**
 * Create handler for reservation resources
 */
async function create(req, res) {
  const data = await reservationsService.create(req.body.data);
  res.status(201).json({ data });
}

/**
 * Read handler for reservation resources
 */

async function read(req, res) {
  res.status(200).json({ data: res.locals.reservation });
}

/**
 * Update handler for reservation resources
 */
async function update(req, res) {
  // Another way for update
  // const { reservation_id } = res.locals.reservation;
  // req.body.data.reservation_id = reservation_id;
  // const data = await reservationsService.update(req.body.data);
  // res.json({ data });
  //a different way to write  const updatedReservation

  const updatedReservation = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };

  const data = await reservationsService.update(updatedReservation);
  res.json({ data });
}

/**
 * Delete handler for reservation resources
 */

async function destroy(req, res) {
  const { reservation } = res.locals;
  await reservationsService.delete(reservation.reservation_id);
  res.sendStatus(204);
}

/**
 * Other ways to do the same thing (complex)
 * List handler for reservation resources
 */
//showing all the lists for just the day, or just listing all reservations no matter what day
// async function list(req, res, next) {
//   const { reservation_date } = req.query;

//   if (reservation_date === today) {
//     res.json({
//       data: await await reservationsService.reservationIsToday(
//         reservation_date
//       ),
//     });
//   }

//   res.status(200).json({ data: await reservationsService.list() });
// }

/**
 * List handler (basic) for reservation resources
 */
async function list(req, res) {
  const data = await reservationsService.list(req.query.date);
  res.json({
    data,
  });
}

module.exports = {
  create: [
    hasRequiredProperties,
    hasValidFields,
    isTime,
    //hasEnoughPeople,
    isValidDate,
    isValidNumber,
    asyncErrorBoundary(create),
  ],
  read: [hasReservationId, reservationExists, asyncErrorBoundary(read)],
  reservationExists: [hasReservationId, reservationExists],
  update: [
    reservationExists,
    hasReservationId,
    hasValidFields,
    hasRequiredProperties,
    isValidNumber,
    isValidDate,
    isTime,
    // hasEnoughPeople,
    asyncErrorBoundary(update),
  ],
  delete: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(destroy)],
  list: asyncErrorBoundary(list),
};
