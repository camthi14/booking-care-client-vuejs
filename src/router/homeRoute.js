const homeConfig = [
  {
    path: "/",
    component: () => import(/* webpackChunkName: "DefaultLayout" */ "../layouts/DefaultLayout.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import(/* webpackChunkName: "HomeView" */ "../views/HomeView.vue"),
        meta: { title: "Trang chủ" },
      },
      {
        path: "co-so-y-te",
        children: [
          {
            path: "",
            name: "csyt.index",
            component: () =>
              import(
                /* webpackChunkName: "facilities Index" */ "../pages/facilities/IndexFacilities.vue"
              ),
            meta: { title: "Cơ sở y tế" },
          },
          {
            path: ":id",
            name: "csyt.details",
            component: () =>
              import(
                /* webpackChunkName: "facilities Details" */ "../pages/facilities/DetailsFacilities.vue"
              ),
            meta: { title: "Chi tiết" },
          },
        ],
      },
      {
        path: "goi-kham",
        children: [
          {
            path: "",
            name: "gk.index",
            component: () =>
              import(/* webpackChunkName: "Service Index" */ "../pages/service/IndexService.vue"),
            meta: { title: "Gói khám" },
          },
          {
            path: ":id",
            name: "gk.details",
            component: () =>
              import(
                /* webpackChunkName: "Service Details" */ "../pages/service/DetailsService.vue"
              ),
            meta: { title: "Chi tiết" },
          },
        ],
      },
      {
        path: "ve-chung-toi",
        children: [
          {
            path: "",
            name: "vct.index",
            component: () => import(/* webpackChunkName: "AboutMe Index" */ "../pages/AboutMe.vue"),
            meta: { title: "Về chúng tôi" },
          },
        ],
      },
      {
        path: "thong-tin-ca-nhan",
        children: [
          {
            path: "",
            name: "ttcn.index",
            component: () => import(/* webpackChunkName: "Profile Index" */ "../pages/Profile.vue"),
            meta: { title: "Thông tin cá nhân" },
          },
        ],
      },
      {
        path: "chi-tiet-dat-lich",
        children: [
          {
            path: "",
            name: "bookings.details",
            component: () =>
              import(
                /* webpackChunkName: "BookingDetailPage Page" */ "../pages/BookingDetailPage.vue"
              ),
            meta: { title: "Chi tiết đặt lịch" },
          },
        ],
      },
      {
        path: "thanh-cong",
        children: [
          {
            path: "",
            name: "return.success",
            component: () =>
              import(
                /* webpackChunkName: "Return success Page" */ "../pages/SuccessBookingPage.vue"
              ),
            meta: { title: "Đặt lịch thành công" },
          },
        ],
      },
    ],
  },
];
export default homeConfig;
