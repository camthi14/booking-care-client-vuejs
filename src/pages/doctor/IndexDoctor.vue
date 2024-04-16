<script>
import { computed, defineComponent, onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { userActions, userActionTypes } from "../../store/types";
export default defineComponent({
  setup() {
    const router = useRouter();
    const store = useStore();
    const dispatch = store.dispatch;
    const back = ref(false);

    onBeforeMount(() => {
      dispatch(userActions(userActionTypes.GET_DOCTOR), {
        ...store.state.user.doctors.filters,
        limit: 20,
      });
    });

    const dataDoctor = computed(() => store.state.user.doctors.data);

    const handleBack = () => {
      back.value = true;
      router.push("/");
    };
    return {
      handleBack,
      back,
      dataDoctor,
    };
  },
});
</script>

<template>
  <v-app id="inspire">
    <v-app-bar>
      <v-app-bar-nav-icon v-if="!back" @click="handleBack">
        <v-icon icon="mdi-arrow-left"></v-icon>
      </v-app-bar-nav-icon>

      <v-toolbar-title>Bác sĩ</v-toolbar-title>
    </v-app-bar>

    <v-main style="max-width: 1200px; margin: 0 auto">
      <v-row class="my-1">
        <v-col cols="2" v-for="item in dataDoctor" :key="item.user_id">
          <div class="about_team-item">
            <div class="about_team-info">
              <router-link
                :to="{
                  name: 'bs.details',
                  params: { id: item.user_id },
                }"
                class="text-decoration-none about_team-img"
              >
                <img :src="item.avatar" />
              </router-link>
              <h3 class="about_team-name">
                {{ item.last_name + item.first_name }}
              </h3>
            </div>
            <p class="about_team-job">{{ item.specialty_name }}</p>
            <ul class="about_team-icons">
              <li class="about_team-icon">
                <router-link to="#" class="about_team-link">
                  <v-icon icon="mdi-facebook"></v-icon>
                </router-link>
              </li>
              <li class="about_team-icon">
                <router-link
                  :to="`mailto:${item.email}`"
                  class="about_team-link"
                >
                  <v-icon icon="mdi-email-outline"></v-icon>
                </router-link>
              </li>
              <li class="about_team-icon">
                <router-link :to="`tel:${item.phone}`" class="about_team-link">
                  <v-icon icon="mdi-cellphone-basic"></v-icon>
                </router-link>
              </li>
            </ul>
          </div>
        </v-col>
      </v-row>
    </v-main>
  </v-app>
</template>

<style lang="scss" scoped>
.about_team-item {
  text-align: center;
  padding: 0;

  .about_team-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .about_team-img {
      width: 150px;
      height: 150px;
      border-radius: 50%;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }

      &:hover {
        box-shadow: 0px 0px 10px 0px rgba(12, 99, 112, 0.75);
        -webkit-box-shadow: 0px 0px 10px 0px rgba(12, 80, 112, 0.75);
        -moz-box-shadow: 0px 0px 10px 0px rgba(12, 90, 112, 0.75);
      }
    }

    .about_team-name {
      color: #45bee5;
      margin-top: 15px;
    }
  }

  .about_team-job {
    font-style: italic;
    color: #000;
    margin: 10px 0;
  }

  .about_team-icons {
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 0;

    .about_team-icon {
      list-style: none;
      padding-left: 0;

      .about_team-link {
        text-decoration: none;

        color: #000;
        padding: 4px;

        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
}
</style>
