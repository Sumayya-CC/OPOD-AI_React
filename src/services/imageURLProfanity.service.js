import http from "../helpers/imageUrlPostHeader";
import { APIS } from "../constants/apiConstants";

// Image URL upload service
class ImageURLUploadService {
  urlUpload(data) {
    return http.post(APIS.IMAGE_URL_UPLOAD, data);
  }
}

export default new ImageURLUploadService();
