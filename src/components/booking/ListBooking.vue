<script>
import _ from "lodash";
import { computed, defineComponent, ref, watch } from "vue";
import { useStore } from "vuex";
import { bookingApi, userApi } from "../../apis";
import { roles } from "../../store/modules/auth";
import { bookingActions, bookingActionTypes } from "../../store/types";
import DialogInfoBookingVue from "./DialogInfoBooking.vue";

export default defineComponent({
  components: { DialogInfoBookingVue },
  props: {
    bookings: {
      type: Array,
      required: true,
    },
    pagination: {
      type: Object,
    },
    filters: {
      type: Object,
    },
    title: {
      type: String,
      default: "Danh sách đặt lịch khám",
    },
    hiddenPagination: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const statuses = {
      unpaid: {
        value: "Thanh toán tại cơ sở y tế",
        color: "text-info",
        text: "Xác nhận đã tiếp nhận hồ sơ",
        disabled: false,
        textUser: "Huỷ Lịch",
        disabledUser: false,
      },
      paid: {
        value: "Đã thanh toán",
        color: "text-success",
        text: "Xác nhận đã tiếp nhận hồ sơ",
        disabled: false,
        textUser: "Huỷ Lịch",
        disabledUser: false,
      },
      succeeded: {
        value: "Đã tiếp nhận hồ sơ",
        color: "text-warning",
        text: "Xác nhận hoàn thành khám bênh",
        disabled: false,
        textUser: "Đã tiếp nhận hồ sơ",
        disabledUser: true,
      },
      complete: {
        value: "Hoàn thành khám bệnh",
        color: "text-primary",
        text: "Đã hoàn thành",
        disabled: true,
        textUser: "Hoàn thành khám bệnh",
        disabledUser: true,
      },
      cancel: {
        value: "Huỷ lịch",
        color: "text-error",
        text: "Đã huỷ",
        disabled: true,
        textUser: "Đã huỷ lịch",
        disabledUser: true,
      },
    };

    const store = useStore();
    const dispatch = store.dispatch;
    const selected = ref({});
    const dialog = ref(false);
    const getDoctor = ref({});
    const user = computed(() =>
      _.isEmpty(store.state.auth.user) ? null : store.state.auth.user
    );

    const handleOpenDialog = async ({ bookingId, doctorId }) => {
      dialog.value = true;

      const responseBooking = await bookingApi.getById(bookingId);
      const responseDoctor = await userApi.getDoctorById(doctorId);

      getDoctor.value = responseDoctor.data;
      selected.value = responseBooking.data;
    };

    const selectedIsEmpty = computed(() => _.isEmpty(selected.value));
    const getDoctorIsEmpty = computed(() => _.isEmpty(getDoctor.value));

    const onCloseDialog = () => {
      dialog.value = false;
      selected.value = {};
      getDoctor.value = {};
    };

    watch(
      () => props.filters,
      (filters) => {
        dispatch(bookingActions(bookingActionTypes.FETCH_ALL_BOOKING), {
          ...filters,
        });
      },
      []
    );

    const handleChangePage = (newPage) => {
      dispatch(bookingActions(bookingActionTypes.CHANGE_FILTER), {
        ...props.filters,
        page: newPage,
      });
    };

    return {
      handleChangePage,
      handleOpenDialog,
      onCloseDialog,
      selectedIsEmpty,
      getDoctorIsEmpty,
      statuses,
      selected,
      dialog,
      getDoctor,
      user,
      roles,
    };
  },
});
</script>

<template>
  <v-col cols="12">
    <dialog-info-booking-vue
      v-if="!selectedIsEmpty && !getDoctorIsEmpty"
      :dialog="dialog"
      :doctor="getDoctor"
      :selected="selected"
      :onCloseDialog="onCloseDialog"
    />

    <v-sheet rounded="lg">
      <div class="d-flex justify-space-between my-4">
        <h1>{{ title }}</h1>
      </div>

      <div>
        <v-table class="table_manager">
          <thead>
            <tr>
              <th class="text-white">STT</th>
              <th class="text-white">Thông tin bệnh nhân</th>
              <th class="text-center text-white">Chi tiết</th>
              <th class="text-white">Trạng thái</th>
              <th
                class="text-center text-white"
                v-if="user && user.role === roles.ADMIN"
              >
                Hành động
              </th>
            </tr>
          </thead>
          <tbody v-if="bookings.length">
            <tr v-for="item in bookings" :key="item.booking_id">
              <td>{{ item.booking_id }}</td>
              <td>
                <div class="text-truncate" style="max-width: 200px">
                  <p>{{ item.email }}</p>
                  <p>{{ item.phone }}</p>
                  <p>{{ item.address }}</p>
                </div>
              </td>
              <td class="text-center">
                <v-btn
                  variant="plain"
                  class="cursor-point text-orange"
                  @click="
                    handleOpenDialog({
                      bookingId: item.booking_id,
                      doctorId: item.doctor_id,
                    })
                  "
                >
                  Xem chi tiết
                </v-btn>
              </td>
              <td>
                <p :class="statuses[item.status]?.color">
                  {{ statuses[item.status]?.value }}
                </p>
              </td>
              <td v-if="user && user.role === roles.ADMIN">
                <slot
                  :disabled="statuses[item.status]?.disabled"
                  :item="item"
                  :text="statuses[item.status]?.text"
                  :textUser="statuses[item.status]?.textUser"
                  :disabledUser="statuses[item.status]?.disabledUser"
                ></slot>
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>

      <!-- pagination -->
      <div class="text-center mt-5">
        <v-pagination
          v-if="!hiddenPagination"
          v-model="pagination.page"
          :length="pagination.totalPage"
          rounded="circle"
          @update:modelValue="handleChangePage"
        ></v-pagination>
      </div>
    </v-sheet>
  </v-col>
</template>
