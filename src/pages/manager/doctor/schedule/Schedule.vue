<script>
import { getWeekOfMonth } from "date-fns";
import _ from "lodash";
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import DialogInfoPatientVue from "../../../../components/manager/doctor/DialogInfoPatient.vue";
import { roles } from "../../../../store/modules/auth";
import {
  bookingActions,
  bookingActionTypes,
  scheduleActions,
  scheduleActionTypes,
} from "../../../../store/types";
import {
  getAllDates,
  parserArrayAddYear,
  parserJson,
  weekCount,
} from "../../../../utils/functions";

export default defineComponent({
  components: {
    DialogInfoPatientVue,
  },
  setup() {
    const store = useStore();
    const dispatch = store.dispatch;
    const date = new Date();
    const day = date.getDate();
    const year = ref(date.getFullYear());
    const month = ref(date.getMonth() + 1);
    const monthCurrent = date.getMonth() + 1;
    const dialog = ref(false);
    const dialogPatient = ref(false);
    const selectDeleteSchedule = ref(0);
    const user = computed(() =>
      _.isEmpty(store.state.auth.user) ? null : store.state.auth.user
    );

    const dataSchedule = computed(
      () => store.getters["schedule/getAllSchedules"]
    );

    const allDateOfWeeks = computed(() => getAllDates(year.value, month.value));

    const calcWeekCount = ref(weekCount(year.value, month.value));

    const week = ref(getWeekOfMonth(date, calcWeekCount.value));

    const days = ref(
      parserArrayAddYear(allDateOfWeeks.value[week.value], year.value)
    );

    watch(week, (week) => {
      if (week > calcWeekCount.value) {
        week = 1;
      }

      const newArray = parserArrayAddYear(
        allDateOfWeeks.value[week],
        year.value
      );

      days.value = newArray;

      dispatch(scheduleActions(scheduleActionTypes.FETCH_ALL_SCHEDULE), {
        works: parserJson(newArray),
      });
    });

    watch(month, (month, monthOld) => {
      calcWeekCount.value = weekCount(year.value, month);

      if (month > monthOld) {
        if (month === 12 && month - monthOld !== 1) {
          week.value = calcWeekCount.value;
        } else {
          week.value = 1;
        }
      } else {
        if (month === 1 && month - monthOld === -11) {
          week.value = 1;
        } else {
          week.value = calcWeekCount.value;
        }
      }
    });

    onMounted(() => {
      dispatch(scheduleActions(scheduleActionTypes.FETCH_ALL_SCHEDULE), {
        works: parserJson(days.value),
      });
    });

    const handleDatePrev = () => {
      if (week.value <= 1) {
        if (month.value - 1 === 0) {
          month.value = 13;
        }

        if (month.value === 13) {
          year.value -= 1;
        }

        month.value -= 1;
        return;
      }

      week.value -= 1;
    };

    const handleDateNext = () => {
      if (week.value >= calcWeekCount.value) {
        if (month.value + 1 === 13) {
          month.value = 0;
        }

        if (month.value === 0) {
          year.value += 1;
        }

        month.value += 1;

        return;
      }

      week.value += 1;
    };

    const onOpenDialogDelete = (schedule_id) => {
      selectDeleteSchedule.value = schedule_id;
      dialog.value = true;
    };

    const handleDelete = () => {
      if (selectDeleteSchedule.value === 0) return;

      dialog.value = false;

      dispatch(scheduleActions(scheduleActionTypes.FETCH_DELETE_SCHEDULE), {
        id: selectDeleteSchedule.value,
        works: parserJson(days.value),
      });

      selectDeleteSchedule.value = 0;
    };

    const dataBooking = computed(() => store.state.booking.bookings);

    const handleOpenDialogPatient = async (date, doctorId) => {
      dialogPatient.value = true;

      dispatch(bookingActions(bookingActionTypes.FETCH_ALL_BOOKING), {
        page: 1,
        limit: 100,
        where: `b.doctor_id,${doctorId};booking_date,${year.value}-${date.month}-${date.day}`,
      });
    };

    const handleCloseDialogPatient = () => {
      dialogPatient.value = false;
    };

    const onClose = () => {
      dialog.value = false;
    };

    return {
      handleOpenDialogPatient,
      handleCloseDialogPatient,
      onOpenDialogDelete,
      handleDelete,
      onClose,
      handleDatePrev,
      handleDateNext,
      week,
      month,
      year,
      calcWeekCount,
      allDateOfWeeks,
      selectDeleteSchedule,
      day,
      dataSchedule,
      monthCurrent,
      dialog,
      dialogPatient,
      dataBooking,
      user,
      roles,
    };
  },
});
</script>

