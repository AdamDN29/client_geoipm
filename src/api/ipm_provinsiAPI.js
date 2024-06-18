import Api from "./api";

const baseURL = process.env.REACT_APP_BACKEND_URL;

const ipm_provinsiAPI = {
  getAllData() {
    return Api.get('/ipm_provinsi').catch((err) => {console.log(err);});
  },
  getOneProvinsi(id) {
    return Api.get(`/ipm_provinsi/${id}`);
  },
  getAllDataProvinsi(year) {
    return Api.get(`/ipm_provinsi/getAllData/${year}`).catch((err) => {console.log(err);}); 
  },
  getOneDataProvinsi(id, year) {
    return Api.get(`/ipm_provinsi/getOneData/${id}/${year}`).catch((err) => {console.log(err);}); 
  },
  getDataProvinsi(dataType, year) {
    return Api.get(`/ipm_provinsi/getData/${dataType}/${year}`).catch((err) => {console.log(err);}); 
  },
  getDataProvinsiYear() {
    return Api.get(`/ipm_provinsi/getYear/Year`).catch((err) => {console.log(err);}); 
  },
  getLastData() {
    return Api.get(`/ipm_provinsi/getLastData/last`).catch((err) => {console.log(err);}); 
  },
  editDataIPM(id, data) {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: data
    };
      return fetch(`${baseURL}ipm_provinsi/update/${id}`, requestOptions)
      .then(response => response.json())
  },
  createDataIPM(provinsi_Id, data) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: data
    };
      return fetch(`${baseURL}ipm_provinsi/create/${provinsi_Id}`, requestOptions)
      .then(response => response.json())
  },
  deleteDataIPM(id) {
    return Api.delete(`/ipm_provinsi/delete/${id}`).catch((err) => {console.log(err);}); 
  }
};

export default ipm_provinsiAPI;

