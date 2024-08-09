import React from "react";

const preventMinus = (e) => {
    if (e.code === 'Minus') {
        e.preventDefault();
    }   
  };

export default preventMinus;