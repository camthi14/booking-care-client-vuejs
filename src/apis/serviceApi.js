import instance from "./axios";

const nameModel = "/use_services";

const servicerApi = {
  getAll: async (filters = {}) => {
    return await instance.get(nameModel, {
      params: filters,
    });
  },
  getFilter: async (filters = {}) => {
    return await instance.get(nameModel + "/filterService", {
      params: filters,
    });
  },
  getById: async (id) => {
    return await instance.get(`${nameModel}/${id}`);
  },
  getServiceCount: async () => {
    let url = `${nameModel}/countService`;
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
};
export default servicerApi;
