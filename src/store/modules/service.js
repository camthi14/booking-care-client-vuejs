import serviceApi from "@/apis/serviceApi";
import router from "@/router";
import { toast } from "vue3-toastify";

import {
  appActions,
  appActionTypes,
  serviceActionTypes,
  serviceMutationTypes,
} from "../types";

const state = () => ({
  services: [],
  filterService: {
    data: [],
  },
  isLoading: false,
  error: "",
  filters: {
    page: 1,
    limit: 4,
  },
  pagination: {
    page: 1,
    limit: 4,
    totalPage: 4,
  },
});

const mutations = {
  [serviceMutationTypes.SUCCEED]: (state) => {
    state.isLoading = false;
  },
  [serviceMutationTypes.START]: (state) => {
    state.isLoading = true;
  },
  [serviceMutationTypes.GET_ALL_SUCCESS]: (state, payload) => {
    state.isLoading = false;
    state.services = payload.result;
    state.pagination = {
      ...state.pagination,
      ...payload.pagination,
    };
  },
  [serviceMutationTypes.GET_FILTER]: (state, payload) => {
    state.isLoading = false;
    state.filterService.data = payload;
  },
  [serviceMutationTypes.FAILED]: (state, error) => {
    state.isLoading = false;
    state.error = error;
    toast.error(error);
  },
  [serviceMutationTypes.SET_FILTER]: (state, payload) => {
    state.filters = {
      ...state.filters,
      ...payload,
    };
  },
  [serviceMutationTypes.SET_FILTER_DATA]: (state, payload) => {
    state.filterService.data = payload;
  },
};

const actions = {
  [serviceActionTypes.FETCH_ALL_SERVICE]: async ({ commit }, filters) => {
    try {
      commit(serviceMutationTypes.START);

      const response = await serviceApi.getAll(filters);

      if (response && response.data) {
        commit(serviceMutationTypes.GET_ALL_SUCCESS, response.data);
      }
    } catch (error) {
      if (error.response) {
        commit(serviceMutationTypes.FAILED, error.response.data.message);
      } else {
        commit(serviceMutationTypes.FAILED, error.message);
      }
    }
  },

  [serviceActionTypes.GET_FILTER]: async ({ commit, dispatch }, filters) => {
    try {
      commit(serviceMutationTypes.START);

      const response = await serviceApi.getFilter(filters);

      if (response && response.data) {
        if (!response.data?.length) {
          toast.error("Không tìm thấy gói dịch vụ!");

          dispatch(appActions(appActionTypes.SET_OVERLAY), false, {
            root: true,
          });
        } else {
          toast.success("Kết quả tìm kiếm thành công!");
          dispatch(appActions(appActionTypes.SET_OVERLAY), false, {
            root: true,
          });

          commit(serviceMutationTypes.GET_FILTER, response.data);
        }
      }
    } catch (error) {
      dispatch(appActions(appActionTypes.SET_OVERLAY), false, { root: true });

      if (error.response) {
        commit(serviceMutationTypes.FAILED, error.response.data.message);
      } else {
        commit(serviceMutationTypes.FAILED, error.message);
      }
    }
  },

  [serviceActionTypes.FETCH_CREATE_SERVICE]: async (
    { commit, dispatch },
    payload
  ) => {
    try {
      commit(serviceMutationTypes.START);

      const response = await serviceApi.create(payload);
      if (response && response.data) {
        commit(serviceMutationTypes.SUCCEED);
        toast.success("Thêm gói dịch vụ thành công!");

        dispatch(appActions(appActionTypes.SET_OVERLAY), false, {
          root: true,
        });
        router.push({ path: "/manager/service" });
      }
    } catch (error) {
      dispatch(appActions(appActionTypes.SET_OVERLAY), false, { root: true });

      if (error.response) {
        commit(serviceMutationTypes.FAILED, error.response.data.message);
      } else {
        commit(serviceMutationTypes.FAILED, error.message);
      }
    }
  },

  [serviceActionTypes.FETCH_UPDATE_SERVICE]: async (
    { commit, dispatch },
    payload
  ) => {
    try {
      commit(serviceMutationTypes.START);

      const response = await serviceApi.update(payload);

      if (response && response.data) {
        commit(serviceMutationTypes.SUCCEED);
        toast.success("Cập nhật gói dịch vụ thành công!");

        dispatch(appActions(appActionTypes.SET_OVERLAY), false, {
          root: true,
        });
        router.push({ path: "/manager/service" });
      }
    } catch (error) {
      dispatch(appActions(appActionTypes.SET_OVERLAY), false, { root: true });

      if (error.response) {
        commit(serviceMutationTypes.FAILED, error.response.data.message);
      } else {
        commit(serviceMutationTypes.FAILED, error.message);
      }
    }
  },

  [serviceActionTypes.CHANGE_FILTER]: ({ commit }, payload) => {
    commit(serviceMutationTypes.SET_FILTER, payload);
  },

  [serviceActionTypes.FETCH_DELETE_SERVICE]: async (
    { commit, dispatch, state },
    payload
  ) => {
    try {
      commit(serviceMutationTypes.START);

      const response = await serviceApi.deleteById(payload);

      if (response && response.data) {
        commit(serviceMutationTypes.SUCCEED);
        toast.success("Xoá gói dịch vụ thành công!");
        dispatch(appActions(appActionTypes.SET_OVERLAY), false, {
          root: true,
        });

        dispatch(serviceActionTypes.FETCH_ALL_SERVICE, {
          ...state.filters,
          page: 1,
        });
      }
    } catch (error) {
      dispatch(appActions(appActionTypes.SET_OVERLAY), false, { root: true });

      if (error.response) {
        commit(serviceMutationTypes.FAILED, error.response.data.message);
      } else {
        commit(serviceMutationTypes.FAILED, error.message);
      }
    }
  },

  [serviceActionTypes.RESET_DATA_FILTER]: ({ commit }) => {
    commit(serviceMutationTypes.SET_FILTER_DATA, []);
  },
};

const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
