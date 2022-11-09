const knex = require("../db/connection");

function list(date) {
  return knex("reservations")
    .where("reservation_date", date)
    .whereNotIn("status", ["finished", "cancelled"])
    .orderBy("reservation_time");
}

function read(reservation_id) {
  return knex("reservations").where({ reservation_id }).first();
}

function create(newReservation) {
  return knex("reservations")
    .insert(newReservation, "*")
    .then((createdRecords) => createdRecords[0]);
}

function update(updatedReservation) {
  return knex("reservations")
    .where({ reservation_id: updatedReservation.reservation_id })
    .whereNot({ status: "finished" })
    .update(updatedReservation, "*")
    .then((updatedRecord) => updatedRecord[0]);
}

function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

function destroy(reservation_Id) {
  return knex("reservations").where({ reservation_Id }).del();
}

module.exports = {
  list,
  read,
  create,
  update,
  delete: destroy,
  search,
};
