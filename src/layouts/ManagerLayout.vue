<script>
import { computed, defineComponent, onBeforeMount, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import Image from "../assets/image/BookingCare.png";
import { roles } from "../store/modules/auth";
import {
  appActions,
  appActionTypes,
  authActions,
  authActionTypes,
} from "../store/types";

export default defineComponent({
  setup() {
    const drawer = ref(null);
    const router = useRouter();

    const links = {
      [roles.ADMIN]: [
        ["mdi-home", "Dashboard", "/manager/dashboard"],
        ["mdi-account-circle", "Quản lý tài khoản", "/manager/customer"],
        ["mdi-hospital-building", "Quản lý cơ sở y tế", "/manager/clinic"],
        ["mdi-chemical-weapon", "Quản lý chuyên khoa", "/manager/specialty"],
        ["mdi-shape-plus", "Gói dịch vụ", "/manager/service"],
      ],
      [roles.DOCTOR]: [["mdi-home", "Dashboard", "/manager/dashboard"]],
    };

    const doctors = [
      ["Danh sách bác sĩ", "/manager/doctor"],
      ["Lịch khám trong tuần", "/manager/doctor/schedule"],
    ];

    const store = useStore();

    const user = computed(() =>
      Object.keys(store.state.auth.user).length === 0
        ? null
        : store.state.auth.user
    );
    const accessToken = computed(() => store.state["auth"].accessToken);

    onBeforeMount(() => {
      if (!localStorage.getItem("accessToken")) {
        router.push({
          name: "login",
        });
        return;
      }

      store.dispatch(appActions(appActionTypes.SET_OVERLAY), true);

      store.dispatch(authActions(authActionTypes.GET_CURRENT_USER), {
        accessToken: accessToken.value,
        isManager: true,
      });
    });

    const handleLogout = async () => {
      store.dispatch(appActions(appActionTypes.SET_OVERLAY), true);
      setTimeout(() => {
        store.dispatch(authActions(authActionTypes.FETCH_LOGOUT));
      }, 1500);
    };

    return { drawer, Image, links, doctors, user, handleLogout };
  },
});
</script>

<template>
  <v-app id="inspire" v-if="user">
    <v-navigation-drawer v-model="drawer">
      <div
        style="
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
        "
        class="ma-2"
      >
        <router-link to="/">
          <v-avatar size="100" style="box-shadow: 1px 2px 5px #999">
            <img
              :src="Image"
              alt="avt"
              style="
                display: flex;
                justify-content: center;
                align-items: center;
                width: 180px;
                height: 100px;
              "
            />
          </v-avatar>
        </router-link>
        <v-toolbar-title
          >Hello,
          {{
            (user?.first_name || "Thi") + " " + (user?.last_name || "Nguyen")
          }}</v-toolbar-title
        >
      </div>
      <v-list>
        <v-list-item
          v-for="[icon, text, to] in links[user.role]"
          :key="icon"
          link
          :to="to"
        >
          <template v-slot:prepend>
            <v-icon class="mr-3">{{ icon }}</v-icon>
          </template>
          <v-list-item-title> {{ text }} </v-list-item-title>
        </v-list-item>

        <v-list-group value="doctor">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props">
              <template v-slot:prepend>
                <v-icon class="mr-3" icon="mdi-stethoscope"></v-icon>
              </template>
              <v-list-item-title>Quản lý bác sĩ </v-list-item-title>
            </v-list-item>
          </template>

          <v-list-item
            v-for="([title, to], i) in doctors"
            :key="i"
            :value="title"
            :to="to"
            :title="title"
          ></v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-container fluid>
      <v-app-bar>
        <v-row>
          <v-col>
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-btn to="/" class="font-weight-light" color="#6876fe">Home</v-btn>
          </v-col>
          <v-col
            style="
              display: flex;
              justify-content: end;
              margin-right: 18px;
              align-items: center;
            "
          >
            <v-btn>
              <v-icon class="text-h6" icon="mdi-bell-outline"></v-icon
            ></v-btn>
            <v-btn variant="outlined" @click="handleLogout">Đăng xuất</v-btn>
          </v-col>
        </v-row>
      </v-app-bar>
      <v-main>
        <router-view />
      </v-main>
    </v-container>
  </v-app>
</template>

<style lang="scss" scoped>
.v-navigation-drawer .v-list .v-list-item--active {
  color: #6876fe;
}

.v-navigation-drawer .v-list .v-list-item:hover {
  background: rgb(104, 118, 254, 0.2);
  color: #6876fe;
}
</style>
