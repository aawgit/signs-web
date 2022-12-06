import React, { useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import { useHistory, useLocation, matchPath } from "react-router-dom";
import { Button } from "@mui/material";

const NavButton = ({ to, component: Component, ...rest }) => {
  const history = useHistory();
  const { pathname } = useLocation();

  const isSelected = useMemo(
    () => !!matchPath(pathname, { path: to, exact: true }),
    [to, pathname]
  );

  const handleClick = useCallback(() => history.replace(to), [history, to]);

  return (
    <Component
      sx={{ textTransform: "none" }}
      onClick={handleClick}
      disabled={isSelected}
      {...rest}
    />
  );
};

NavButton.propTypes = {
  to: PropTypes.string.isRequired,
  component: PropTypes.elementType,
};

NavButton.defaultProps = {
  component: Button,
};

export default NavButton;
