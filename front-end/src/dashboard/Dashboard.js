import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listReservations, cancelReservation, finishTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import Reservations from "./Reservations";
import Tables from "./Tables";
import { today, next, previous } from "../utils/date-time";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */

//make a useEffect, inside make an api call(a fetch) to /reservations api, including the date variable in the query string as a template literal, console.log it out, use string methods to format it

function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  function onCancel(reservation_id) {
    cancelReservation(reservation_id)
      .then(loadDashboard)
      .catch(setReservationsError);
  }

  console.log("reservations on dashboard: ", reservations);
  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <Reservations reservations={reservations} onCancel={onCancel} />

      <Tables />

      <Link to={`/dashboard?date=${previous(date)}`}>Previous</Link>
      <Link to={`/dashboard?date=${today(date)}`}>Today</Link>
      <Link to={`/dashboard?date=${next(date)}`}>Next</Link>
    </main>
  );
}

export default Dashboard;
