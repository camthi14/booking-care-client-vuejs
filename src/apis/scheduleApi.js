import instance from "./axios";

const nameModel = "/schedules";

const scheduleApi = {
  getAll: async (filters = {}) => {
    return await instance.get(nameModel, {
      params: filters,
    });
  },
  getById: async (id) => {
    return await instance.get(`${nameModel}/${id}`);
  },
  create: async (data = {}) => {
    return await instance.post(nameModel, data);
  },
  update: async ({ id, data }) => {
    return await instance.patch(`${nameModel}/${id}`, data);
  },
  delete: async () => {
    return await instance.delete(`${nameModel}`);
  },
  deleteById: async (id) => {
    return await instance.delete(`${nameModel}/${id}`);
  },
};
export default scheduleApi;
