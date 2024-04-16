import clinicApi from "@/apis/clinicApi";
import router from "@/router";
import { toast } from "vue3-toastify";
import {
  appActions,
  appActionTypes,
  clinicActionTypes,
  clinicMutationTypes,
} from "../types";

const state = () => ({
  clinics: [],
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
  [clinicMutationTypes.SUCCEED]: (state) => {
    state.isLoading = false;
  },
  [clinicMutationTypes.START]: (state) => {
    state.isLoading = true;
  },
  [clinicMutationTypes.GET_ALL_SUCCESS]: (state, payload) => {
    state.isLoading = false;
    state.clinics = payload.result;
    state.pagination = {
      ...state.pagination,
      ...payload.pagination,
    };
  },
  [clinicMutationTypes.GET_ALL_SPECIALTY_SUCCESS]: (state, payload) => {
    state.isLoading = false;
    state.specialties = payload;
  },
  [clinicMutationTypes.FAILED]: (state, error) => {
    state.isLoading = false;
    state.error = error;
    toast.error(error);
  },
  [clinicMutationTypes.SET_FILTER]: (state, payload) => {
    state.filters = {
      ...state.filters,
      ...payload,
    };
  },
};

const actions = {
  [clinicActionTypes.FETCH_ALL_CLINIC]: async ({ commit }, filters) => {
    try {
      commit(clinicMutationTypes.START);

      const response = await clinicApi.getAll(filters);

      if (response && response.data) {
        commit(clinicMutationTypes.GET_ALL_SUCCESS, response.data);
      }
    } catch (error) {
      if (error.response) {
        commit(clinicMutationTypes.FAILED, error.response.data.message);
      } else {
        commit(clinicMutationTypes.FAILED, error.message);
      }
    }
  },
  [clinicActionTypes.FETCH_ALL_SPECIALTY_CLINIC]: async (
    { commit },
    payload
  ) => {
    try {
      commit(clinicMutationTypes.START);

      const response = await clinicApi.getAllSpecialtyClinic(payload);

      if (response && response.data) {
        commit(clinicMutationTypes.GET_ALL_SPECIALTY_SUCCESS, response.data);
      }
    } catch (error) {
      if (error.response) {
        commit(clinicMutationTypes.FAILED, error.response.data.message);
      } else {
        commit(clinicMutationTypes.FAILED, error.message);
      }
    }
  },

  [clinicActionTypes.FETCH_CREATE_CLINIC]: async (
    { commit, dispatch },
    payload
  ) => {
    try {
      commit(clinicMutationTypes.START);

      const response = await clinicApi.create(payload);

      if (response && response.data) {
        commit(clinicMutationTypes.SUCCEED);
        toast.success("Thêm thành công!");
        dispatch(appActions(appActionTypes.SET_OVERLAY), false, {
          root: true,
        });
        router.push({ path: "/manager/clinic" });
      }
    } catch (error) {
      dispatch(appActions(appActionTypes.SET_OVERLAY), false, { root: true });

      if (error.response) {
        commit(clinicMutationTypes.FAILED, error.response.data.message);
      } else {
        commit(clinicMutationTypes.FAILED, error.message);
      }
    }
  },

  [clinicActionTypes.FETCH_UPDATE_CLINIC]: async (
    { commit, dispatch },
    payload
  ) => {
    try {
      commit(clinicMutationTypes.START);

      const response = await clinicApi.update(payload);

      if (response && response.data) {
        commit(clinicMutationTypes.SUCCEED);
        toast.success("Cập nhật thành công!");
        dispatch(appActions(appActionTypes.SET_OVERLAY), false, {
          root: true,
        });
        router.push({ path: "/manager/clinic" });
      }
    } catch (error) {
      dispatch(appActions(appActionTypes.SET_OVERLAY), false, { root: true });

      if (error.response) {
        commit(clinicMutationTypes.FAILED, error.response.data.message);
      } else {
        commit(clinicMutationTypes.FAILED, error.message);
      }
    }
  },

  [clinicActionTypes.CHANGE_FILTER]: ({ commit }, payload) => {
    commit(clinicMutationTypes.SET_FILTER, payload);
  },

  [clinicActionTypes.FETCH_DELETE_CLINIC]: async (
    { commit, dispatch, state },
    payload
  ) => {
    try {
      commit(clinicMutationTypes.START);

      const response = await clinicApi.deleteById(payload);

      if (response && response.data) {
        commit(clinicMutationTypes.SUCCEED);
        toast.success("Xoá thành công!");

        dispatch(appActions(appActionTypes.SET_OVERLAY), false, {
          root: true,
        });
        dispatch(clinicActionTypes.FETCH_ALL_CLINIC, {
          ...state.filters,
          page: 1,
        });
      }
    } catch (error) {
      dispatch(appActions(appActionTypes.SET_OVERLAY), false, { root: true });

      if (error.response) {
        commit(clinicMutationTypes.FAILED, error.response.data.message);
      } else {
        commit(clinicMutationTypes.FAILED, error.message);
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
