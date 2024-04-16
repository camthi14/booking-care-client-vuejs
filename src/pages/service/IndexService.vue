<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Form } from "vee-validate";
import {
  computed,
  defineComponent,
  onBeforeMount,
  onUnmounted,
  ref,
} from "vue";
import { useStore } from "vuex";
import { toast } from "vue3-toastify";
import { fPrice } from "../../utils/functions";

import {
  appActions,
  appActionTypes,
  serviceActions,
  serviceActionTypes,
} from "../../store/types";

import "../../assets/scss/Pages/_service.scss";
import ListCategoryVue from "../../components/home/ListCategory.vue";

export default defineComponent({
  components: {
    Swiper,
    SwiperSlide,
    Form,
    ListCategoryVue,
  },
  setup() {
    const store = useStore();
    const dispatch = store.dispatch;

    const categories_img = [
      {
        img: "https://bookingcare.vn/_next/image?url=https%3A%2F%2Fcdn.bookingcare.vn%2Ffo%2F2022%2F10%2F26%2F095749-khamtongquat.png&w=384&q=75",
        type: "BASIC",
      },
      {
        img: "https://bookingcare.vn/_next/image?url=https%3A%2F%2Fcdn.bookingcare.vn%2Ffo%2F2022%2F10%2F26%2F095803-nangcao.png&w=384&q=75",
        type: "ADVANCE",
      },
      {
        img: "https://bookingcare.vn/_next/image?url=https%3A%2F%2Fcdn.bookingcare.vn%2Ffo%2F2022%2F10%2F26%2F095756-nam.png&w=384&q=75",
        type: "MALE",
      },
      {
        img: "https://bookingcare.vn/_next/image?url=https%3A%2F%2Fcdn.bookingcare.vn%2Ffo%2F2022%2F10%2F26%2F095828-nu.png&w=384&q=75",
        type: "FEMALE",
      },
      {
        img: "https://bookingcare.vn/_next/image?url=https%3A%2F%2Fcdn.bookingcare.vn%2Ffo%2F2022%2F10%2F26%2F095850-trem.png&w=384&q=75",
        type: "CHILDREN",
      },
      {
        img: "https://bookingcare.vn/_next/image?url=https%3A%2F%2Fcdn.bookingcare.vn%2Ffo%2F2022%2F10%2F26%2F095812-nguoigia.png&w=384&q=75",
        type: "OLD_PERSON",
      },
    ];

    const area = [
      "Vui lòng chọn...",
      "HÀ NỘI",
      "HỒ CHÍ MINH",
      "CẦN THƠ",
      "VĨNH LONG",
    ];
    const prices = [
      {
        label: "Vui lòng chọn...",
        value: "",
      },
      {
        label: `Dưới ${fPrice(1000000)}`,
        value: "<=,1000000",
      },
      {
        label: `Dưới ${fPrice(2000000)}`,
        value: "<=,2000000",
      },
      {
        label: `Dưới ${fPrice(5000000)}`,
        value: "<=,5000000",
      },
      {
        label: `Dưới ${fPrice(10000000)}`,
        value: "<=,10000000",
      },
      {
        label: `Lớn hơn ${fPrice(10000000)}`,
        value: ">=,10000000",
      },
    ];

    const types = [
      {
        label: "Vui lòng chọn...",
        value: "",
      },
      {
        label: "CƠ BẢN",
        value: "BASIC",
      },
      {
        label: "NÂNG CAO",
        value: "ADVANCE",
      },
      {
        label: "NAM",
        value: "MALE",
      },
      {
        label: "NỮ",
        value: "FEMALE",
      },
      {
        label: "TRẺ EM",
        value: "CHILDREN",
      },
      {
        label: "NGƯỜI CAO TUỔI",
        value: "OLD_PERSON",
      },
    ];

    const selectArea = ref("Vui lòng chọn...");
    const selectPrice = ref("");
    const selectType = ref("");

    const onClickSearch = () => {
      if (
        !selectArea.value ||
        selectArea.value === "Vui lòng chọn..." ||
        !selectPrice.value ||
        !selectType.value
      ) {
        toast.warn("Vui lòng nhập hết các trường!");
        return;
      }

      const data = {
        price: selectPrice.value,
        type: selectType.value,
        area: selectArea.value,
      };

      dispatch(appActions(appActionTypes.SET_OVERLAY), true);
      dispatch(serviceActions(serviceActionTypes.GET_FILTER), data);
    };

    const OpenTypeService = (value) => {
      if (value) {
        const data = {
          type: value,
        };

        dispatch(appActions(appActionTypes.SET_OVERLAY), true);
        dispatch(serviceActions(serviceActionTypes.GET_FILTER), data);
      }
    };

    const resetForm = () => {
      selectArea.value = "Vui lòng chọn...";
      selectPrice.value = "";
      selectType.value = "";
    };

    onBeforeMount(() => {
      dispatch(serviceActions(serviceActionTypes.FETCH_ALL_SERVICE), {
        ...store.state.service.filters,
        limit: 9,
      });
    });

    const dataService = computed(() => store.state.service.services);
    const dataFilterService = computed(
      () => store.state.service.filterService.data
    );
    onUnmounted(() => {
      dispatch(serviceActions(serviceActionTypes.RESET_DATA_FILTER));
    });

    return {
      resetForm,
      onClickSearch,
      OpenTypeService,
      fPrice,
      dataService,
      categories_img,
      area,
      prices,
      types,
      selectArea,
      selectPrice,
      selectType,
      dataFilterService,
    };
  },
});
</script>

