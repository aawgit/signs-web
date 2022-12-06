import React from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import Container from "@mui/material/Container";
import MuiThemeProvider from "./components/MuiThemeProvider";
import Home from "./components/Home";
import About from "./components/About";
import NavBarComp from "./components/NavBarComp";

const App = () => {
  return (
    <MuiThemeProvider>
      <Container maxWidth="lg" disableGutters>
        <BrowserRouter>
          <NavBarComp />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/about" component={About} />
          </Switch>
        </BrowserRouter>
      </Container>
    </MuiThemeProvider>
  );
};

export default App;
