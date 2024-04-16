<script>
import { computed, defineComponent, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { serviceApi } from "../../apis";

export default defineComponent({
  setup() {
    const route = useRoute();
    const dataService = ref({});

    const id = computed(() => route.params?.id);

    const getService = async (id) => {
      try {
        const response = await serviceApi.getById(id);

        if (response && response.data) {
          return response.data;
        }
      } catch (error) {
        console.log("ERROR GET BY ID:::", error);
      }
    };

    onMounted(async () => {
      if (route.params?.id) {
        dataService.value = await getService(route.params.id);
      }
    });
    return {
      id,
      dataService,
    };
  },
});
</script>

<template>
  <div style="max-width: 1200px; margin: 0 auto; padding-bottom: 20px">
    <v-row>
      <v-col cols="12" style="display: flex; padding: 35px 12px 20px">
        <v-icon icon="mdi-home"></v-icon>
        <span class="mx-2" style="font-size: 20px">/</span>
        <router-link
          :to="{
            name: 'gk.index',
          }"
          class="text-decoration-none"
        >
          <h3 class="font-weight-light">Gói Khám</h3>
        </router-link>
        <span class="mx-2" style="font-size: 20px">/</span>
        <h3 class="font-weight-light">
          {{ dataService?.service_name }}
        </h3>
      </v-col>
      <v-col cols="12">
        <v-row>
          <v-col cols="12">
            <img
              style="width: 500px; margin: auto"
              :src="dataService?.service_img"
            />
          </v-col>
          <v-col cols="12">
            <p class="py-3 text-center text-h5 font-weight-bold">
              {{ dataService?.service_name }}
            </p>
            <div class="text-center">
              Giá gói khám: {{ dataService?.service_price }}
            </div>
            <p
              class="py-3 text-center"
              style="max-width: 700px; margin: 0 auto"
            >
              {{ dataService?.content_title }}
            </p>
            <div v-html="dataService?.service_desc"></div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<style lang="scss" scoped>
.router-link-active {
  color: #1f2226;
  &:hover {
    color: #45bee5;
  }
}
</style>
