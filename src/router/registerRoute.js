const registerConfig = [
  {
    path: "/register",
    component: () => import(/* webpackChunkName: "AccountLayout" */ "../layouts/AccountLayout.vue"),

    children: [
      {
        path: "",
        name: "register",
        component: () =>
          import(/* webpackChunkName: "FormRegister" */ "../components/FormRegister.vue"),
        meta: {
          auth: true,
          title: "Đăng ký",
        },
      },
    ],
  },
];
export default registerConfig;
