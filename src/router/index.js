import { createRouter, createWebHistory } from "vue-router";
import homeConfig from "./homeRoute";
import loginConfig from "./loginRoute";
import managerConfig from "./managerRoute";
import notFoundConfig from "./notFoundRoute";
import registerConfig from "./registerRoute";

const routes = [
  ...homeConfig,
  {
    path: "/chuyen-khoa",
    component: () =>
      import(/* webpackChunkName: "SpecialtyLayout" */ "../layouts/SpecialtyAndDoctorLayout.vue"),
    children: [
      {
        path: "",
        name: "ck.index",
        component: () =>
          import(/* webpackChunkName: "Specialty Index" */ "../pages/specialty/IndexSpecialty.vue"),
        meta: { title: "Chuyên khoa" },
      },
      {
        path: ":id",
        name: "ck.details",
        component: () =>
          import(
            /* webpackChunkName: "Specialty Details" */ "../pages/specialty/DetailsSpecialty.vue"
          ),
        meta: { title: "Chi tiết" },
      },
    ],
  },

  {
    path: "/bac-si",
    component: () =>
      import(/* webpackChunkName: "DoctorLayout" */ "../layouts/SpecialtyAndDoctorLayout.vue"),
    children: [
      {
        path: "",
        name: "bs.index",
        component: () =>
          import(/* webpackChunkName: "Doctor Index" */ "../pages/doctor/IndexDoctor.vue"),
        meta: { title: "Bác sĩ" },
      },
      {
        path: ":id",
        name: "bs.details",
        component: () =>
          import(/* webpackChunkName: "Doctor Details" */ "../pages/doctor/DetailsDoctor.vue"),
        meta: { title: "Chi tiết" },
      },
    ],
  },

  ...managerConfig,
  ...loginConfig,
  ...registerConfig,
  ...notFoundConfig,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    document.getElementById("app").scrollIntoView({ behavior: "smooth" });
  },
});

router.beforeEach((to, from, next) => {
  console.log(to);
  document.title = `${to.meta.title ? to.meta.title + " | " : ""}Booking Care`;
  next();
});

export default router;
