const serviceMutationTypes = {
  START: "START",
  GET_ALL_SUCCESS: "GET_ALL_SUCCESS",
  SUCCEED: "SUCCEED",
  FAILED: "FAILED",
  SET_FILTER: "SET_FILTER",
  GET_FILTER: "GET_FILTER",
  SET_FILTER_DATA: "SET_FILTER_DATA",
};

const serviceActionTypes = {
  FETCH_ALL_SERVICE: "FETCH_ALL_SERVICE",
  FETCH_CREATE_SERVICE: "FETCH_CREATE_SERVICE",
  FETCH_UPDATE_SERVICE: "FETCH_UPDATE_SERVICE",
  FETCH_DELETE_SERVICE: "FETCH_DELETE_SERVICE",
  CHANGE_FILTER: "CHANGE_FILTER",
  GET_FILTER: "GET_FILTER",
  RESET_DATA_FILTER: "RESET_DATA_FILTER",
};

/**
 *
 * @param {string} action
 * @returns
 */
function serviceActions(action) {
  return `service/${action}`;
}

export { serviceActionTypes, serviceMutationTypes, serviceActions };
