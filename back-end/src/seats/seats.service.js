const knex = require("../db/connection");

function read(seat_id) {
  return knex("seat").select("*").where({ seat_id }).first();
}

function update(updatedSeat) {
  return knex("seat")
    .where({ seat_id: updatedSeat.seat_id })
    .update(updatedSeat, "*")
    .then((updatedRecord) => updatedRecord[0]);
}

function destroy(seat_Id) {
  return knex("seat").where({ seat_Id }).del();
}

module.exports = {
  read,
  update,
  delete: destroy,
};
