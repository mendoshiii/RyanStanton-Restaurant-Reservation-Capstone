const knex = require("../db/connection");

function list() {
  return knex("tables").select("*").orderBy("table_name");
}

function read(table_id) {
  return knex("table").select("*").where({ table_id }).first();
}

function create(newTable) {
  return knex("tables")
    .insert(newTable, "*")
    .then((createdRecords) => createdRecords[0]);
}

function update(updatedTable) {
  return knex("table")
    .where({ table_id: updatedTable.table_id })
    .update(updatedTable, "*")
    .then((updatedRecord) => updatedRecord[0]);
}

function destroy(table_Id) {
  return knex("table").where({ table_Id }).del();
}

module.exports = {
  list,
  read,
  create,
  update,
  delete: destroy,
};
