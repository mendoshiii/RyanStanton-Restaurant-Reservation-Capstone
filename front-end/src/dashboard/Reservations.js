import React from "react";
import { useHistory } from "react-router-dom";
import { cancelReservation } from "../utils/api";

export default function Reservations({ reservation, loadDashboard }) {
  const history = useHistory();

  const {
    reservation_id,
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
    status,
  } = reservation;

  const handleCancel = () => {
    const confirmBox = window.confirm(
      "Do you want to cancel this reservation? This cannot be undone."
    );

    if (confirmBox === true) {
      cancelReservation(reservation, reservation_id)
        .then(() => history.go())
        .catch((error) => console.log("error", error));
    }

    return null;
  };

  return (
    <>
      <tr key={reservation_id}>
        <td>{reservation_id}</td>
        <td>
          {last_name}, {first_name}
        </td>
        <td>{mobile_number}</td>
        <td>{reservation_date}</td>
        <td>{reservation_time}</td>
        <td>{people}</td>
        <td data-reservation-id-status={reservation_id}>
          {" "}
          Currently: {status}
        </td>
        <td>
          {status === "booked" ? (
            <div>
              <a
                href={`/reservations/${reservation_id}/seat`}
                type="button"
                className="btn btn-primary"
              >
                Seat
              </a>
              <a
                href={`/reservations/${reservation_id}/edit`}
                type="button"
                className="btn btn-secondary mx-2"
              >
                Edit
              </a>
              <button
                data-reservation-id-cancel={reservation.reservation_id}
                type="button"
                className="btn btn-warning mx-2"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          ) : null}
        </td>
      </tr>
    </>
  );
}
