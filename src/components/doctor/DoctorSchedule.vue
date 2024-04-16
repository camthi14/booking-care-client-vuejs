<script>
import { useStore } from "vuex";
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import { authActions, authActionTypes } from "../../store/types";
import { fPrice } from "../../utils/functions";
import DatePickerVue from "../manager/doctor/DatePicker.vue";
import DialogBookingVue from "./DialogBooking.vue";

export default defineComponent({
  components: {
    DatePickerVue,
    DialogBookingVue,
  },
  props: {
    worksProp: {
      type: Array,
    },
    data: {
      type: Object,
    },
    isSpecialty: {
      type: Boolean,
    },
  },
  setup(props) {
    const date = ref(new Date());
    const store = useStore();
    const dispatch = store.dispatch;
    const showPrice = ref(false);
    const showInsurance = ref(false);
    const dialog = ref(false);
    const timeValue = ref("");
    const works = ref(props.worksProp);
    const accessToken = computed(() => store.state["auth"].accessToken);
    const getCurrentUser = computed(() =>
      store.state.auth.user ? store.state.auth.user : null
    );

    onMounted(() => {
      dispatch(authActions(authActionTypes.GET_CURRENT_USER), {
        accessToken: accessToken.value,
      });

      handleFilterDay(date.value);
    });

    const handleFilterDay = (date) => {
      const newDateIso = new Date(date).getDate();

      //Lọc lấy ra từng ngày khám và so sánh
      const dataFilter = props.data.schedules?.filter((e) => {
        const date = new Date(e.schedule_day).getDate();
        return newDateIso === date;
      });

      const newFilter = dataFilter[0];

      if (newFilter?.works.length) {
        works.value = newFilter.works;
      } else {
        works.value = [];
      }
    };

    const showPriceList = () => {
      showPrice.value = true;
    };

    const showInsuranceList = () => {
      showInsurance.value = true;
    };

    const nonePriceList = () => {
      showPrice.value = false;
      showInsurance.value = false;
    };

    const noneInsuranceList = () => {
      showInsurance.value = false;
    };

    const onOpenDialog = (tValue) => {
      dialog.value = true;
      timeValue.value = tValue;
    };

    const onCloseDialog = (value) => {
      dialog.value = false;
    };

    const handleResetWorks = (date) => {
      const dateSelect = new Date(date);
      const today = new Date();

      let newWorks = [];

      if (dateSelect.getDate() === today.getDate()) {
        newWorks = handleComputedWoks(works.value);
      } else {
        newWorks = works.value?.map((work) => ({
          ...work,
          disabled: false,
        }));
      }

      works.value = [...newWorks];
    };

    const handleComputedWoks = (data = []) => {
      // * B1
      let today = new Date();
      let hoursNow = today.getHours();

      return data.map((work, index) => {
        const endTime = +work?.value?.split(" - ")[1]?.split(":")[0];
        const startTime = +work?.value?.split(" - ")[0]?.split(":")[0];

        let disabled = false;

        if (hoursNow < endTime) {
          // * B2
          if (endTime === hoursNow + 1 || startTime === hoursNow + 1) {
            // * B3
            disabled = true;
          }
        } else {
          // * B4
          disabled = true;
        }

        if (hoursNow >= 17) {
          disabled = true;
        }

        return {
          ...work,
          disabled: disabled,
        };
      });
    };

    watch(date, (newDate) => {
      handleFilterDay(newDate);
      handleResetWorks(newDate);
    });

    onMounted(() => {
      handleResetWorks(date.value);
    });

    return {
      showPriceList,
      showInsuranceList,
      noneInsuranceList,
      nonePriceList,
      fPrice,
      onOpenDialog,
      onCloseDialog,
      getCurrentUser,
      showPrice,
      showInsurance,
      date,
      dialog,
      timeValue,
      works,
    };
  },
});
</script>

