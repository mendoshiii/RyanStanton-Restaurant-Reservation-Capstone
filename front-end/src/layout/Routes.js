import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import NewReservationForm from "../reservations/NewReservationForm";
import CreateTable from "../tables/CreateTable";

import useQuery from "../utils/useQuery";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const query = useQuery();
  const date = query.get("date");

  console.log(date);
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations/new">
        <NewReservationForm />
      </Route>

      <Route exact={true} path="/tables">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/tables/new">
        <CreateTable />
      </Route>

      <Route exact={true} path="/dashboard">
        <Dashboard date={date || today()} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
