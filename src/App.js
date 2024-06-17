import React, { useState, useEffect, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import { Spinner } from 'react-bootstrap'
import PrivateRoute from './hook/PrivateRoute';

import { routes } from "./config/routes";

const Homepage = React.lazy(() => import("./pages/Homepage"));
const IPM_Maps = React.lazy(() => import("./pages/IPM_Maps"));
const GWR_Maps = React.lazy(() => import("./pages/GWR_Maps"));
const Table_Data = React.lazy(() => import("./pages/Table_Data"));
const About = React.lazy(() => import("./pages/About"));

const Admin = React.lazy(() => import("./pages/Admin"));
const Login = React.lazy(() => import("./pages/Login"));

function App() {

  return (
    <Suspense fallback={
      <div>
          <center>
            <Spinner animation="border" role="status" size="md" />
            <p>Loading...</p>
          </center>
      </div>
      }>
        <Router>
          <Routes>
            <Route path='/' element={<Homepage/>} />
            <Route path='/homepage' element={<Homepage/>} />

            <Route element={<Homepage />} exact path={routes.HOMEPAGE()}/>
            <Route element={<IPM_Maps />} exact path={routes.IPM_MAPS()}/>
            <Route element={<GWR_Maps />} exact path={routes.GWR_MAPS()}/>
            <Route element={<Table_Data />} exact path={routes.TABLE_DATA()}/>
            <Route element={<About />} exact path={routes.ABOUT()}/>

            <Route element={<Login />} exact path={routes.LOGIN()} />
            <Route element={<PrivateRoute><Admin /></PrivateRoute>} exact path={routes.ADMIN()}/>
          </Routes>
        </Router>
      </Suspense>
  )
}

export default App