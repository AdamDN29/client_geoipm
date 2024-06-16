import axios from "axios";

// const baseURL = "https://be-pengetahuan-tradisional.herokuapp.com/api/";
const baseURL = "http://localhost:5000/api/";

const Api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
});

export default Api;
