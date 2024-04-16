import instance from "./axios";

const host = "/uploads";

const uploadApi = {
  image: (data) => {
    const formData = new FormData();

    formData.append("image", data);

    return instance.post(host + "/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default uploadApi;
