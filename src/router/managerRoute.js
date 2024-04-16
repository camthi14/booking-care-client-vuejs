const managerConfig = [
  {
    path: "/manager",
    redirect: { name: "dashboard" },
    component: () => import(/* webpackChunkName: "ManagerLayout" */ "../layouts/ManagerLayout.vue"),
    children: [
      {
        path: "dashboard",
        name: "dashboard",
        component: () =>
          import(/* webpackChunkName: "Dashboard" */ "../pages/manager/Dashboard.vue"),
        meta: { title: "Dashboard" },
      },
      {
        path: "customer",
        name: "customer",
        component: () =>
          import(/* webpackChunkName: "Customer" */ "../pages/manager/customer/Customer.vue"),
        meta: { title: "Quản lý bệnh nhân" },
      },
      {
        path: "doctor",
        children: [
          {
            path: "",
            name: "doctor",
            component: () =>
              import(/* webpackChunkName: "Doctor" */ "../pages/manager/doctor/DoctorList.vue"),
            meta: { title: "Quản lý bác sĩ" },
          },
          {
            path: "add-doctor",
            name: "doctor.add",
            component: () =>
              import(
                /* webpackChunkName: "DoctorAdd" */ "../pages/manager/doctor/DoctorListAddEdit.vue"
              ),
            meta: { title: "Thêm bác sĩ" },
          },
          {
            path: "update/:doctorId",
            name: "doctor.update",
            component: () =>
              import(
                /* webpackChunkName: "DoctorEdit" */ "../pages/manager/doctor/DoctorListAddEdit.vue"
              ),
            meta: { title: "Cập nhật bác sĩ" },
          },
          {
            path: "add/:doctorId",
            name: "doctor.schedule.add",
            component: () =>
              import(
                /* webpackChunkName: "ScheduleDoctorAdd" */ "../pages/manager/doctor/ScheduleDoctorAdd.vue"
              ),
            meta: { title: "Thêm lịch bác sĩ" },
          },
        ],
      },
      {
        path: "doctor/schedule",
        children: [
          {
            path: "",
            name: "doctor.schedule",
            component: () =>
              import(
                /* webpackChunkName: "Schedule" */ "../pages/manager/doctor/schedule/Schedule.vue"
              ),
            meta: { title: "Lịch khám của bác sĩ" },
          },
          {
            path: "update/:doctorId/:scheduleId",
            name: "doctor.schedule.update",
            component: () =>
              import(
                /* webpackChunkName: "FormScheduleDoctor" */ "../pages/manager/doctor/ScheduleDoctorEdit.vue"
              ),
            meta: { title: "Cập nhật lịch khám của bác sĩ" },
          },
        ],
      },

      {
        path: "clinic",
        children: [
          {
            path: "",
            name: "clinic",
            component: () =>
              import(/* webpackChunkName: "clinic" */ "../pages/manager/clinic/Clinic.vue"),
            meta: { title: "Danh sách phòng khám" },
          },
          {
            path: "add",
            name: "clinic.add",
            component: () =>
              import(
                /* webpackChunkName: "clinicAdd" */ "../pages/manager/clinic/ClinicAddEdit.vue"
              ),
            meta: { title: "Thêm phòng khám" },
          },
          {
            path: "update/:clinicId",
            name: "clinic.update",
            component: () =>
              import(
                /* webpackChunkName: "clinicEdit" */ "../pages/manager/clinic/ClinicAddEdit.vue"
              ),
            meta: { title: "Cập nhật phòng khám" },
          },
        ],
      },

      {
        path: "specialty",
        children: [
          {
            path: "",
            name: "specialty",
            component: () =>
              import(
                /* webpackChunkName: "specialty" */ "../pages/manager/specialty/Specialty.vue"
              ),
            meta: { title: "Danh sách chuyên khoa" },
          },
          {
            path: "add",
            name: "specialty.add",
            component: () =>
              import(
                /* webpackChunkName: "specialtyAdd" */ "../pages/manager/specialty/SpecialtyAddEdit.vue"
              ),
            meta: { title: "Thêm chuyên khoa" },
          },
          {
            path: "update/:specialtyId",
            name: "specialty.update",
            component: () =>
              import(
                /* webpackChunkName: "specialtyEdit" */ "../pages/manager/specialty/SpecialtyAddEdit.vue"
              ),
            meta: { title: "Cập nhật chuyên khoa" },
          },
        ],
      },

      {
        path: "service",
        children: [
          {
            path: "",
            name: "service",
            component: () =>
              import(/* webpackChunkName: "Customer" */ "../pages/manager/service/ServicePack.vue"),
            meta: { title: "Dịch vụ" },
          },
          {
            path: "add",
            name: "service.add",
            component: () =>
              import(
                /* webpackChunkName: "serviceAdd" */ "../pages/manager/service/ServicePackAddEdit.vue"
              ),
            meta: { title: "Thêm dịch vụ" },
          },
          {
            path: "update/:serviceId",
            name: "service.update",
            component: () =>
              import(
                /* webpackChunkName: "serviceEdit" */ "../pages/manager/service/ServicePackAddEdit.vue"
              ),
            meta: { title: "Cập nhật dịch vụ" },
          },
        ],
      },
    ],
  },
];
export default managerConfig;
