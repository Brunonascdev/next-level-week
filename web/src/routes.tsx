import React from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";

import Home from "./pages/Home";
import CreatePoint from "./pages/CreatePoint";

const Routes: React.FC = () => {
  return (
    <Router>
      <Route path="/" exact component={Home} />
      <Route path="/create-point" component={CreatePoint} />
    </Router>
  );
};

export default Routes;
