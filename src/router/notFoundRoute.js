const notFoundConfig = [
  {
    path: "/404",
    component: () =>
      import(/* webpackChunkName: "NotFoundLayout" */ "../layouts/NotFoundLayout.vue"),

    children: [
      {
        path: "",
        name: "notfound",
        component: () => import(/* webpackChunkName: "NotFoundView" */ "../views/NotFoundView.vue"),
        meta: { title: "404" },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: { name: "notfound" },
  },
];
export default notFoundConfig;
