<script>
import { defineComponent } from "vue";
import FormScheduleDoctor from "../../../components/manager/doctor/FormScheduleDoctor.vue";

export default defineComponent({
  components: {
    FormScheduleDoctor,
  },
  setup() {
    return {};
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
            name: 'doctor',
          }"
        >
          <v-icon icon="mdi-arrow-left" style="font-size: 26px"></v-icon>
        </v-btn>
      </v-col>
      <v-col cols="12">
        <h1 class="text-center">Thêm mới lịch làm việc</h1>
      </v-col>
    </v-row>
    <div>
      <FormScheduleDoctor />
    </div>
  </v-container>
</template>
