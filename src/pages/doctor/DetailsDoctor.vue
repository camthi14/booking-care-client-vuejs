<script>
import { defineComponent, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { userApi } from "../../apis";
import "../../assets/scss/Pages/_doctor.scss";
import DoctorScheduleVue from "../../components/doctor/DoctorSchedule.vue";
import Footer from "../../components/layouts/Footer.vue";

export default defineComponent({
  components: {
    Footer,
    DoctorScheduleVue,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const back = ref(false);
    const dataDoctor = ref(null);

    const getFavoritesLocal = () => {
      return localStorage.getItem("favorites")
        ? JSON.parse(localStorage.getItem("favorites"))
        : [];
    };

    const favoritesLocal = ref(getFavoritesLocal());

    const addFavorite = (doctorId) => {
      let favorites = [...getFavoritesLocal()];
      favorites.push(doctorId);
      favoritesLocal.value = [...favoritesLocal.value, doctorId];
      localStorage.setItem("favorites", JSON.stringify(favorites));
    };

    const deleteFavorite = (doctorId) => {
      let favorites = [...getFavoritesLocal()];
      favorites = favorites.filter((id) => id !== doctorId);
      favoritesLocal.value = favoritesLocal.value.filter(
        (id) => id !== doctorId
      );
      localStorage.setItem("favorites", JSON.stringify(favorites));
    };

    const favoriteIsExists = (doctorId) => {
      if (!getFavoritesLocal().length || !doctorId) return false;
      let favorites = [...getFavoritesLocal()];
      return favorites.findIndex((id) => doctorId === id) > -1;
    };

    const getDoctor = async (id) => {
      try {
        const response = await userApi.getDoctorById(id);
        if (response && response.data) {
          return response.data;
        }
      } catch (error) {
        console.log("ERROR GET BY ID:::", error);
      }
    };

    onMounted(async () => {
      if (route.params?.id) {
        dataDoctor.value = await getDoctor(route.params.id);
      }
    });

    const handleBack = () => {
      back.value = true;
      router.push("/bac-si");
    };

    const isFavorite = ref(false);

    watch(dataDoctor, (doctor) => {
      isFavorite.value = favoriteIsExists(doctor.user_id);
    });

    watch(favoritesLocal, (favoritesLocal) => {
      isFavorite.value = favoriteIsExists(dataDoctor.value.user_id);
    });

    function incrementLikes(doctorId) {
      if (!doctorId) return;

      const favoriteValid = favoriteIsExists(doctorId);

      if (favoriteValid) {
        deleteFavorite(doctorId);
        return;
      }

      addFavorite(doctorId);
    }

    return {
      handleBack,
      incrementLikes,
      getDoctor,
      back,
      dataDoctor,
      isFavorite,
    };
  },
});
</script>

<template>
  <v-app id="inspire" :v-if="dataDoctor">
    <!-- header  -->
    <v-app-bar style="background: #45bee5" class="text-white">
      <v-app-bar-nav-icon v-if="!back" @click="handleBack">
        <v-icon icon="mdi-arrow-left"></v-icon>
      </v-app-bar-nav-icon>
      <v-toolbar-title>
        Bác sĩ:
        {{ dataDoctor?.last_name + " " + dataDoctor?.first_name }}
      </v-toolbar-title>
    </v-app-bar>

    <!-- main -->
    <v-main>
      <div class="doctor">
        <v-container style="max-width: 1200px">
          <div class="doctor-diagram">
            <ul class="doctor-diagram-list">
              <li>
                <router-link to="/">
                  <v-icon icon="mdi-home"></v-icon>
                </router-link>
              </li>
              <li>
                <span class="mx-2" style="font-size: 20px">/</span>
                <router-link to="/chuyen-khoa">
                  <h3 class="font-weight-light">Khám chuyên khoa</h3>
                </router-link>
              </li>
              <li>
                <span class="mx-2" style="font-size: 20px">/</span>
                <h3 class="font-weight-light" style="font-style: italic">
                  {{ dataDoctor?.specialty_name }}
                </h3>
              </li>
            </ul>
          </div>

          <!-- information -->
          <div class="doctor-information">
            <div class="d-flex py-3">
              <img
                :src="dataDoctor?.avatar"
                alt="avt"
                style="
                  width: 150px;
                  height: 150px;
                  border-radius: 50%;
                  object-fit: cover;
                "
              />

              <div class="pl-5">
                <v-card-title class="text-black">
                  {{ dataDoctor?.last_name + " " + dataDoctor?.first_name }}
                </v-card-title>
                <v-card-text style="padding: 0 16px; font-style: italic">
                  Chuyên khoa: {{ dataDoctor?.specialty_name }}
                </v-card-text>
                <v-card-text style="padding: 0 16px 8px">
                  {{ dataDoctor?.content_title }}
                </v-card-text>
                <v-btn
                  @click="incrementLikes(dataDoctor?.user_id)"
                  :color="isFavorite ? 'info' : ''"
                >
                  <v-icon icon="mdi-thumb-up-outline"></v-icon>Thích</v-btn
                >
                <v-btn class="ml-2"> Chia sẽ</v-btn>
              </div>
            </div>
          </div>

          <!-- schedule -->
          <doctor-schedule-vue
            v-if="dataDoctor"
            :data="dataDoctor"
            :works="dataDoctor?.schedules"
          />
        </v-container>
      </div>

      <!-- introduce -->
      <div class="introduce">
        <v-container style="max-width: 1200px">
          <!-- diagnostic -->
          <div
            class="diagnostic"
            v-if="dataDoctor"
            v-html="dataDoctor?.doctor_desc"
          ></div>

          <!-- system introduce -->
          <div class="system-introduce"></div>
        </v-container>
      </div>
    </v-main>

    <!-- Footer -->
    <Footer />
  </v-app>
</template>

<style>
.clicked {
  background-color: green;
  color: white;
}
</style>