<template>
  <div class="doctor-schedule">
    <div class="doctor-schedule-detail">
      <div style="margin: 16px 0 25px; max-width: 300px">
        <!-- eslint-disable -->
        <DatePickerVue v-model:date="date" />
      </div>
      <v-row class="doctor-schedule-detail-day">
        <v-col
          cols="12"
          :sm="isSpecialty ? 12 : 7"
          :md="isSpecialty ? 12 : 7"
          :lg="isSpecialty ? 12 : 6"
        >
          <v-row v-if="works?.length" style="padding: 0">
            <v-col
              cols="4"
              lg="3"
              md="3"
              sm="4"
              v-for="(item, index) in works"
              :key="index"
              :class="item?.available ? 'd-none' : ''"
              style="padding-top: 0"
            >
              <v-btn @click="onOpenDialog(item)" :disabled="item.disabled">
                {{ item?.value }}
              </v-btn>
            </v-col>
            <v-col cols="12">
              <p class="mt-2">
                Chọn và đặt (Phí đặt lịch
                <strong> {{ `${fPrice(0)}` }}</strong>
                )
              </p>
            </v-col>
          </v-row>
          <div v-else>Không có lịch khám vào ngày này</div>
        </v-col>

        <v-col
          cols="12"
          :sm="isSpecialty ? 12 : 5"
          :md="isSpecialty ? 12 : 5"
          :lg="isSpecialty ? 12 : 6"
        >
          <div class="address" style="border-bottom: 1px solid #eee">
            <p class="text-uppercase font-weight-bold">ĐỊA CHỈ KHÁM</p>
            <p class="font-weight-bold">
              {{ data.clinic_name }}
            </p>
            <p class="mb-1">
              {{ data.clinic_address }}
            </p>
          </div>
          <!-- Giá khám bệnh -->
          <div class="d-flex" style="align-items: center" v-if="!showPrice">
            <p class="text-uppercase">
              Giá khám: <strong> {{ `${fPrice(250000)}` }}</strong>
            </p>
            <p class="cursor-point ml-2 text-primary" @click="showPriceList">
              Xem Chi tiết
            </p>
          </div>
          <div max-width="400" v-if="showPrice" class="font-weight-thin">
            <p class="text-uppercase">Giá khám:</p>
            <div class="pl-0" style="background: #f8f8f8; border-radius: 2px">
              <p
                class="font-weight-bold pa-3"
                style="display: flex; justify-content: space-between"
              >
                Giá khám
                <strong
                  >{{ `${fPrice(250000)}` }} - {{ `${fPrice(500000)}` }}</strong
                >
              </p>
              <p class="px-3">
                <span>Giá tư vấn 15 phút:{{ `${fPrice(250000)}` }}</span
                ><br />
                <span>Giá tư vấn 30 phút: {{ `${fPrice(500000)}` }}</span>
              </p>
              <p class="pa-3" style="background: #eee">
                Phòng khám có thanh toán bằng hình thức tiền mặt và quẹt thẻ
              </p>
            </div>
            <p class="cursor-point text-primary" @click="nonePriceList">
              Ẩn bảng giá
            </p>
          </div>

          <!-- Loại bảo hiểm áp dụng -->
          <div class="d-flex" style="align-items: center" v-if="!showInsurance">
            <p class="text-uppercase">Loại bảo hiểm áp dụng</p>
            <p
              class="cursor-point ml-2 text-primary"
              @click="showInsuranceList"
            >
              Xem Chi tiết
            </p>
          </div>
          <div
            v-if="showInsurance"
            class="font-weight-thin"
            style="max-width: 400px"
          >
            <p class="text-uppercase">Loại bảo hiểm áp dung:</p>
            <div class="pl-0" style="background: #f8f8f8; border-radius: 2px">
              <p class="px-3">
                <span>Bảo hiểm y tế nhà nước</span><br />
                <span
                  >Hiện chưa áp dụng bảo hiểm y tế nhà nước cho dịch vụ khám
                  chuyên gia.</span
                >
              </p>
              <p class="pa-3" style="background: #eee">
                <span>Bảo hiểm y tế tư nhân</span>
                <span>
                  Đối với các đơn vị bảo hiểm không bảo lãnh trực tiếp, phòng
                  khám xuất hoá đơn tài chính (hoá đơn đỏ) và hỗ trợ bệnh nhân
                  hoàn thiện hồ sơ</span
                >
              </p>
            </div>
            <p class="cursor-point text-primary" @click="noneInsuranceList">
              Thu gọn
            </p>
          </div>
        </v-col>
      </v-row>

      <!-- dialog -->
      <dialog-booking-vue
        v-if="dialog && getCurrentUser"
        :dialog="dialog"
        :onClose="onCloseDialog"
        :data="data"
        :timeValue="timeValue"
        :date="date"
        :getCurrentUser="getCurrentUser"
      />
    </div>
  </div>
</template>
