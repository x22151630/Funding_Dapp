import React, { Suspense } from "react";

import { Route, Routes as BrowserRoutes } from "react-router-dom";

import Home from "./Home";
import Campaign from "./Campaign";

const Routes = () => {
  return (
    <Suspense fallback={<></>}>
      <BrowserRoutes>
        <Route path="/" element={<Home />} />
        <Route path="/create-campaign" element={<Campaign />} />
      </BrowserRoutes>
    </Suspense>
  );
};

export default Routes;
