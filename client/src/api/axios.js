import axios from "axios";

const BASE_URL = "http://localhost:5000";
const BASE_URL_TWO = "http://localhost:3500";

export default axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  withCredentials: true,
});
