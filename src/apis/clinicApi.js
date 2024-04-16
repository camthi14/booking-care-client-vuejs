import instance from "./axios";

const nameModel = "/clinics";

const clinicApi = {
  getAll: async (filters = {}) => {
    return await instance.get(nameModel, {
      params: filters,
    });
  },
  getById: async (id) => {
    return await instance.get(`${nameModel}/${id}`);
  },
  getClinicCount: async () => {
    let url = `${nameModel}/countClinic`;
    return await instance.get(url);
  },
  create: async (data = {}) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (Array.isArray(data[key])) {
        data[key].map((t) => formData.append(key, t));
      } else {
        formData.append(key, data[key]);
      }
    });

    return await instance.post(nameModel, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  update: async ({ id, data }) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (Array.isArray(data[key])) {
        data[key].map((t) => formData.append(key, t));
      } else {
        formData.append(key, data[key]);
      }
    });

    return await instance.patch(`${nameModel}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  delete: async () => {
    return await instance.delete(`${nameModel}`);
  },
  deleteById: async (id) => {
    return await instance.delete(`${nameModel}/${id}`);
  },
  getAllSpecialtyClinic: async (id) => {
    return await instance.get(`${nameModel}/getAllSpec/${id}`);
  },
};
export default clinicApi;
