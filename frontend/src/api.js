import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:3001", // Replace with your backend server URL
});

export default API;
