import React from 'react'
import { useState } from "react";
import { Navigate } from 'react-router-dom'

const PrivateRoute = ({user, children }) => {

    // Add your own authentication on the below line.
    // const [userId, setUserId] = useState(() => {
    //     const localData = sessionStorage.getItem("id");
    //     return localData ? localData : null;
    // });

    return user ? children : <Navigate to="/homepage" />;
    
}

export default PrivateRoute