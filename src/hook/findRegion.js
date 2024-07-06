import React from "react";

const findRegion = (array, e, tingkat) => {
    return array.find((element) => {
        if (tingkat === "Nasional"){
            return element.Provinsi.nama_provinsi === e.Provinsi.nama_provinsi
        }else{
            return element.Kabupaten_Kotum.nama_kabupaten_kota === e.Kabupaten_Kotum.nama_kabupaten_kota
        }
    })
}

export default findRegion;