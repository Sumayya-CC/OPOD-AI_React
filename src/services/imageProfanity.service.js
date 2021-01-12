import http from "../helpers/imagePostHeader";
import { APIS } from "../constants/apiConstants";

// Image upload service (Images other than maps)
class ImageUploadService {
  upload(file) {
    let formData = new FormData();

    formData.append("image", file);

    return http.post(APIS.IMAGE_UPLOAD, formData);
  }

  urlUpload(data) {
    return http.post(APIS.IMAGE_URL_UPLOAD, data);
  }
}

export default new ImageUploadService();
