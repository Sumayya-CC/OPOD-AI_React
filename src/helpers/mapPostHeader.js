import axios from "axios";

// Image post header (For maps)
export default axios.create({
  baseURL: process.env.REACT_APP_IMAGE_MAP_BASE_URL,
  headers: {
    'accept': 'application/json', 
    'Content-Type': 'multipart/form-data',
  }
});