<script>
import { computed, defineComponent, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { userApi } from "../../../apis";
import FormScheduleDoctor from "../../../components/manager/doctor/FormScheduleDoctor.vue";

export default defineComponent({
  components: {
    FormScheduleDoctor,
  },
  setup() {
    const route = useRoute();
    const dataDoctor = ref(null);

    const scheduleId = computed(() => route.params.scheduleId);

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
      if (route.params?.doctorId) {
        dataDoctor.value = await getDoctor(route.params.doctorId);
      }
    });

    return {
      getDoctor,
      dataDoctor,
      scheduleId,
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
            name: 'doctor.schedule',
          }"
        >
          <v-icon icon="mdi-arrow-left" style="font-size: 26px"></v-icon>
        </v-btn>
      </v-col>
      <v-col cols="12">
        <h1 class="text-center">Cập nhật lịch làm việc</h1>
      </v-col>
    </v-row>
    <div>
      <FormScheduleDoctor
        :scheduleId="scheduleId"
        :initialValues="dataDoctor"
      />
    </div>
  </v-container>
</template>
