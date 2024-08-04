import React from "react";

const findRegion = (array, name, flag) => {
    let dataName;
    return array.find((element) => {
        if(flag){
            dataName = element.Wilayah.nama_wilayah;
        }else{
            dataName = element.nama_wilayah;
        }
        
        return dataName === name
    })
}

export default findRegion;