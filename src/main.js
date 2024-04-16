import CKEditor from "@ckeditor/ckeditor5-vue";
import { createApp } from "vue";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import App from "./App.vue";
import "./assets/scss/main.scss";
import vuetify from "./plugins/vuetify";
import router from "./router";
import store from "./store";

const app = createApp(App);

app.use(Vue3Toastify);
app.use(store);
app.use(router);
app.use(vuetify);
app.use(CKEditor);

app.mount("#app");
