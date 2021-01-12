import axios from "axios";

// Image URL header
export default axios.create({
  baseURL: process.env.REACT_APP_IMAGE_BASE_URL,
  headers: {
    'accept': 'application/json', 
    'Content-Type': 'application/json',
  }
});