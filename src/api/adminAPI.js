import Api from "./api";
import axios from "axios";

const baseURL = process.env.REACT_APP_BACKEND_URL;

const adminAPI = {
  getDataAdmin(id) {
    return Api.get(`/admin/${id}`).catch((err) => {console.log(err);});
  },

  login(data) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: data
    };
      return fetch(`${baseURL}/admin/login`, requestOptions)
      .then(response => response.json())
  },

  logout() {
    return Api.post(`/admin/logout`);
  },

  editDataAdmin(id, data) {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: data
    };
      return fetch(`${baseURL}/admin/update/${id}`, requestOptions)
      .then(response => response.json())
  },

  editPassAdmin(id, data) {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: data
    };
      return fetch(`${baseURL}/admin/updatepass/${id}`, requestOptions)
      .then(response => response.json())
  }
};

export default adminAPI;