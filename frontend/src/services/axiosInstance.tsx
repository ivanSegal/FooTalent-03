import axios from "axios";

export const api = axios.create({
  baseURL: "https://footalent-03.onrender.com",
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
