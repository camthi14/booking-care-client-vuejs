<script>
import { computed, defineComponent, onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { specialtyActions, specialtyActionTypes } from "../../store/types";

export default defineComponent({
  setup() {
    const router = useRouter();
    const store = useStore();
    const dispatch = store.dispatch;
    const back = ref(false);

    onBeforeMount(() => {
      dispatch(specialtyActions(specialtyActionTypes.FETCH_ALL_SPECIALTY), {
        limit: 20,
      });
    });

    const dataSpecialty = computed(() => store.state.specialty.specialties);

    const handleBack = () => {
      back.value = true;
      router.push("/");
    };
    return {
      handleBack,
      back,
      dataSpecialty,
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

      <v-toolbar-title>Chuyên khoa</v-toolbar-title>
    </v-app-bar>

    <v-main style="max-width: 1200px; margin: 0 auto">
      <v-row class="my-1">
        <v-col cols="2" v-for="item in dataSpecialty" :key="item.specialty_id">
          <div class="about_team-item">
            <div class="about_team-info">
              <router-link
                :to="{
                  name: 'ck.details',
                  params: { id: item.specialty_id },
                }"
                class="text-decoration-none about_team-img"
              >
                <img :src="item.specialty_img" />
              </router-link>
              <h3 class="about_team-name">
                {{ item.specialty_name }}
              </h3>
            </div>
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
    }
  }
  &:hover {
    .about_team-img {
      box-shadow: 0px 0px 10px 0px rgba(12, 99, 112, 0.75);
      -webkit-box-shadow: 0px 0px 10px 0px rgba(12, 80, 112, 0.75);
      -moz-box-shadow: 0px 0px 10px 0px rgba(12, 90, 112, 0.75);
    }
    .about_team-name {
      cursor: pointer;
      color: #45bee5;
    }
  }
}
</style>
