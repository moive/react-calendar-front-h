import React from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";

export const PublicRoute = ({ isAuthenticated, component: Component }) => {
  return isAuthenticated ? <Navigate to="/" /> : <Component />;
};

PublicRoute.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
};
