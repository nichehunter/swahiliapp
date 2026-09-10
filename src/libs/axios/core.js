import axios from "axios";

const coreApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SWAHILI_API_URL,

  headers: {
    "Content-Type": "application/json",
  },
});

export default coreApi;
