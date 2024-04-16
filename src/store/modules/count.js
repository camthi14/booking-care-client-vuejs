import { bookingApi, clinicApi, serviceApi, userApi } from "@/apis";
import { toast } from "vue3-toastify";
import { countActionTypes, countMutationTypes } from "../types/countType";

const state = () => ({
  countAll: -1,
  countCancel: -1,
  countComplete: -1,
  countSuccess: -1,
  countUser: -1,
  countDoctor: -1,
  countClinic: -1,
  countService: -1,
});

const mutations = {
  [countMutationTypes.SUCCEED]: (state) => {
    state.isLoading = false;
  },
  [countMutationTypes.START]: (state) => {
    state.isLoading = true;
  },
  [countMutationTypes.GET_SUCCESS]: (state, payload) => {
    state.isLoading = false;
    state.countAll = payload.countAll;
    state.countCancel = payload.countCancel;
    state.countComplete = payload.countComplete;
    state.countSuccess = payload.countSuccess;
    state.countUser = payload.countUser;
    state.countDoctor = payload.countDoctor;
    state.countClinic = payload.countClinic;
    state.countService = payload.countService;
  },
  [countMutationTypes.FAILED]: (state, error) => {
    state.isLoading = false;
    state.error = error;
    toast.error(error);
  },
};

const actions = {
  [countActionTypes.GET_COUNT]: async ({ commit }) => {
    try {
      commit(countMutationTypes.START);

      const [
        countAll,
        countCancel,
        countComplete,
        countSuccess,
        countUser,
        countDoctor,
        countClinic,
        countService,
      ] = await Promise.all([
        bookingApi.getBookingCount(),
        bookingApi.getBookingCount("cancel"),
        bookingApi.getBookingCount("complete"),
        bookingApi.getBookingCount("succeeded"),
        userApi.getUserCount(),
        userApi.getUserCount("DOCTOR"),
        clinicApi.getClinicCount(),
        serviceApi.getServiceCount(),
      ]);

      if (
        (countAll && countAll.data) ||
        (countCancel && countCancel.data) ||
        (countComplete && countComplete.data) ||
        (countSuccess && countSuccess.data) ||
        (countUser && countUser.data) ||
        (countDoctor && countDoctor.data) ||
        (countClinic && countClinic.data) ||
        (countService && countService.data)
      ) {
        commit(countMutationTypes.GET_SUCCESS, {
          countAll: countAll.data,
          countCancel: countCancel.data,
          countComplete: countComplete.data,
          countSuccess: countSuccess.data,
          countUser: countUser.data,
          countDoctor: countDoctor.data,
          countClinic: countClinic.data,
          countService: countService.data,
        });
      }
    } catch (error) {
      if (error.response) {
        commit(countMutationTypes.FAILED, error.response.data.message);
      } else {
        commit(countMutationTypes.FAILED, error.message);
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
