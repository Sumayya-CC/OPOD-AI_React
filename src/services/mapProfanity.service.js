import http from "../helpers/mapPostHeader";
import httpFeedback from "../helpers/mapFeedback";
import { APIS } from "../constants/apiConstants";

// Map upload service
class MapUploadService {
  mapUpload(file) {
    let formData = new FormData();

    formData.append("image", file);

    return http.post(APIS.MAP_UPLOAD, formData);
  }

  sendFeedBack(data) {
    return httpFeedback.post(APIS.MAP_FEEDBACK, data);
  }
}

export default new MapUploadService();
