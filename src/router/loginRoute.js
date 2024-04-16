const loginConfig = [
  {
    path: "/login",
    component: () => import(/* webpackChunkName: "AccountLayout" */ "../layouts/AccountLayout.vue"),

    children: [
      {
        path: "",
        name: "login",
        component: () => import(/* webpackChunkName: "FormLogin" */ "../components/FormLogin.vue"),
        meta: {
          auth: true,
          title: "Đăng nhập",
        },
      },
    ],
  },
  {
    path: "/quen-mat-khau",
    component: () => import(/* webpackChunkName: "AccountLayout" */ "../layouts/AccountLayout.vue"),

    children: [
      {
        path: "",
        name: "forgot.password",
        component: () =>
          import(
            /* webpackChunkName: "FormForgotPassword" */ "../components/FormResetPassword.vue"
          ),
        meta: {
          auth: true,
          title: "Quên mật khẩu",
        },
      },
    ],
  },
];
export default loginConfig;
