<script>
import _ from "lodash";
import { computed, defineComponent, onBeforeMount, onMounted } from "vue";
import { useStore } from "vuex";
import ListBookingVue from "../../components/booking/ListBooking.vue";
import { roles } from "../../store/modules/auth";
import {
  appActions,
  appActionTypes,
  bookingActions,
  bookingActionTypes,
  countActions,
  countActionTypes,
} from "../../store/types";

export default defineComponent({
  components: { ListBookingVue },

  setup() {
    const store = useStore();
    const dispatch = store.dispatch;
    const user = computed(() =>
      _.isEmpty(store.state.auth.user) ? null : store.state.auth.user
    );

    const loading = computed(() => store.state.booking.isLoading);
    const bookings = computed(() => store.state.booking.bookings);
    const pagination = computed(() => store.state.booking.pagination);
    const filters = computed(() => store.state.booking.filters);

    const countAllBooking = computed(() => store.state.count.countAll);
    const countCancelBooking = computed(() => store.state.count.countCancel);
    const countCompleteBooking = computed(
      () => store.state.count.countComplete
    );
    const countSuccessBooking = computed(() => store.state.count.countSuccess);
    const countAccountRegister = computed(() => store.state.count.countUser);
    const countDoctors = computed(() => store.state.count.countDoctor);
    const countClinics = computed(() => store.state.count.countClinic);
    const countServices = computed(() => store.state.count.countService);

    onBeforeMount(() => {
      if (user.value && user.value.role === roles.ADMIN) {
        dispatch(bookingActions(bookingActionTypes.FETCH_ALL_BOOKING), {
          ...filters.value,
        });
      }

      if (user.value && user.value.role === roles.DOCTOR) {
        dispatch(bookingActions(bookingActionTypes.CHANGE_FILTER), {
          where: `b.doctor_id,${user.value.user_id}`,
        });
        dispatch(bookingActions(bookingActionTypes.FETCH_ALL_BOOKING), {
          ...filters.value,
          where: `b.doctor_id,${user.value.user_id}`,
        });
      }
    });

    onMounted(() => {
      if (user.value && user.value.role === roles.ADMIN) {
        dispatch(countActions(countActionTypes.GET_COUNT));
      }
    });

    const handleTransferStatus = (bookingId, status) => {
      const payload = {
        id: bookingId,
        data: {
          status: status,
        },
      };

      dispatch(appActions(appActionTypes.SET_OVERLAY), true);

      dispatch(
        bookingActions(bookingActionTypes.FETCH_UPDATE_BOOKING),
        payload
      );
    };

    return {
      handleTransferStatus,
      bookings,
      pagination,
      filters,
      countAccountRegister,
      countDoctors,
      countClinics,
      countServices,
      countAllBooking,
      countCancelBooking,
      countCompleteBooking,
      countSuccessBooking,
      user,
      roles,
      loading,
    };
  },
});
</script>

<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" v-if="user?.role === roles.ADMIN">
          <v-row>
            <v-col cols="3">
              <div class="text-primary">
                <div style="display: flex; align-items: center">
                  <v-icon icon="mdi-hospital"></v-icon>
                  <h3>Tổng số lịch khám</h3>
                </div>
                <div class="mount">
                  <span> {{ countAllBooking }}</span>
                </div>
              </div>
            </v-col>
            <v-col cols="3">
              <div class="text-orange">
                <div style="display: flex; align-items: center">
                  <v-icon icon="mdi-human-child"></v-icon>
                  <h3>Đợi khám</h3>
                </div>
                <div class="mount">
                  <span>{{ countSuccessBooking }}</span>
                </div>
              </div>
            </v-col>
            <v-col cols="3">
              <div class="text-success">
                <div style="display: flex; align-items: center">
                  <v-icon icon="mdi-clipboard-check"></v-icon>
                  <h3>Hoàn thành</h3>
                </div>
                <div class="mount">
                  <span> {{ countCompleteBooking }} </span>
                </div>
              </div>
            </v-col>
            <v-col cols="3">
              <div class="text-error">
                <div style="display: flex; align-items: center">
                  <v-icon icon=" mdi-clipboard-alert"></v-icon>
                  <h3>Lịch bị huỷ</h3>
                </div>
                <div class="mount">
                  <span> {{ countCancelBooking }} </span>
                </div>
              </div>
            </v-col>
            <v-col cols="3">
              <div>
                <div style="display: flex; align-items: center">
                  <v-icon icon=" mdi-account-circle"></v-icon>
                  <h3>Tài khoản đăng ký</h3>
                </div>
                <div class="mount">
                  <span> {{ countAccountRegister }} </span>
                </div>
              </div>
            </v-col>
            <v-col cols="3">
              <div>
                <div style="display: flex; align-items: center">
                  <v-icon icon="mdi-stethoscope"></v-icon>
                  <h3>Bác sĩ</h3>
                </div>
                <div class="mount">
                  <span> {{ countDoctors }} </span>
                </div>
              </div>
            </v-col>
            <v-col cols="3">
              <div>
                <div style="display: flex; align-items: center">
                  <v-icon icon="mdi-shape-plus"></v-icon>
                  <h3>Gói dịch vụ</h3>
                </div>
                <div class="mount">
                  <span> {{ countServices }} </span>
                </div>
              </div>
            </v-col>
            <v-col cols="3">
              <div>
                <div style="display: flex; align-items: center">
                  <v-icon icon="mdi-hospital-building"></v-icon>
                  <h3>Cơ sở y tế</h3>
                </div>
                <div class="mount">
                  <span> {{ countClinics }}</span>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-col>

        <list-booking-vue
          v-if="!loading"
          :bookings="bookings"
          :pagination="pagination"
          :filters="filters"
        >
          <template #default="{ disabled, item, text }">
            <v-btn
              variant="plain"
              class="cursor-point text-capitalize"
              :disabled="disabled"
              @click="handleTransferStatus(item.booking_id, item.status)"
            >
              {{ text }}
            </v-btn>
          </template>
        </list-booking-vue>
      </v-row>
    </v-container>
  </div>
</template>

<style lang="scss" scoped>
.mount {
  border-right: 5px solid #eee;
  font-size: 40px;
}
</style>
