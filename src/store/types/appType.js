const appMutationTypes = {
  SET_OVERLAY: "SET_OVERLAY",
  SET_SNACKBAR: "SET_SNACKBAR",
};

const appActionTypes = {
  SET_OVERLAY: "SET_OVERLAY",
  SET_SNACKBAR: "SET_SNACKBAR",
};

/**
 *
 * @param {string} action
 * @returns
 */
function appActions(action) {
  return `app/${action}`;
}

export { appActionTypes, appMutationTypes, appActions };
