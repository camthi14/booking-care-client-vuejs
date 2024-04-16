import instance from "./axios";

const nameModel = "/users";

const userApi = {
  getAll: async (filters = {}) => {
    return await instance.get(nameModel, {
      params: filters,
    });
  },
  getDoctor: async (filters = {}) => {
    return await instance.get(nameModel + "/doctors", {
      params: filters,
    });
  },
  getDoctorById: async (id) => {
    return await instance.get(`${nameModel + "/doctors"}/${id}`);
  },
  getById: async (id) => {
    return await instance.get(`${nameModel}/${id}`);
  },
  getUserCount: async (role = "") => {
    let url = `${nameModel}/count`;

    if (role) {
      url = `${nameModel}/count?role=${role}`;
    }

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
export default userApi;
