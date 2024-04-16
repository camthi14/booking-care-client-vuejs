<script>
import { computed, defineComponent, onBeforeMount, ref } from "vue";
import { useStore } from "vuex";
import { clinicActions, clinicActionTypes } from "../../store/types";

export default defineComponent({
  setup() {
    const store = useStore();
    const dispatch = store.dispatch;
    const area = ["HÀ NỘI", "HỒ CHÍ MINH", "CẦN THƠ", "VĨNH LONG", "ĐỒNG THÁP"];
    const selectArea = ref("Vui lòng chọn khu vực...");

    let i;

    let arrays = computed(() => {
      let newArr = [];
      for (i = 65; i <= 90; i++) {
        newArr = [...newArr, String.fromCharCode(i)];
      }
      return newArr;
    });

    onBeforeMount(() => {
      dispatch(clinicActions(clinicActionTypes.FETCH_ALL_CLINIC), {
        ...store.state.clinic.filters,
        limit: 20,
      });
    });

    const dataClinic = computed(() => store.state.clinic.clinics);

    return {
      area,
      arrays,
      selectArea,
      dataClinic,
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
        <h3 class="font-weight-light">Tất cả cơ sở y tế</h3>
      </v-col>

      <v-col cols="12" class="ma-2" style="padding: 0 12px">
        <v-row>
          <v-col
            cols="12"
            md="4"
            lg="3"
            v-for="item in dataClinic"
            :key="item.clinic_id"
            style="padding: 0 12px"
          >
            <router-link
              :to="{
                name: 'csyt.details',
                params: { id: item.clinic_id },
              }"
              class="text-decoration-none text-black"
            >
              <div class="clinic_content">
                <div class="clinic_img">
                  <v-img cover height="150" :src="item.clinic_img" />
                </div>

                <div class="ma-4 title_hover">
                  <div class="font-weight-bold text-center">
                    {{ item.clinic_name }}
                  </div>
                </div>
              </div>
            </router-link>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<style lang="scss" scoped>
.clinic_content {
  min-height: 250px;

  .clinic_img {
    border: 2px solid #ddd;
    border-radius: 10px;
    overflow: hidden;
    img {
      border-radius: 10px;
    }
  }
  &:hover {
    .clinic_img {
      box-shadow: 0 25px 45px rgba(1, 2, 2, 0.1215686275);
    }
    .title_hover {
      color: #45bee5;
    }
  }
}
</style>
