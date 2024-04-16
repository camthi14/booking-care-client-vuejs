<script>
import { AxiosError } from "axios";
import { computed, defineComponent, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import { useStore } from "vuex";
import { userApi } from "../../../apis";
import FormDoctorAddEdit from "../../../components/manager/doctor/FormDoctorAddEdit.vue";
import { clinicActions, clinicActionTypes } from "../../../store/types";

export default defineComponent({
  components: {
    FormDoctorAddEdit,
  },
  setup() {
    const route = useRoute();
    const store = useStore();
    const router = useRouter();
    const dispatch = store.dispatch;
    const userSelected = ref(null);

    const isModeAdd = computed(() => (!route.params?.doctorId ? true : false));

    const getUserById = async (id) => {
      try {
        const response = await userApi.getById(id);

        if (response && response.data) {
          dispatch(
            clinicActions(clinicActionTypes.FETCH_ALL_SPECIALTY_CLINIC),
            response.data.clinic_id
          );
          return response.data;
        }
      } catch (error) {
        console.log("ERROR GET BY ID:::", error);
        if (error instanceof AxiosError) {
          toast.error(error.response.data.message);
          router.push({
            name: "doctor",
          });
        }
      }
    };

    onMounted(async () => {
      if (!route.params?.doctorId) return;
      userSelected.value = await getUserById(route.params.doctorId);
    });

    return { getUserById, isModeAdd, userSelected };
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
        <h1 class="text-center">
          {{ isModeAdd ? "Thêm" : "Cập nhật" }} Bác sĩ
        </h1>
      </v-col>
    </v-row>
    <div>
      <FormDoctorAddEdit v-if="isModeAdd" :isModeAdd="isModeAdd" />
      <FormDoctorAddEdit
        v-if="userSelected"
        :isModeAdd="isModeAdd"
        :initialValues="userSelected"
      />
    </div>
  </v-container>
</template>
