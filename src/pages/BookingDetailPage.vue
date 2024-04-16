<script>
import _ from "lodash";
import { computed, defineComponent, onMounted, watch } from "vue";
import { useStore } from "vuex";
import ListBookingVue from "../components/booking/ListBooking.vue";
import { appActions, appActionTypes, bookingActions, bookingActionTypes } from "../store/types";

export default defineComponent({
  components: { ListBookingVue },
  setup() {
    const store = useStore();
    const dispatch = store.dispatch;

    watch(
      () => store.state.auth.user,
      (user) => {
        if (_.isEmpty(user)) return;

        dispatch(bookingActions(bookingActionTypes.FETCH_ALL_BOOKING), {
          page: 1,
          limit: 100,
          where: `b.user_id,${user.user_id}`,
        });
      }
    );

    onMounted(() => {
      if (_.isEmpty(store.state.auth.user)) return;

      dispatch(bookingActions(bookingActionTypes.FETCH_ALL_BOOKING), {
        page: 1,
        limit: 100,
        where: `b.user_id,${store.state.auth.user.user_id}`,
      });
    });

    const bookings = computed(() => store.state.booking.bookings);
    const loading = computed(() => store.state.booking.isLoading);

    const handleTransferStatus = (bookingId, status) => {
      const payload = {
        id: bookingId,
        data: {
          status: status,
        },
        page: 1,
        limit: 100,
        where: `b.user_id,${store.state.auth.user.user_id}`,
      };

      dispatch(appActions(appActionTypes.SET_OVERLAY), true);

      dispatch(bookingActions(bookingActionTypes.FETCH_UPDATE_BOOKING), payload);
    };

    return {
      handleTransferStatus,
      loading,
      bookings,
    };
  },
});
</script>

<template>
  <div style="max-width: 1200px; margin: 0 auto; padding: 0 20px">
    <list-booking-vue
      v-if="!loading"
      :bookings="bookings"
      :title="'Lịch sử đặt lịch'"
      :hiddenPagination="true"
    >
      <template #default="{ disabledUser, item, textUser }">
        <v-btn
          variant="plain"
          class="cursor-point text-capitalize"
          :disabled="disabledUser"
          @click="handleTransferStatus(item.booking_id, 'cancel')"
        >
          {{ textUser }}
        </v-btn>
      </template>
    </list-booking-vue>
  </div>
</template>
