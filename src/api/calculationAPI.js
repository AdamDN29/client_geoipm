import Api from "./api";

const calculationAPI = {
  getCalcProvinsi(dataType, tahun) {
    return Api.get(`/data/getProvinsi/${dataType}/${tahun}`).catch((err) => {console.log(err);});
  },
  getCalcKabKot(dataType, tahun) {
    return Api.get(`/data/getKabKot/${dataType}/${tahun}`).catch((err) => {console.log(err);});
  },
  getDataTotal() {
    return Api.get(`/data/getTotal`).catch((err) => {console.log(err);});
  },
  getGWRProvinsi(tahun) {
    return Api.get(`/data/getGWRProvinsi/${tahun}`).catch((err) => {console.log(err);});
  },
  getGWRKabKot(tahun) {
    return Api.get(`/data/getGWRKabKot/${tahun}`).catch((err) => {console.log(err);});
  },
  getCalcGWRProvinsi(dataType, tahun) {
    return Api.get(`/data/getCalcGWRProvinsi/${dataType}/${tahun}`).catch((err) => {console.log(err);});
  },
  getCalcGWRKabKot(dataType, tahun) {
    return Api.get(`/data/getCalcGWRKabKot/${dataType}/${tahun}`).catch((err) => {console.log(err);});
  },
};

export default calculationAPI;