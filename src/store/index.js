import { createStore } from "vuex";
import user from "../store/modules/user";
import auth from "../store/modules/auth";
import app from "../store/modules/app";
import clinic from "../store/modules/clinic";
import specialty from "../store/modules/specialty";
import service from "../store/modules/service";
import schedule from "./modules/schedule";
import booking from "./modules/booking";
import count from "./modules/count";

export default createStore({
  modules: {
    user,
    auth,
    app,
    clinic,
    specialty,
    service,
    schedule,
    booking,
    count,
  },

  devtools: process.env.NODE_ENV !== "production",
});