<template>
  <div>
    <!-- slide -->
    <div class="background-top">
      <v-container
        style="
          max-width: 1200px;
          display: flex;
          flex-direction: column;
          align-items: center;
        "
      >
        <div class="background-top-title" variant="outlined">
          <h1>
            <p>KHÁM TỔNG QUÁT</p>
          </h1>
        </div>

        <!-- input  -->
        <div class="frame-input">
          <v-row class="ma-2">
            <v-col cols="12" md="3" style="padding: 0 6px">
              <v-select
                label="Khu vực"
                v-model="selectArea"
                :items="area"
                item-title="label"
                item-value="value"
              ></v-select>
            </v-col>
            <v-col cols="12" md="3" style="padding: 0 6px">
              <v-select
                label="Danh mục"
                v-model="selectType"
                :items="types"
                item-title="label"
                item-value="value"
                density="default"
              >
              </v-select>
            </v-col>
            <v-col cols="12" md="3" style="padding: 0 6px">
              <v-select
                v-model="selectPrice"
                label="Mức giá"
                :items="prices"
                item-title="label"
                item-value="value"
                density="default"
              >
              </v-select>
            </v-col>

            <v-col cols="12" md="3" style="padding: 0 4px" class="d-flex">
              <button
                style="background: #fff; width: 24%"
                @click.prevent="resetForm"
              >
                <v-icon icon="mdi-restore"></v-icon>
              </button>
              <button
                @click="onClickSearch"
                style="background: #45bee5; width: 76%"
                class="text-white"
              >
                Tìm kiếm
              </button>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </div>

    <!-- category  -->
    <div class="category" style="margin-top: 40px">
      <v-container style="max-width: 1200px">
        <v-row>
          <h1 class="font-weight-light">Danh mục</h1>

          <swiper
            :navigation="false"
            :breakpoints="{
              '@0.00': {
                slidesPerView: 1,
                spaceBetween: 10,
              },
              '@0.75': {
                slidesPerView: 3,
                spaceBetween: 10,
              },
              '@1.00': {
                slidesPerView: 6,
                spaceBetween: 10,
              },
            }"
            class="mySwiper"
          >
            <swiper-slide
              v-for="item in categories_img"
              :key="item"
              style="text-align: center"
            >
              <img
                @click="OpenTypeService(item.type)"
                :src="item.img"
                alt="avt"
                style="
                  width: 150px;
                  height: 150px;
                  border-radius: 50%;
                  object-fit: cover;
                  box-shadow: 0 25px 45px rgba(1, 2, 2, 0.1215686275);
                "
              />
            </swiper-slide>
          </swiper>
        </v-row>
      </v-container>
    </div>

    <!-- dịch vụ -->
    <div
      style="max-width: 1200px; margin: 0 auto; padding-bottom: 20px"
      v-if="dataFilterService.length"
      isService
    >
      <h1 class="my-3">Kết quả tìm kiếm</h1>

      <list-category-vue isService>
        <swiper-slide
          v-for="item in dataFilterService"
          :key="item.service_id"
          class="ma-2"
        >
          <router-link
            :to="{
              name: 'gk.details',
              params: { id: item.service_id },
            }"
            class="text-decoration-none text-black"
          >
            <v-card class="card-service">
              <v-img cover height="150" :src="item.service_img" />

              <div class="ma-4">
                <div
                  class="font-weight-bold"
                  style="
                    text-align: justify;
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    line-height: 20px;
                    -webkit-line-clamp: 2;
                    height: 100%;
                    min-height: 40px;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    font-size: 20px;
                  "
                >
                  {{ item.service_name }}
                </div>

                <ul class="pl-5">
                  <li class="text-caption">
                    <p
                      style="
                        text-align: justify;
                        width: 100%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        line-height: 20px;
                        -webkit-line-clamp: 5;
                        height: 200x;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                      "
                    >
                      {{ item.content_title }}
                    </p>
                  </li>
                </ul>
              </div>
              <div
                class="d-flex"
                style="
                  justify-content: space-between;
                  border-top: 1px solid #eee;
                "
              >
                <div class="ma-4">Giá</div>
                <div
                  class="mx-4"
                  style="
                    border-left: 1px solid #eee;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  "
                >
                  <strong class="ml-4">
                    {{ `${fPrice(item.service_price)}` }}
                  </strong>
                </div>
              </div>
            </v-card>
          </router-link>
        </swiper-slide>
      </list-category-vue>
    </div>

    <!-- dịch vụ -->
    <div style="max-width: 1200px; margin: 0 auto; padding-bottom: 20px">
      <h1 class="my-3">Gói nổi bật</h1>

      <list-category-vue isService>
        <swiper-slide
          v-for="item in dataService"
          :key="item.service_id"
          class="ma-2"
        >
          <router-link
            :to="{
              name: 'gk.details',
              params: { id: item.service_id },
            }"
            class="text-decoration-none text-black"
          >
            <v-card class="card-service">
              <v-img cover height="150" :src="item.service_img" />

              <div class="ma-4">
                <div
                  class="font-weight-bold"
                  style="
                    text-align: justify;
                    width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    line-height: 20px;
                    -webkit-line-clamp: 2;
                    height: 100%;
                    min-height: 40px;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    font-size: 20px;
                  "
                >
                  {{ item.service_name }}
                </div>

                <ul class="pl-5">
                  <li class="text-caption">
                    <p
                      style="
                        text-align: justify;
                        width: 100%;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        line-height: 20px;
                        -webkit-line-clamp: 5;
                        height: 200x;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                      "
                    >
                      {{ item.content_title }}
                    </p>
                  </li>
                </ul>
              </div>
              <div
                class="d-flex"
                style="
                  justify-content: space-between;
                  border-top: 1px solid #eee;
                "
              >
                <div class="ma-4">Giá</div>
                <div
                  class="mx-4"
                  style="
                    border-left: 1px solid #eee;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  "
                >
                  <strong class="ml-4">
                    {{ `${fPrice(item.service_price)}` }}
                  </strong>
                </div>
              </div>
            </v-card>
          </router-link>
        </swiper-slide>
      </list-category-vue>
    </div>
  </div>
</template>
