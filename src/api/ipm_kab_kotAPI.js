import Api from "./api";

const baseURL = process.env.REACT_APP_BACKEND_URL;

const ipm_kab_kotAPI = {
  getAllData() {
    return Api.get('/ipm_kabupaten_kota').catch((err) => {console.log(err);});
  },
  getOneKabKot(id) {
    return Api.get(`/ipm_kabupaten_kota/${id}`);
  },
  getAllDataKabKot(year) {
    return Api.get(`/ipm_kabupaten_kota/getAllData/${year}`).catch((err) => {console.log(err);}); 
  },
  getOneDataKabKot(id, year) {
    return Api.get(`/ipm_kabupaten_kota/getOneData/${id}/${year}`).catch((err) => {console.log(err);}); 
  },
  getManyDataKabKot(id, year) {
    return Api.get(`/ipm_kabupaten_kota/getManyData/${id}/${year}`).catch((err) => {console.log(err);}); 
  },
  getDataKabKot(dataType, year) {
    return Api.get(`/ipm_kabupaten_kota/getData/${dataType}/${year}`).catch((err) => {console.log(err);}); 
  },
  getDataKabKotYear() {
    return Api.get(`/ipm_kabupaten_kota/getYear/Year`).catch((err) => {console.log(err);}); 
  },
  getLastData() {
    return Api.get(`/ipm_kabupaten_kota/getLastData/last`).catch((err) => {console.log(err);}); 
  },
  editDataIPM(id, data) {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: data
    };
      return fetch(`${baseURL}/ipm_kabupaten_kota/update/${id}`, requestOptions)
      .then(response => response.json())
  },
  createDataIPM(kabupaten_kota_Id, data) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: data
    };
      return fetch(`${baseURL}/ipm_kabupaten_kota/create/${kabupaten_kota_Id}`, requestOptions)
      .then(response => response.json())
  },
  deleteDataIPM(id) {
    return Api.delete(`/ipm_kabupaten_kota/delete/${id}`).catch((err) => {console.log(err);}); 
  }

};

export default ipm_kab_kotAPI;

