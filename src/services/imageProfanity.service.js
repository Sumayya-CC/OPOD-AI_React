import http from "../helpers/imagePostHeader";
import { APIS } from "../constants/apiConstants";

// Image upload service (Images other than maps)
class ImageUploadService {
  upload(file) {
    let formData = new FormData();

    formData.append("image", file);

    return http.post(APIS.IMAGE_UPLOAD, formData);
  }

  mapUpload(file) {
    let formData = new FormData();

    formData.append("image", file);

    return http.post(APIS.MAP_UPLOAD, formData);
  }
}

export default new ImageUploadService();
