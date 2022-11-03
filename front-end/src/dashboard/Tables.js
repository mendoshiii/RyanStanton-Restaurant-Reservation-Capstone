import React from "react";

export default function Tables({ table, loadDashboard }) {
  const { table_id, table_name, capacity, reservation_id } = table;

  return (
    <tr key={table_id}>
      <th scope="row">{table_id}</th>
      <td>{table_name}</td>
      <td>{capacity}</td>
      <td data-table-id-status={`${table_id}`}>
        {reservation_id ? "Occupied" : "Free"}
      </td>
      <td>
        {reservation_id ? (
          <button data-table-id-finish={table_id} className="btn btn-warning">
            Finish
          </button>
        ) : null}
      </td>
    </tr>
  );
}
