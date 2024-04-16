<script>
import { computed, defineComponent, onBeforeMount, ref } from "vue";
import Footer from "../components/layouts/Footer.vue";
import Image from "../assets/image/BookingCare.png";
import { useStore } from "vuex";
import { appActions, appActionTypes, authActions, authActionTypes } from "../store/types";
import AvatarAccountVue from "../components/sections/AvatarAccount.vue";
import ButtonTopVue from "../components/ButtonTop.vue";

export default defineComponent({
  components: {
    Footer,
    AvatarAccountVue,
    ButtonTopVue,
  },
  setup() {
    const drawer = ref(null);

    const store = useStore();

    const user = computed(() =>
      Object.keys(store.state.auth.user).length === 0 ? null : store.state.auth.user
    );
    const accessToken = computed(() => store.state["auth"].accessToken);

    onBeforeMount(() => {
      store.dispatch(appActions(appActionTypes.SET_OVERLAY), true);

      store.dispatch(authActions(authActionTypes.GET_CURRENT_USER), {
        accessToken: accessToken.value,
      });
    });

    const links = [
      ["mdi-account-box-outline", "Chuyên Khoa", "/chuyen-khoa"],
      ["mdi-palette-advanced", "Cơ Sở Y Tế", "/co-so-y-te"],
      ["mdi-clipboard-text", "Bác Sĩ", "/bac-si"],
      ["mdi-clipboard-text", "Gói Khám", "/goi-kham"],
      ["mdi-clipboard-text", "Về Chúng Tôi", "/ve-chung-toi"],
    ];

    return { drawer, Image, links, user };
  },
});
</script>

<template>
  <v-app id="inspire">
    <v-app-bar class="header-content">
      <v-container style="padding: 0; max-width: 1200px">
        <div class="header-content-left">
          <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

          <router-link class="img-avt" to="/">
            <img :src="Image" alt="avt" />
          </router-link>
        </div>

        <div class="header-content-center">
          <v-list>
            <v-list-item to="/chuyen-khoa">
              <p class="font-weight-light">Chuyên Khoa</p>
              <p style="text-transform: capitalize; font-style: italic" class="text-h7">
                Tìm bác sĩ theo chuyên khoa
              </p>
            </v-list-item>
            <v-list-item to="/co-so-y-te">
              <p class="font-weight-light">Cơ Sở Y Tế</p>
              <p style="text-transform: capitalize; font-style: italic" class="text-h7">
                Chọn bệnh viện phòng khám
              </p>
            </v-list-item>
            <v-list-item to="/bac-si">
              <p class="font-weight-light">Bác Sĩ</p>
              <p style="text-transform: capitalize; font-style: italic" class="text-h7">
                Chọn bác sĩ giỏi
              </p>
            </v-list-item>
            <v-list-item to="/goi-kham">
              <p class="font-weight-light">Gói Khám</p>
              <p style="text-transform: capitalize; font-style: italic" class="text-h7">
                Khám sức khoẻ tổng quát
              </p>
            </v-list-item>
          </v-list>
        </div>

        <div class="header-content-right--mobile">
          <v-btn v-if="!user" to="/login" color="#45bee5">
            <v-icon class="text-h5" icon="mdi-account"></v-icon>
          </v-btn>
          <avatar-account-vue v-else />
        </div>
        <div class="header-content-right">
          <v-btn v-if="!user" to="/login" color="#45bee5" variant="outlined"> Đăng nhập </v-btn>
          <avatar-account-vue v-else />
        </div>
      </v-container>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary>
      <v-list class="mt-5">
        <v-list-item v-for="[icon, text, to] in links" :key="icon" link :to="to">
          <template v-slot:prepend>
            <v-icon class="mr-3">{{ icon }}</v-icon>
          </template>
          <v-list-item-title> {{ text }} </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="bg-white">
      <button-top-vue />
      <router-view />
    </v-main>

    <Footer />
  </v-app>
</template>
