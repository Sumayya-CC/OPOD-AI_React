import http from "../helpers/mapPostHeader";
import { APIS } from "../constants/apiConstants";

// Map upload service
class MapUploadService {
  mapUpload(file) {
    let formData = new FormData();

    formData.append("image", file);

    return http.post(APIS.MAP_UPLOAD, formData);
  }
}

export default new MapUploadService();
