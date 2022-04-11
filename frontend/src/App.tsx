import React from "react";
import { Switch, Route } from "react-router-dom";
import { Alerts } from "./features/Alerts";
import { Game } from "./features/Game";
import { Login } from "./features/Login";
import { NavBar } from "./features/NavBar";
import { Register } from "./features/Register";

function App() {
  return (
    <React.Fragment>
      <NavBar />
      <hr />
      <div className="container">
        <Switch>
          <Route exact path="/register">
            <Register />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/game">
            <Game />
          </Route>
        </Switch>
      </div>
      <hr />
      <Alerts />
    </React.Fragment>
  );
}

export default App;
