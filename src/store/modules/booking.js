import { bookingApi } from "@/apis";
import { toast } from "vue3-toastify";
import {
  appActionTypes,
  appActions,
  bookingActionTypes,
  bookingMutationTypes,
  countActionTypes,
  countActions,
} from "../types";
import router from "@/router";

const state = () => ({
  bookings: [],
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
  [bookingMutationTypes.SUCCEED]: (state) => {
    state.isLoading = false;
  },
  [bookingMutationTypes.START]: (state) => {
    state.isLoading = true;
  },
  [bookingMutationTypes.GET_ALL_SUCCESS]: (state, payload) => {
    state.isLoading = false;
    state.bookings = payload.result;
    state.pagination = {
      ...state.pagination,
      ...payload.pagination,
    };
  },
  [bookingMutationTypes.FAILED]: (state, error) => {
    state.isLoading = false;
    state.error = error;
    toast.error(error);
  },
  [bookingMutationTypes.SET_FILTER]: (state, payload) => {
    state.filters = {
      ...state.filters,
      ...payload,
    };
  },
};

const actions = {
  [bookingActionTypes.FETCH_ALL_BOOKING]: async ({ commit }, filters) => {
    try {
      commit(bookingMutationTypes.START);

      const response = await bookingApi.getAll(filters);

      if (response && response.data) {
        commit(bookingMutationTypes.GET_ALL_SUCCESS, response.data);
      }
    } catch (error) {
      if (error.response) {
        commit(bookingMutationTypes.FAILED, error.response.data.message);
      } else {
        commit(bookingMutationTypes.FAILED, error.message);
      }
    }
  },
  [bookingActionTypes.FETCH_CREATE_BOOKING]: async ({ commit, dispatch }, payload) => {
    try {
      commit(bookingMutationTypes.START);

      const response = await bookingApi.create(payload);

      if (response && response.data) {
        dispatch(appActions(appActionTypes.SET_OVERLAY), false, { root: true });
        commit(bookingMutationTypes.SUCCEED);

        if (payload.payments === "online") {
          window.location.href = response.data;
          return;
        }

        toast.success("Đặt lịch khám thành công!");
        router.push({
          name: "return.success",
        });
      }
    } catch (error) {
      dispatch(appActions(appActionTypes.SET_OVERLAY), false, { root: true });

      if (error.response) {
        commit(bookingMutationTypes.FAILED, error.response.data.message);
      } else {
        commit(bookingMutationTypes.FAILED, error.message);
      }
    }
  },
  [bookingActionTypes.FETCH_UPDATE_BOOKING]: async ({ commit, dispatch }, payload) => {
    try {
      const { where, page = 1, limit = 100, ...otherPayload } = payload;

      commit(bookingMutationTypes.START);

      const response = await bookingApi.transferStatus(otherPayload);

      if (response && response.data) {
        commit(bookingMutationTypes.SUCCEED);

        const whereBy = { where, page, limit } || {};

        dispatch(bookingActionTypes.FETCH_ALL_BOOKING, { ...whereBy });
        dispatch(appActions(appActionTypes.SET_OVERLAY), false, { root: true });
        dispatch(countActions(countActionTypes.GET_COUNT), null, {
          root: true,
        });
      }
    } catch (error) {
      dispatch(appActions(appActionTypes.SET_OVERLAY), false, { root: true });

      if (error.response) {
        commit(bookingMutationTypes.FAILED, error.response.data.message);
      } else {
        commit(bookingMutationTypes.FAILED, error.message);
      }
    }
  },
  [bookingActionTypes.CHANGE_FILTER]: ({ commit }, payload) => {
    commit(bookingMutationTypes.SET_FILTER, payload);
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
