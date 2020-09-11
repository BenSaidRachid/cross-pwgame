import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { urls } from "./data";
import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import Games from "./pages/Games";
import socket from "./service/socket";

export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route
          exact
          path={urls.games.base}
          onLeave
          render={(props: object) => <Games {...props} io={socket} />}
        />
        <Route
          exact
          path={urls.rooms.base}
          render={(props: object) => <Rooms {...props} io={socket} />}
        />
        <Route
          exact
          path={urls.root}
          render={(props: object) => <Home {...props} />}
        />
      </Switch>
    </BrowserRouter>
  );
}
