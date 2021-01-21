import axios from "axios";

// Map trainer header
export default axios.create({
  baseURL: process.env.REACT_APP_MAP_TRAINER_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});