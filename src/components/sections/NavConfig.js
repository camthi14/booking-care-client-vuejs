const navConfig = [
  {
    label: "Thông tin đặt lịch",
    to: "/chi-tiet-dat-lich",
  },
  {
    label: "Thông tin cá nhân",
    to: "/thong-tin-ca-nhan",
  },
];

const navConfigAdmin = [
  {
    label: "Thông tin đặt lịch",
    to: "/chi-tiet-dat-lich",
  },
  {
    label: "Thông tin cá nhân",
    to: "/thong-tin-ca-nhan",
  },
  {
    label: "Quản trị hệ thống",
    to: "/manager",
  },
];

const navConfigDoctor = [
  {
    label: "Thông tin cá nhân",
    to: "/thong-tin-ca-nhan",
  },
  {
    label: "Quản trị dành cho bác sĩ",
    to: "/manager",
  },
];

const switchNavConfig = {
  ADMIN: navConfigAdmin,
  CUSTOMER: navConfig,
  DOCTOR: navConfigDoctor,
};

export default switchNavConfig;
