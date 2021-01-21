import http from "../helpers/trainerHeader";
import { APIS } from "../constants/apiConstants";

// Map Trainer service
class MapTrainerService {
  fetchNextImage() {
    return http.get(APIS.MAP_TRAINER_FETCH_NEXT);
  }
  fetchClasses() {
    return http.get(APIS.MAP_TRAINER_FETCH_CLASSES);
  }
  saveData(data) {
    return http.post(APIS.MAP_TRAINER_SAVE_DATA, data);
  }
}

export default new MapTrainerService();
