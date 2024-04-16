<script>
import { AxiosError } from "axios";
import _ from "lodash";
import { defineComponent, onBeforeMount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import { useStore } from "vuex";
import { userApi } from "../../../apis";
import {
  appActions,
  appActionTypes,
  scheduleActions,
  scheduleActionTypes,
} from "../../../store/types";
import { getToISOString00 } from "../../../utils/functions";
import DatePickerVue from "./DatePicker.vue";

export default defineComponent({
  components: {
    DatePickerVue,
  },
  props: {
    initialValues: {
      type: Object,
    },
    scheduleId: {
      type: Number,
    },
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const dispatch = store.dispatch;
    const dataDoctor = ref(null);
    const works = ref([]);
    const date = ref(new Date());
    const selectDate = ref({});
    const activeDate = ref({});

    const getISOString = ref(getToISOString00());

    const activeDateCount = ref({
      [getISOString.value]: !_.isEmpty(activeDate.value[getISOString.value]),
    });

    watch(
      () => props.initialValues,
      (newValue, oldValue) => {
        if (!works.value.length || _.isEmpty(newValue)) return;

        handleFilterDayAndActive(getISOString.value);
      }
    );

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

      getISOString.value = dateSelect.toISOString();
    };

    const handleFilterDayAndActive = (dateISO) => {
      const newDateIso = new Date(dateISO).getDate();

      //Lọc lấy ra từng ngày khám và so sánh
      const dataFilter = props.initialValues.schedules?.filter((e) => {
        const date = new Date(e.schedule_day).getDate();
        return newDateIso === date;
      });

      const newFilter = dataFilter[0];

      const dateDb = new Date(newFilter?.schedule_day).getDate();

      const dateSelect = date.value.getDate();

      if (newFilter?.works.length && works.value?.length) {
        let _works = [...works.value];
        let selectDateUpdate = [];

        const indexWorks = newFilter?.works
          ?.map((e) => {
            const index = _works.findIndex((t) => t.work_id === e.work_id);
            return index;
          })
          .reduce((obj, value) => ({ ...obj, [value]: value }), {});

        if (!_.isEmpty(indexWorks)) {
          _works?.map((work, index) => {
            if (index === indexWorks[index]) {
              selectDateUpdate = [...selectDateUpdate, _works[index]];
            }

            return work;
          });
        }

        if (dateDb !== dateSelect) return;

        if (selectDate.value[dateISO]?.length !== selectDate.length) return;

        selectDate.value = {
          ...selectDate.value,
          [dateISO]: selectDateUpdate,
        };
      }
    };

    watch(getISOString, (value) => {
      if (_.isEmpty(props.initialValues)) return;

      handleFilterDayAndActive(value);
    });

    const getUserById = async (id) => {
      try {
        const response = await userApi.getById(id);

        if (response && response.data) {
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
      if (route.params?.doctorId) {
        dataDoctor.value = await getUserById(route.params.doctorId);
      }
    });

    onBeforeMount(() => {
      dispatch(scheduleActions(scheduleActionTypes.GET_WORK));
    });

    watch(date, (newDate) => {
      handleResetWorks(newDate);
    });

    watch(
      () => store.state["schedule"].works,
      (data) => {
        works.value = handleComputedWoks(data);
      }
    );

    /**
     * Bước 1: Lấy thời gian hiện tại và phút hiện tại
     *
     * Bước 2: So Sanh thời gian hiện tại với thời gian cuối cung.
     *
     * Bước 3: Nếu hiện tại < Kết thúc thì ẩn đi trong khoảng thời gian 1h.
     *
     * Bước 4: Ngược lại hoặc lớn hơn 17h cho ẩn đi
     */
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
          active: false,
          disabled: disabled,
        };
      });
    };

    const handleClickSelectWork = (date, _work) => {
      const _date = getISOString.value;

      const _selectDate = selectDate.value;
      let newSelectDate = {
        ..._selectDate,
      };

      if (!_.isEmpty(newSelectDate[_date])) {
        const workIndex = [...newSelectDate[_date]].findIndex(
          (d) => d?.work_id === _work.work_id
        );

        if (workIndex === -1) {
          newSelectDate = {
            ...newSelectDate,
            [_date]: [...newSelectDate[_date], _work],
          };
        } else {
          const workFilter = [...newSelectDate[_date]].filter(
            (d) => d?.work_id !== _work.work_id
          );

          newSelectDate = {
            ...newSelectDate,
            [_date]: [...workFilter],
          };
        }
      } else {
        newSelectDate = {
          ...newSelectDate,
          [_date]: [_work],
        };
      }

      selectDate.value = newSelectDate;
    };

    watch(selectDate, (selectDateValue) => {
      let obj = {};

      Object.keys(selectDateValue).forEach((key) => {
        const newObj = selectDateValue[key]?.reduce((obj, value) => {
          return {
            ...obj,
            [key]: { ...obj[key], [value?.work_id]: true },
          };
        }, {});

        obj = {
          ...obj,
          ...newObj,
        };
      });

      activeDate.value = obj;

      activeDateCount.value = {
        ...activeDateCount.value,
        [getISOString.value]: !_.isEmpty(obj[getISOString.value]),
      };
    });

    /**
     * Xoa activeDate cua ngay duoc chon
     *
     * Chuyen activeDateCount cua ngay duoc chon ve false
     *
     * Xoa selectDate mang cua ngay duoc chon
     */
    const handleCancelWork = () => {
      delete activeDate.value[getISOString.value];

      activeDateCount.value = {
        ...activeDateCount.value,
        [getISOString.value]: false,
      };

      delete selectDate.value[getISOString.value];
    };

    const handleAddAll = () => {
      selectDate.value = {
        ...selectDate.value,
        [getISOString.value]: works.value,
      };
    };

    const handleSubmit = () => {
      if (!dataDoctor.value) return;

      let dataInsert = {};

      Object.keys(selectDate.value).forEach(
        (key) =>
          (dataInsert = {
            ...dataInsert,
            [key]: _.cloneDeep(selectDate.value[key]),
          })
      );

      dataInsert = {
        works: { ...dataInsert },
        doctorId: dataDoctor.value.user_id,
      };

      return new Promise((resolve, reject) => {
        dispatch(appActions(appActionTypes.SET_OVERLAY), true);

        setTimeout(() => {
          if (_.isEmpty(props.initialValues)) {
            // ! ADD
            dispatch(
              scheduleActions(scheduleActionTypes.FETCH_CREATE_SCHEDULE),
              dataInsert
            );
          } else {
            // ! UPDATE

            const dataUpdate = {
              works: dataInsert.works,
            };

            let array = "";

            Object.keys(dataInsert.works).forEach((key) => {
              if (Array.isArray(dataInsert.works[key])) {
                array = JSON.stringify(dataInsert.works[key]);
              }
            });

            dispatch(
              scheduleActions(scheduleActionTypes.FETCH_UPDATE_SCHEDULE),
              { data: { works: array }, id: +props.scheduleId }
            );
          }
          resolve(true);
        }, 500);
      });
    };

    return {
      getUserById,
      handleClickSelectWork,
      dataDoctor,
      works,
      selectDate,
      getISOString,
      activeDate,
      activeDateCount,
      date,
      handleCancelWork,
      handleAddAll,
      handleSubmit,
    };
  },
});
</script>

