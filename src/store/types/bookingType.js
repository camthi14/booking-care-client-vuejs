const bookingMutationTypes = {
  START: "START",
  GET_ALL_SUCCESS: "GET_ALL_SUCCESS",
  SUCCEED: "SUCCEED",
  FAILED: "FAILED",
  SET_FILTER: "SET_FILTER",
};

const bookingActionTypes = {
  FETCH_ALL_BOOKING: "FETCH_ALL_BOOKING",
  FETCH_CREATE_BOOKING: "FETCH_CREATE_BOOKING",
  FETCH_UPDATE_BOOKING: "FETCH_UPDATE_BOOKING",
  CHANGE_FILTER: "CHANGE_FILTER",
};

/**
 *
 * @param {string} action
 * @returns
 */
function bookingActions(action) {
  return `booking/${action}`;
}

export { bookingActionTypes, bookingMutationTypes, bookingActions };
