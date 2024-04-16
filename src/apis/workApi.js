import instance from "./axios";

const nameModel = "/works";

const workApi = {
  getAll: async (filters = {}) => {
    return await instance.get(nameModel, {
      params: filters,
    });
  },
  create: async (data) => {
    return await instance.post(nameModel, data);
  },
};
export default workApi;
