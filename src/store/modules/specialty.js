import specialtyApi from "@/apis/specialtyApi";
import router from "@/router";
import { toast } from "vue3-toastify";
import {
  appActions,
  appActionTypes,
  specialtyActionTypes,
  specialtyMutationTypes,
} from "../types";

const state = () => ({
  specialties: [],
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
  [specialtyMutationTypes.SUCCEED]: (state) => {
    state.isLoading = false;
  },
  [specialtyMutationTypes.START]: (state) => {
    state.isLoading = true;
  },
  [specialtyMutationTypes.GET_ALL_SUCCESS]: (state, payload) => {
    state.isLoading = false;
    state.specialties = payload.result;
    state.pagination = {
      ...state.pagination,
      ...payload.pagination,
    };
  },
  [specialtyMutationTypes.FAILED]: (state, error) => {
    state.isLoading = false;
    state.error = error;
    toast.error(error);
  },
  [specialtyMutationTypes.SET_FILTER]: (state, payload) => {
    state.filters = {
      ...state.filters,
      ...payload,
    };
  },
};

const actions = {
  [specialtyActionTypes.FETCH_ALL_SPECIALTY]: async ({ commit }, filters) => {
    try {
      commit(specialtyMutationTypes.START);

      const response = await specialtyApi.getAll(filters);

      if (response && response.data) {
        commit(specialtyMutationTypes.GET_ALL_SUCCESS, response.data);
      }
    } catch (error) {
      if (error.response) {
        commit(specialtyMutationTypes.FAILED, error.response.data.message);
      } else {
        commit(specialtyMutationTypes.FAILED, error.message);
      }
    }
  },

  [specialtyActionTypes.FETCH_CREATE_SPECIALTY]: async (
    { commit, dispatch },
    payload
  ) => {
    try {
      commit(specialtyMutationTypes.START);

      const response = await specialtyApi.create(payload);

      if (response && response.data) {
        commit(specialtyMutationTypes.SUCCEED);
        toast.success("Thêm chuyên khoa thành công!");
        dispatch(appActions(appActionTypes.SET_OVERLAY), false, {
          root: true,
        });
        router.push({ path: "/manager/specialty" });
      }
    } catch (error) {
      dispatch(appActions(appActionTypes.SET_OVERLAY), false, { root: true });

      if (error.response) {
        commit(specialtyMutationTypes.FAILED, error.response.data.message);
      } else {
        commit(specialtyMutationTypes.FAILED, error.message);
      }
    }
  },

  [specialtyActionTypes.FETCH_UPDATE_SPECIALTY]: async (
    { commit, dispatch },
    payload
  ) => {
    try {
      commit(specialtyMutationTypes.START);

      const response = await specialtyApi.update(payload);

      if (response && response.data) {
        commit(specialtyMutationTypes.SUCCEED);
        toast.success("Cập nhật chuyên khoa thành công!");
        dispatch(appActions(appActionTypes.SET_OVERLAY), false, {
          root: true,
        });
        router.push({ path: "/manager/specialty" });
      }
    } catch (error) {
      dispatch(appActions(appActionTypes.SET_OVERLAY), false, { root: true });

      if (error.response) {
        commit(specialtyMutationTypes.FAILED, error.response.data.message);
      } else {
        commit(specialtyMutationTypes.FAILED, error.message);
      }
    }
  },

  [specialtyActionTypes.CHANGE_FILTER]: ({ commit }, payload) => {
    commit(specialtyMutationTypes.SET_FILTER, payload);
  },

  [specialtyActionTypes.FETCH_DELETE_SPECIALTY]: async (
    { commit, dispatch, state },
    payload
  ) => {
    try {
      commit(specialtyMutationTypes.START);

      const response = await specialtyApi.deleteById(payload);

      if (response) {
        commit(specialtyMutationTypes.SUCCEED);
        toast.success("Xoá chuyên khoa thành công!");
        dispatch(appActions(appActionTypes.SET_OVERLAY), false, {
          root: true,
        });
        dispatch(specialtyActionTypes.FETCH_ALL_SPECIALTY, {
          ...state.filters,
          page: 1,
        });
      }
    } catch (error) {
      dispatch(appActions(appActionTypes.SET_OVERLAY), false, { root: true });

      if (error.response) {
        commit(specialtyMutationTypes.FAILED, error.response.data.message);
      } else {
        commit(specialtyMutationTypes.FAILED, error.message);
      }
    }
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
