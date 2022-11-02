const service = require("./tables.service");
const reservationsService = require("../reservations/reservations.service");

// reservation exists

//error handlers
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

// middleware
async function tablesExists(req, res, next) {
  const table_id = req.params.table_id;
  const table = await service.read(table_id);

  if (table) {
    res.locals.table = table;
    next();
  } else {
    next({
      status: 404,
      message: `table cannot be found. ${table_id}`,
    });
  }
}

async function reservationIdExists(req, res, next) {
  const resId = req.body.data.reservation_id;

  const reservation = await reservationsService.read(resId);

  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  return next({
    status: 404,
    message: `${req.body.data.reservation_id} not found`,
  });
}

const VALID_PROPERTIES = ["table_name", "capacity"];

const hasRequiredProperties = hasProperties("table_name", "capacity");

function hasValidFields(req, res, next) {
  const { data = {} } = req.body;
  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

function isValidNumber(req, res, next) {
  const { data = {} } = req.body;

  if (data["capacity"] === 0 || !Number.isInteger(data["capacity"])) {
    return next({
      status: 400,
      message: `Invalid number for capacity`,
    });
  }
  next();
}

function isOneCharacter(req, res, next) {
  const { data = {} } = req.body;
  if (data["table_name"].length < 2) {
    return next({
      status: 400,
      message: "table_name needs to be more than one character",
    });
  }
  next();
}

async function list(req, res) {
  const data = await service.list();
  res.json({ data });
}

async function read(req, res) {
  res.status(200).json({ data: res.locals.table });
}

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

async function finishTable(req, res) {
  const { table_id } = req.params;
  const { reservation_id } = req.body.data;

  const data = await service.finishTable(reservation_id, table_id);
  res.status(200).json({ data });
}

async function seatTable(req, res) {
  const { table_id } = req.params;
  const { reservation_id } = req.body.data;

  const data = await service.seatTable(reservation_id, table_id);
  res.status(200).json({ data });
}

async function tableIsOccupied(req, res, next) {
  const { people } = res.locals.reservation;
  const { reservation_id, capacity } = res.locals.table;

  if (reservation_id != null) {
    return next({
      status: 400,
      message: "table is occupied",
    });
  }

  if (people > capacity) {
    return next({
      status: 400,
      message: "reservation is greater than table capacity",
    });
  }
  next();
}

module.exports = {
  create: [
    hasRequiredProperties,
    hasValidFields,
    isValidNumber,
    isOneCharacter,
    asyncErrorBoundary(create),
  ],
  read: [tablesExists, asyncErrorBoundary(read)],
  finishTable: [
    asyncErrorBoundary(tablesExists),
    asyncErrorBoundary(finishTable),
  ],
  seatTable: [
    hasProperties("reservation_id"),
    asyncErrorBoundary(reservationIdExists),
    asyncErrorBoundary(tablesExists),
    tableIsOccupied,
    asyncErrorBoundary(seatTable),
  ],
  list: asyncErrorBoundary(list),
};
