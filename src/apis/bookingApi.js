import instance from "./axios";

const nameModel = "/bookings";

const scheduleApi = {
  getAll: async (filters = {}) => {
    return await instance.get(nameModel, {
      params: filters,
    });
  },
  getById: async (id) => {
    return await instance.get(`${nameModel}/${id}`);
  },
  getBookingCount: async (status = "") => {
    let url = `${nameModel}/countBooking`;

    if (status) {
      url = `${nameModel}/countBooking?status=${status}`;
    }

    return await instance.get(url);
  },
  create: async (data = {}) => {
    return await instance.post(nameModel, data);
  },
  transferStatus: async ({ id, data }) => {
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
