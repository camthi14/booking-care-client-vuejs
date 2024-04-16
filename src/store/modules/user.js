import userApi from "@/apis/userApi";
import router from "@/router";
import { toast } from "vue3-toastify";
import {
  appActions,
  appActionTypes,
  authActions,
  authActionTypes,
  userActionTypes,
  userMutationTypes,
} from "../types";

const state = () => ({
  users: [],
  doctors: {
    data: [],
    filters: {
      page: 1,
      limit: 4,
    },
    pagination: {
      page: 1,
      limit: 4,
      totalPage: 4,
    },
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
  [userMutationTypes.SUCCEED]: (state) => {
    state.isLoading = false;
  },
  [userMutationTypes.START]: (state) => {
    state.isLoading = true;
  },
  [userMutationTypes.GET_ALL_SUCCESS]: (state, payload) => {
    state.isLoading = false;
    state.users = payload.result;
    state.pagination = {
      ...state.pagination,
      ...payload.pagination,
    };
  },
  [userMutationTypes.GET_DOCTOR_SUCCEED]: (state, payload) => {
    state.isLoading = false;
    state.doctors.data = payload.result;
    state.doctors.pagination = {
      ...state.doctors.pagination,
      ...payload.pagination,
    };
  },
  [userMutationTypes.FAILED]: (state, error) => {
    state.isLoading = false;
    state.error = error;
    toast.error(error);
  },
  [userMutationTypes.SET_FILTER]: (state, payload) => {
    state.filters = {
      ...state.filters,
      ...payload,
    };
  },
  [userMutationTypes.SET_FILTER_DOCTOR]: (state, payload) => {
    state.doctors.filters = {
      ...state.doctors.filters,
      ...payload,
    };
  },
};

const actions = {
  [userActionTypes.FETCH_ALL_USER]: async ({ commit }, filters) => {
    try {
      commit(userMutationTypes.START);

      const response = await userApi.getAll(filters);

      if (response && response.data) {
        commit(userMutationTypes.GET_ALL_SUCCESS, response.data);
      }
    } catch (error) {
      if (error.response) {
        commit(userMutationTypes.FAILED, error.response.data.message);
      } else {
        commit(userMutationTypes.FAILED, error.message);
      }
    }
  },

  [userActionTypes.GET_DOCTOR]: async ({ commit }, filters) => {
    try {
      commit(userMutationTypes.START);

      const response = await userApi.getDoctor(filters);

      if (response && response.data) {
        commit(userMutationTypes.GET_DOCTOR_SUCCEED, response.data);
      }
    } catch (error) {
      if (error.response) {
        commit(userMutationTypes.FAILED, error.response.data.message);
      } else {
        commit(userMutationTypes.FAILED, error.message);
      }
    }
  },

  [userActionTypes.FETCH_CREATE_USER]: async (
    { commit, dispatch },
    payload
  ) => {
    try {
      commit(userMutationTypes.START);

      const response = await userApi.create(payload);

      if (response) {
        commit(userMutationTypes.SUCCEED);
        toast.success("Thêm bác sĩ thành công!");
        dispatch(appActions(appActionTypes.SET_OVERLAY), false, {
          root: true,
        });
        router.push({ path: "/manager/doctor" });
      }
    } catch (error) {
      dispatch(appActions(appActionTypes.SET_OVERLAY), false, { root: true });

      if (error.response) {
        commit(userMutationTypes.FAILED, error.response.data.message);
      } else {
        commit(userMutationTypes.FAILED, error.message);
      }
    }
  },

  [userActionTypes.FETCH_UPDATE_DOCTOR]: async (
    { commit, dispatch },
    payload
  ) => {
    try {
      commit(userMutationTypes.START);

      const response = await userApi.update(payload);

      if (response) {
        commit(userMutationTypes.SUCCEED);
        toast.success("Cập nhật bác sĩ thành công!");

        dispatch(appActions(appActionTypes.SET_OVERLAY), false, {
          root: true,
        });
        router.push({ path: "/manager/doctor" });
      }
    } catch (error) {
      dispatch(appActions(appActionTypes.SET_OVERLAY), false, { root: true });

      if (error.response) {
        commit(userMutationTypes.FAILED, error.response.data.message);
      } else {
        commit(userMutationTypes.FAILED, error.message);
      }
    }
  },

  [userActionTypes.FETCH_UPDATE_USER]: async (
    { commit, dispatch },
    payload
  ) => {
    try {
      commit(userMutationTypes.START);

      const { accessToken, ...otherPayload } = payload;

      const response = await userApi.update(otherPayload);

      if (response) {
        commit(userMutationTypes.SUCCEED);
        toast.success("Cập nhật thông tin thành công!");

        dispatch(appActions(appActionTypes.SET_OVERLAY), false, {
          root: true,
        });

        if (accessToken) {
          dispatch(
            authActions(authActionTypes.GET_CURRENT_USER),
            {
              accessToken,
            },
            { root: true }
          );
        }
      }
    } catch (error) {
      dispatch(appActions(appActionTypes.SET_OVERLAY), false, { root: true });

      if (error.response) {
        commit(userMutationTypes.FAILED, error.response.data.message);
      } else {
        commit(userMutationTypes.FAILED, error.message);
      }
    }
  },

  [userActionTypes.FETCH_DELETE_USER]: async (
    { commit, dispatch, state },
    payload
  ) => {
    try {
      commit(userMutationTypes.START);

      const response = await userApi.deleteById(payload);

      if (response) {
        commit(userMutationTypes.SUCCEED);
        toast.success("Xoá bác sĩ thành công!");
        dispatch(appActions(appActionTypes.SET_OVERLAY), false, {
          root: true,
        });

        dispatch(userActionTypes.GET_DOCTOR, {
          ...state.filters,
          page: 1,
        });
      }
    } catch (error) {
      dispatch(appActions(appActionTypes.SET_OVERLAY), false, { root: true });

      if (error.response) {
        commit(userMutationTypes.FAILED, error.response.data.message);
      } else {
        commit(userMutationTypes.FAILED, error.message);
      }
    }
  },

  [userActionTypes.CHANGE_FILTER]: ({ commit }, payload) => {
    commit(userMutationTypes.SET_FILTER, payload);
  },

  [userActionTypes.CHANGE_FILTER_DOCTOR]: ({ commit }, payload) => {
    commit(userMutationTypes.SET_FILTER_DOCTOR, payload);
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
