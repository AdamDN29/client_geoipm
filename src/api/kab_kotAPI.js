import Api from "./api";

const baseURL = process.env.REACT_APP_BACKEND_URL;

const kab_kotAPI = {
  getAllKabKot() {
    return Api.get('/kabupaten_kota').catch((err) => {console.log(err);});
  },
  getKabKotbyProvinsi(id) {
    return Api.get(`/kabupaten_kota/getKabKotbyProvinsi/${id}`).catch((err) => {console.log(err);});
  },
  getOneKabKot(id) {
    return Api.get(`/kabupaten_kota/${id}`);
  },
  editDataWilayah(id, data) {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: data
    };
      return fetch(`${baseURL}kabupaten_kota/update/${id}`, requestOptions)
      .then(response => response.json())
  },

};

export default kab_kotAPI;

