import { Route, Switch, BrowserRouter } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import NavBarComp from "./components/NavBarComp"
import React, { Component } from "react";

class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter >
          <NavBarComp />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/about" component={About} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}
export default App;