<template>
  <v-row>
    <v-col md="6" lg="6" sm="5" xs="12" cols="12">
      <v-card class="card">
        <v-card-item class="doctor-information">
          <div class="d-flex text-center" style="flex-direction: column">
            <img
              :src="dataDoctor?.avatar"
              alt="avt"
              style="
                width: 150px;
                height: 150px;
                border-radius: 50%;
                object-fit: cover;
                margin: 0 auto;
              "
            />

            <div class="py-3">
              <v-card-title class="text-black">
                {{ dataDoctor?.last_name + dataDoctor?.first_name }}
              </v-card-title>
              <v-card-text style="padding: 0">
                {{ dataDoctor?.content_title }}
              </v-card-text>
              <v-card-text style="padding: 0; font-style: italic">
                {{ dataDoctor?.address }}
              </v-card-text>
            </div>
          </div>
        </v-card-item>
      </v-card>
    </v-col>

    <v-col md="6" lg="6" sm="7" xs="12" cols="12">
      <v-card style="min-height: 450px" class="card">
        <v-row>
          <v-col cols="12" style="padding: 0 12px">
            <!-- eslint-disable -->
            <DatePickerVue v-model:date="date" />
          </v-col>

          <v-col cols="12" style="padding: 0 12px" class="mt-5">
            <h3 class="pb-3">Thời gian làm việc</h3>
          </v-col>

          <v-col cols="12">
            <v-row>
              <v-col
                lg="4"
                md="4"
                sm="6"
                xs="6"
                v-for="item in works"
                :key="item.work_id"
                style="padding-top: 0"
              >
                <v-btn
                  @click="handleClickSelectWork(date, item)"
                  :color="
                    activeDateCount[getISOString] &&
                    activeDate[getISOString][item.work_id]
                      ? 'info'
                      : 'default'
                  "
                  :disabled="item.disabled"
                >
                  {{ item.value }}
                </v-btn>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="12">
            <v-btn
              @click="handleSubmit"
              v-if="activeDateCount[getISOString]"
              size="small"
              color="success"
            >
              Lưu lại
            </v-btn>

            <v-btn
              v-if="activeDateCount[getISOString]"
              size="small"
              @click="handleCancelWork"
              color="error mx-1"
            >
              Huỷ bỏ lịch này
            </v-btn>
            <v-btn @click="handleAddAll" size="small" color="yellow">
              Chọn tất cả
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<style lang="scss" scoped>
.card {
  padding: 20px;
  box-shadow: 1px 2px 5px #999;
}

.wrapper__img {
  width: 350px;
  height: 200px;
  margin: 0 auto;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 2px;
  max-width: 100%;

  & > img {
    border-radius: 2px;
  }
}
</style>
