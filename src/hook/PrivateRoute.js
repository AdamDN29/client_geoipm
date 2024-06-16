import React from 'react'
import { useState } from "react";
import { Navigate , Route } from 'react-router-dom'

const PrivateRoute = ({ children }) => {

    // Add your own authentication on the below line.
    const [userId, setUserId] = useState(() => {
        const localData = sessionStorage.getItem("id");
        return localData ? localData : null;
    });

    return userId !== null ? children : <Navigate to="/homepage" />;
    
}

export default PrivateRoute