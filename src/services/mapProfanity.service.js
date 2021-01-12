import http from "../helpers/mapPostHeader";
import { APIS } from "../constants/apiConstants";

// Image upload service (Images other than maps)
class MapUploadService {
  mapUpload(file) {
    let formData = new FormData();

    formData.append("image", file);

    return http.post(APIS.MAP_UPLOAD, formData);
  }
}

export default new MapUploadService();
