import React from "react";
import PropTypes from "prop-types";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  components: {},
});

const MuiThemeProvider = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);

MuiThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MuiThemeProvider;
