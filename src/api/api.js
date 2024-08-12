import axios from "axios";

// const baseURL = "https://localhost:5000/api/";
const baseURL = process.env.REACT_APP_BACKEND_URL;

const Api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
});

export default Api;
