<script>
import { computed, defineComponent, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import FormClinicAddEdit from "../../../components/manager/clinic/FormClinicAddEdit.vue";
import { clinicApi } from "../../../apis/index";

export default defineComponent({
  components: {
    FormClinicAddEdit,
  },
  setup() {
    const route = useRoute();
    const clinicSelected = ref(null);

    const isModeAdd = computed(() => (!route.params?.clinicId ? true : false));

    const getClinicById = async (id) => {
      try {
        const response = await clinicApi.getById(id);

        if (response && response.data) {
          return response.data;
        }
      } catch (error) {
        console.log("ERROR GET BY ID:::", error);
      }
    };

    onMounted(async () => {
      if (!route.params?.clinicId) return;
      clinicSelected.value = await getClinicById(route.params.clinicId);
    });

    return {
      getClinicById,
      isModeAdd,
      clinicSelected,
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
            name: 'clinic',
          }"
        >
          <v-icon icon="mdi-arrow-left" style="font-size: 26px"></v-icon>
        </v-btn>
      </v-col>
      <v-col cols="12">
        <h1 class="text-center">
          {{ isModeAdd ? "Thêm" : "Cập nhật" }} cơ sở y tế
        </h1>
      </v-col>
    </v-row>
    <div>
      <FormClinicAddEdit v-if="isModeAdd" :isModeAdd="isModeAdd" />
      <FormClinicAddEdit
        v-if="clinicSelected"
        :isModeAdd="isModeAdd"
        :initialValues="clinicSelected"
      />
    </div>
  </v-container>
</template>
