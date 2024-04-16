<script>
import { computed, defineComponent, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { clinicApi } from "../../apis";
import DoctorScheduleVue from "../../components/doctor/DoctorSchedule.vue";

export default defineComponent({
  components: {
    DoctorScheduleVue,
  },
  setup() {
    const route = useRoute();
    const dataClinic = ref({});
    const isSpecialty = ref(false);

    const id = computed(() => route.params?.id);

    const getClinic = async (id) => {
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
      if (route.params?.id) {
        dataClinic.value = await getClinic(route.params.id);
      }
    });
    return {
      id,
      dataClinic,
    };
  },
});
</script>

<template>
  <div>
    <!-- slide -->
    <div class="background">
      <div class="card">
        <v-row class="ma-2" style="align-items: center">
          <v-col cols="3" style="padding: 0 6px">
            <img :src="dataClinic?.clinic_img" alt="" />
          </v-col>
          <v-col cols="9" style="padding: 0 20px">
            <h3 style="font-size: 26px">
              {{ dataClinic?.clinic_name }}
            </h3>
            <p style="font-size: 18px; font-style: italic">
              {{ dataClinic?.clinic_address }}
            </p>
          </v-col>
        </v-row>
      </div>
    </div>
    <div style="max-width: 1200px; margin: 0 auto; padding: 20px 0">
      <v-row>
        <v-col cols="12" style="display: flex; padding: 35px 12px 20px">
          <v-icon icon="mdi-home"></v-icon>
          <span class="mx-2" style="font-size: 20px">/</span>
          <router-link
            :to="{
              name: 'csyt.index',
            }"
            class="text-decoration-none"
          >
            <h3 class="font-weight-light">Cơ sơ y tế</h3>
          </router-link>
          <span class="mx-2" style="font-size: 20px">/</span>
          <h3 class="font-weight-light">
            {{ dataClinic?.clinic_name }}
          </h3>
        </v-col>

        <v-col cols="12">
          <div class="font-weight-thin">
            <div class="pl-0" style="background: #ffecb2; border-radius: 10px">
              <div class="pa-5">
                <span>
                  BookingCare là Nền tảng Y tế chăm sóc sức khỏe toàn diện hàng
                  đầu Việt Nam kết nối người dùng với trên 200 bệnh viện - phòng
                  khám uy tín, hơn 1,500 bác sĩ chuyên khoa giỏi và hàng nghìn
                  dịch vụ, sản phẩm y tế chất lượng cao.
                </span>
              </div>
            </div>
          </div>
        </v-col>

        <v-col cols="12">
          <div class="font-weight-thin">
            <div class="pl-0" style="background: #d4effc; border-radius: 10px">
              <div class="pa-5" style="display: flex; flex-direction: column">
                <span>
                  Hàng nghìn người bệnh đến khám tại
                  {{ dataClinic?.clinic_name }} mỗi ngày. Nhằm nâng cao chất
                  lượng dịch vụ và hỗ trợ người bệnh tốt hơn,
                  {{ dataClinic?.clinic_name }} triển khai đặt khám online thông
                  qua Nền tảng Đặt khám BookingCare.
                </span>
                <span>
                  Để giảm thời gian chờ đợi và nhận được hướng dẫn đi khám tại
                  {{ dataClinic?.clinic_name }}, người bệnh vui lòng:
                </span>
                <ul style="padding: 0 0 0 20px">
                  <li>Chọn chuyên khoa phù hợp cần đi khám</li>
                  <li>Chọn thời gian đặt khám</li>
                  <li>Đặt hẹn online trước khi đến khám.</li>
                </ul>
              </div>
            </div>
          </div>
        </v-col>

        <!-- Thông tin bác sĩ -->
        <v-col cols="12">
          <div>
            <h1 class="font-weight-light">Bác sĩ nổi bật</h1>

            <v-card
              v-for="(item, index) in dataClinic.schedules"
              :key="index"
              style="margin: 0 0 20px; padding: 20px; min-height: 500px"
            >
              <v-row>
                <!-- information -->
                <v-col class="doctor-information">
                  <div class="d-flex py-3" style="">
                    <img :src="item?.avatar" alt="avt" />

                    <div class="pl-5">
                      <v-card-title class="text-black">
                        {{ item?.last_name + " " + item?.first_name }}
                      </v-card-title>
                      <v-card-text style="padding: 0 16px; font-style: italic">
                        Chuyên khoa: {{ item?.specialty_name }}
                      </v-card-text>
                      <v-card-text style="padding: 0 16px 8px">
                        {{ item?.content_title }}
                      </v-card-text>
                      <v-card-text style="padding: 0 16px" class="d-flex">
                        <v-icon icon="mdi-map-marker-radius"></v-icon>
                        {{ item?.area }}
                      </v-card-text>

                      <div>
                        <v-btn
                          :to="{
                            name: 'bs.details',
                            params: { id: item.user_id },
                          }"
                          variant="plain"
                        >
                          Xem thêm
                        </v-btn>
                      </div>
                    </div>
                  </div>
                </v-col>

                <!-- schedule -->
                <v-col>
                  <doctor-schedule-vue
                    :data="item"
                    :worksProp="item.schedules"
                    :isSpecialty="(isSpecialty = true)"
                  />
                </v-col>
              </v-row>
            </v-card>
          </div>
        </v-col>

        <v-col cols="12">
          <div v-html="dataClinic?.clinic_desc"></div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.router-link-active {
  color: #1f2226;
  &:hover {
    color: #45bee5;
  }
}
.background {
  position: relative;
  background: linear-gradient(to right, #08363633, #1c023c33),
    url("https://bookingcare.vn/_next/image?url=https%3A%2F%2Fcdn.bookingcare.vn%2Ffo%2F2022%2F10%2F26%2F093216-bc.jpg&w=1920&q=75");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 300px;
  width: 100%;
}

.card {
  background: #f7d800;
  width: 100%;
  max-width: 900px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  opacity: 0.7;
  margin: auto;

  img {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 5px;
    width: 200px;
  }
}
</style>
