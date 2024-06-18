import Api from "./api";

const baseURL = process.env.REACT_APP_BACKEND_URL;

const provinsiAPI = {
  getAllProvinsi() {
    return Api.get('/provinsi').catch((err) => {console.log(err);});
  },
  getOneProvinsi(id) {
    return Api.get(`/provinsi/${id}`);
  },
  editDataWilayah(id, data) {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: data
    };
      return fetch(`${baseURL}provinsi/update/${id}`, requestOptions)
      .then(response => response.json())
  },

};

export default provinsiAPI;

