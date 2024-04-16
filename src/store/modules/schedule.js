import _ from "lodash";
import router from "@/router";
import { scheduleApi, workApi } from "@/apis";
import { format } from "date-fns";
import { toast } from "vue3-toastify";
import {
  appActions,
  appActionTypes,
  scheduleActionTypes,
  scheduleMutationTypes,
} from "../types";

const state = () => ({
  schedules: [],
  works: [],
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
  [scheduleMutationTypes.SUCCEED]: (state) => {
    state.isLoading = false;
  },
  [scheduleMutationTypes.START]: (state) => {
    state.isLoading = true;
  },
  [scheduleMutationTypes.GET_ALL_SUCCESS]: (state, payload) => {
    state.isLoading = false;
    state.schedules = payload;
  },
  [scheduleMutationTypes.GET_WORK]: (state, payload) => {
    state.isLoading = false;
    state.works = payload;
  },
  [scheduleMutationTypes.FAILED]: (state, error) => {
    state.isLoading = false;
    state.error = error;
    toast.error(error);
  },
  [scheduleMutationTypes.SET_FILTER]: (state, payload) => {
    state.filters = {
      ...state.filters,
      ...payload,
    };
  },
};

const actions = {
  [scheduleActionTypes.GET_WORK]: async ({ commit }, filters) => {
    try {
      commit(scheduleMutationTypes.START);

      const response = await workApi.getAll(filters);

      if (response && response.data) {
        commit(scheduleMutationTypes.GET_WORK, response.data);
      }
    } catch (error) {
      if (error.response) {
        commit(scheduleMutationTypes.FAILED, error.response.data.message);
      } else {
        commit(scheduleMutationTypes.FAILED, error.message);
      }
    }
  },
  [scheduleActionTypes.FETCH_ALL_SCHEDULE]: async ({ commit }, filters) => {
    try {
      commit(scheduleMutationTypes.START);

      const response = await scheduleApi.getAll(filters);

      if (response && response.data) {
        commit(scheduleMutationTypes.GET_ALL_SUCCESS, response.data);
      }
    } catch (error) {
      if (error.response) {
        commit(scheduleMutationTypes.FAILED, error.response.data.message);
      } else {
        commit(scheduleMutationTypes.FAILED, error.message);
      }
    }
  },
  [scheduleActionTypes.FETCH_CREATE_SCHEDULE]: async (
    { commit, dispatch },
    payload
  ) => {
    try {
      commit(scheduleMutationTypes.START);

      const response = await scheduleApi.create(payload);

      if (response && response.data) {
        dispatch(appActions(appActionTypes.SET_OVERLAY), false, { root: true });
        commit(scheduleMutationTypes.SUCCEED);
        toast.success("Tạo lịch khám thành công!");
        router.push("/manager/doctor/schedule");
      }
    } catch (error) {
      dispatch(appActions(appActionTypes.SET_OVERLAY), false, { root: true });

      if (error.response) {
        commit(scheduleMutationTypes.FAILED, error.response.data.message);
      } else {
        commit(scheduleMutationTypes.FAILED, error.message);
      }
    }
  },
  [scheduleActionTypes.FETCH_DELETE_SCHEDULE]: async (
    { commit, dispatch },
    payload
  ) => {
    try {
      commit(scheduleMutationTypes.START);

      const response = await scheduleApi.deleteById(payload.id);

      if (response && response.data) {
        commit(scheduleMutationTypes.SUCCEED);
        dispatch(scheduleActionTypes.FETCH_ALL_SCHEDULE, {
          works: payload.works,
        });
        toast.success("Xoá lịch khám thành công!");
      }
    } catch (error) {
      if (error.response) {
        commit(scheduleMutationTypes.FAILED, error.response.data.message);
      } else {
        commit(scheduleMutationTypes.FAILED, error.message);
      }
    }
  },
  [scheduleActionTypes.FETCH_UPDATE_SCHEDULE]: async (
    { commit, dispatch },
    payload
  ) => {
    try {
      commit(scheduleMutationTypes.START);

      const response = await scheduleApi.update(payload);

      if (response && response.data) {
        dispatch(appActions(appActionTypes.SET_OVERLAY), false, { root: true });
        commit(scheduleMutationTypes.SUCCEED);
        toast.success("Cập nhật lịch khám thành công!");
        router.push("/manager/doctor/schedule");
      }
    } catch (error) {
      dispatch(appActions(appActionTypes.SET_OVERLAY), false, { root: true });

      if (error.response) {
        commit(scheduleMutationTypes.FAILED, error.response.data.message);
      } else {
        commit(scheduleMutationTypes.FAILED, error.message);
      }
    }
  },
};

const getters = {
  getAllSchedules: (state) => {
    return state.schedules?.map((data) => {
      const specialties = data.specialties.map((specialty) => {
        const calendar = Boolean(specialty.calendar?.length);

        if (!calendar) return specialty;

        const data = specialty.calendar
          ?.map((c) => {
            const date = new Date(c.schedule_day);
            const result = format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
            const newDate = new Date(result);

            return {
              day: newDate.getDate(),
              month: newDate.getMonth() + 1,
              year: newDate.getFullYear(),
              fullName: `${c.last_name} ${c.first_name}`,
              doctorId: `${c.user_id}`,
              avatar: `${c.avatar}`,
              schedule_id: c.schedule_id,
            };
          })
          .reduce((obj, value) => {
            let result = {
              ...obj,
            };

            if (obj[`${value.day}/${value.month}`]?.length) {
              result = {
                ...result,
                [`${value.day}/${value.month}`]: [
                  ...obj[`${value.day}/${value.month}`],
                  value,
                ],
              };
            } else {
              result = {
                ...result,
                [`${value.day}/${value.month}`]: [value],
              };
            }
            return result;
          }, {});

        return {
          ...specialty,
          calendar: _.cloneDeep(data),
        };
      });

      return {
        ...data,
        specialties: _.cloneDeep(specialties),
      };
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
