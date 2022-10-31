const service = require("./tables.service");

//error handlers
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");


async function tablesExists(req, res, next) {
  const table_id = res.locals.table_id;
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

const hasRequiredProperties = hasProperties("table_name", "capacity");

const VALID_PROPERTIES = ["table_name", "capacity"];

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

// function isOccupied(req, res, next) {
//   if (!table.reservation_id) {
//     console.log(
//       `Reservation ${reservation_id} is currently seated here. This table is occupied`
//     );
//   } else {
//     return
//   }
// }

async function list(req, res) {
  const data = await service.list();
  res.json({ data });
}

function read(req, res) {
  res.status(200).json({ data: res.locals.table });
}

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

async function update(req, res) {
  const updatedTable = {
    ...req.body.data,
    table_id: res.locals.table.table_id,
  };

  const data = await service.update(updatedTable);
  res.json({ data });
}

async function destroy(req, res) {
  const { table } = res.locals;
  await service.delete(table.table_id);
  res.sendStatus(204);
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
  tablesExists,
  update: [
    tablesExists,
    hasValidFields,
    isValidNumber,
    asyncErrorBoundary(update),
  ],
  delete: [asyncErrorBoundary(tablesExists), asyncErrorBoundary(destroy)],
  list: asyncErrorBoundary(list),
};
