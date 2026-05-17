import axios from "axios";

const API_BASE_URL = process.env.API_BASE_URL;

if (API_BASE_URL === undefined || API_BASE_URL === "") {
  throw new Error("API_BASE_URL is not defined");
}

// Shared Axios instance for server-to-server calls to the backend API.
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
