<script>
import { computed, defineComponent, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import FormServiceAddEdit from "../../../components/manager/service/FormServiceAddEdit.vue";
import { serviceApi } from "../../../apis/index";

export default defineComponent({
  components: {
    FormServiceAddEdit,
  },
  setup() {
    const route = useRoute();
    const serviceSelected = ref(null);

    const isModeAdd = computed(() => (!route.params?.serviceId ? true : false));

    const getServiceById = async (id) => {
      try {
        const response = await serviceApi.getById(id);

        if (response && response.data) {
          return response.data;
        }
      } catch (error) {
        console.log("Error Get service BY Id:::", error);
      }
    };

    onMounted(async () => {
      if (!route.params?.serviceId) return;
      serviceSelected.value = await getServiceById(route.params.serviceId);
    });

    return {
      getServiceById,
      isModeAdd,
      serviceSelected,
    };
  },
});
</script>

<template>
  <v-container style="max-width: 1200px">
    <v-row>
      <v-col cols="12" style="padding: 0 12px">
        <v-btn
          variant="outlined"
          color="#1e56c5"
          :to="{
            name: 'service',
          }"
        >
          <v-icon icon="mdi-arrow-left" style="font-size: 26px"></v-icon>
        </v-btn>
      </v-col>
      <v-col cols="12">
        <h1 class="text-center">
          {{ isModeAdd ? "Thêm" : "Cập nhật" }} gói dịch vụ
        </h1>
      </v-col>
    </v-row>
    <div>
      <FormServiceAddEdit v-if="isModeAdd" :isModeAdd="isModeAdd" />
      <FormServiceAddEdit
        v-if="serviceSelected"
        :isModeAdd="isModeAdd"
        :initialValues="serviceSelected"
      />
    </div>
  </v-container>
</template>
