import axios from "axios";

// Map feedback header
export default axios.create({
  baseURL: process.env.REACT_APP_IMAGE_MAP_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});