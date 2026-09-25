import axios from "axios";

// Create one Axios instance with our backend's base URL
const API = axios.create({
    baseURL: "http://localhost:5000/api",
});

export default API;