<template>
  <v-container style="max-width: 1200px">
    <dialog-info-patient-vue
      v-if="dialogPatient"
      :data="dataBooking"
      :onCloseDialog="handleCloseDialogPatient"
      :dialog="dialogPatient"
    />
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">Lịch làm việc</h1>
      </v-col>

      <v-col
        cols="12"
        class="d-flex"
        style="align-items: center; justify-content: space-between"
      >
        <div>
          <v-btn
            @click="handleDatePrev"
            size="small"
            variant="elevated"
            style="font-size: 20px"
          >
            <v-icon style="font-size: inherit" icon="mdi-chevron-left" />
          </v-btn>

          <v-btn
            @click="handleDateNext"
            class="mx-2"
            size="small"
            variant="elevated"
            style="font-size: 20px"
          >
            <v-icon style="font-size: inherit" icon="mdi-chevron-right" />
          </v-btn>

          <span>{{ month + "/" + year }}</span>
          <span> - Tuần {{ week }} / {{ calcWeekCount }}</span>
        </div>
      </v-col>

      <v-row class="header">
        <v-col
          v-for="(date, index) in allDateOfWeeks[week]"
          :key="index"
          class="text-center"
          style="border-right: 1px solid #eee"
          :class="
            day === date.day && monthCurrent === date.month
              ? 'bg_active'
              : index === 0
              ? 'disabled'
              : ''
          "
        >
          <p>{{ index === 0 ? "Chủ nhật" : `Thứ ${index + 1}` }}</p>
          <div
            class="circle"
            :class="
              day === date.day && monthCurrent === date.month ? 'active' : ''
            "
          >
            <span>{{ `${date.day}/${date.month}` }}</span>
          </div>
        </v-col>
      </v-row>

      <v-col
        v-for="(data, index) in dataSchedule"
        :key="index"
        class="mt-5"
        cols="12"
      >
        <v-row class="py-3 font-weight-bold text-h6">
          <div>{{ data.clinic_name }}</div>
        </v-row>

        <v-row
          class="body"
          v-for="(specialty, index) in data.specialties"
          :key="index"
        >
          <v-col
            style="border: none; padding: 0 1px; margin: auto"
            class="text-center"
          >
            {{ specialty.specialty_name }}
          </v-col>

          <v-col
            v-for="(date, index) in allDateOfWeeks[week]"
            :key="index"
            class="text-center"
            style="padding: 0 1px"
            :class="index === 0 ? 'd-none' : ''"
          >
            <v-card>
              <div
                v-for="(item, index) in specialty?.calendar[
                  `${date.day}/${date.month}`
                ]"
                :key="index"
              >
                <v-menu location="end">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      variant="text"
                      style="padding: 0; text-transform: capitalize"
                      :disabled="
                        user &&
                        user.role === roles.DOCTOR &&
                        +user.user_id !== +item.doctorId
                      "
                    >
                      <p
                        style="
                          max-width: 128px;
                          overflow: hidden;
                          white-space: nowrap;
                          text-overflow: ellipsis;
                        "
                      >
                        {{ item?.fullName || "" }}
                      </p>
                    </v-btn>
                  </template>

                  <v-card min-width="200">
                    <v-list>
                      <v-list-item
                        :prepend-avatar="item?.avatar"
                        :title="item?.fullName"
                        class="pb-3"
                      >
                      </v-list-item>

                      <v-divider></v-divider>

                      <v-list-item variant="plain" class="cursor-point">
                        <router-link
                          :to="{
                            name: 'doctor.schedule.update',
                            params: {
                              doctorId: item.doctorId,
                              scheduleId: item.schedule_id,
                            },
                          }"
                          class="text-decoration-none d-flex text-primary"
                        >
                          <v-icon
                            icon="mdi-pencil-box-outline"
                            class="mr-2"
                          ></v-icon>
                          <v-list-item-title>Cập nhật lịch</v-list-item-title>
                        </router-link>
                      </v-list-item>

                      <v-list-item
                        active-color="success"
                        variant="plain"
                        class="cursor-point"
                      >
                        <div class="d-flex text-success">
                          <v-icon icon="mdi-account" class="mr-2"></v-icon>
                          <v-list-item-title
                            @click="
                              handleOpenDialogPatient(date, item.doctorId)
                            "
                            >Bệnh nhân đặt lịch</v-list-item-title
                          >
                        </div>
                      </v-list-item>

                      <v-list-item
                        active-color="success"
                        variant="plain"
                        class="cursor-point"
                      >
                        <div
                          class="d-flex text-error"
                          @click="onOpenDialogDelete(item.schedule_id)"
                        >
                          <v-icon icon="mdi-delete" class="mr-2"></v-icon>
                          <v-list-item-title>Xoá lịch</v-list-item-title>
                        </div>
                      </v-list-item>
                    </v-list>
                  </v-card>
                </v-menu>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <!-- dialog -->
      <v-dialog v-model="dialog" persistent width="50%">
        <v-card>
          <v-card-title class="text-h5">Xác nhận trước khi xoá</v-card-title>
          <v-card-text
            >Bạn có muốn xoá
            <strong>{{ selectDeleteSchedule }}</strong>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" variant="text" @click="onClose(dialog)">
              Huỷ
            </v-btn>
            <v-btn color="green-darken-1" variant="text" @click="handleDelete">
              Xoá
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
.header {
  margin-top: 10px;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}
.body {
  border: 1px solid #eee;
}
.circle {
  width: 40px;
  height: 40px;
  background-color: #6876fe;
  border-radius: 50%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    color: white;
  }

  &.active {
    background: red;
  }
}

.v-card {
  padding: 12px 4px;
  border: 1px dashed #6876fe;
  min-height: 50px;
  height: 100%;
  text-align: left;
  max-width: 100%;
}

.disabled {
  opacity: 0.5;
  background: #ddd;
}

.bg_active {
  background: rgba(54, 47, 217, 0.2);
}
</style>
