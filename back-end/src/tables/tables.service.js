const knex = require("../db/connection");

function list() {
  return knex("tables").select("*").orderBy("table_name");
}

function read(table_id) {
  return knex("tables").select("*").where({ table_id }).first();
}

function create(newTable) {
  return knex("tables")
    .insert(newTable, "*")
    .then((createdRecords) => createdRecords[0]);
}

function finishTable(reservation_id, table_id) {
  return knex("tables")
    .where({ table_id: table_id })
    .update({ reservation_id: null });
}

function seatTable(reservation_id, table_id) {
  return knex("tables")
    .where({ table_id: table_id })
    .update({ reservation_id })
    .returning("*")
    .then((updatedTable) => updatedTable[0]);
}

module.exports = {
  list,
  read,
  create,
  finishTable,
  seatTable,
};
