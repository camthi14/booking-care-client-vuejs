const scheduleMutationTypes = {
  START: "START",
  GET_ALL_SUCCESS: "GET_ALL_SUCCESS",
  SUCCEED: "SUCCEED",
  FAILED: "FAILED",
  SET_FILTER: "SET_FILTER",
  GET_WORK: "GET_WORK",
};

const scheduleActionTypes = {
  FETCH_ALL_SCHEDULE: "FETCH_ALL_SCHEDULE",
  FETCH_CREATE_SCHEDULE: "FETCH_CREATE_SCHEDULE",
  FETCH_UPDATE_SCHEDULE: "FETCH_UPDATE_SCHEDULE",
  FETCH_DELETE_SCHEDULE: "FETCH_DELETE_SCHEDULE",
  CHANGE_FILTER: "CHANGE_FILTER",
  GET_WORK: "GET_WORK",
};

/**
 *
 * @param {string} action
 * @returns
 */
function scheduleActions(action) {
  return `schedule/${action}`;
}

export { scheduleActionTypes, scheduleMutationTypes, scheduleActions };
