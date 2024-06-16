import React from "react";

const separatorNumber = (prop) => {
    let temp = prop.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return temp;
}

export default separatorNumber;