import React from "react";
import { Link } from "react-router-dom";

export default function Tables({ tables = [] }) {
  const rows = tables.length ? (
    tables.map((table) => {
      return (
        <div className="form-group row" key={table.table_id}>
          <div className="col-sm-1">{table.table_id}</div>
          <div>{table.table_name}</div>
          <div>{table.table_capacity}</div>
        </div>
      );
    })
  ) : (
    <div>No Tables Found</div>
  );

  return <div className="table">{rows}</div>;
}
