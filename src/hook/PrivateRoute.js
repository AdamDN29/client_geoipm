import React from 'react'
import { useState } from "react";
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({user, children }) => {
    return user ? children : <Navigate to="/homepage" />;   
}

export default PrivateRoute