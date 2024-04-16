<script>
import { computed, defineComponent, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import FormSpecialtyAddEdit from "../../../components/manager/specialty/FormSpecialtyAddEdit.vue";
import { specialtyApi } from "../../../apis/index";

export default defineComponent({
  components: {
    FormSpecialtyAddEdit,
  },
  setup() {
    const route = useRoute();
    const specialtySelected = ref(null);

    const isModeAdd = computed(() =>
      !route.params?.specialtyId ? true : false
    );

    const getSpecialtyById = async (specialtyId) => {
      try {
        const response = await specialtyApi.getById(specialtyId);

        if (response && response.data) {
          return response.data;
        }
      } catch (error) {
        console.log("ERROR GET BY ID:::", error);
      }
    };

    onMounted(async () => {
      if (!route.params?.specialtyId) return;
      specialtySelected.value = await getSpecialtyById(
        route.params.specialtyId
      );
    });

    return {
      getSpecialtyById,
      isModeAdd,
      specialtySelected,
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
            name: 'specialty',
          }"
        >
          <v-icon icon="mdi-arrow-left" style="font-size: 26px"></v-icon>
        </v-btn>
      </v-col>
      <v-col cols="12">
        <h1 class="text-center">
          {{ isModeAdd ? "Thêm" : "Cập nhật" }} chuyên khoa
        </h1>
      </v-col>
    </v-row>
    <div>
      <FormSpecialtyAddEdit v-if="isModeAdd" :isModeAdd="isModeAdd" />
      <FormSpecialtyAddEdit
        v-if="specialtySelected"
        :isModeAdd="isModeAdd"
        :initialValues="specialtySelected"
      />
    </div>
  </v-container>
</template>
