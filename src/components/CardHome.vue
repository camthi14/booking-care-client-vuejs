<script>
import { SwiperSlide } from "swiper/vue";
import { computed, defineComponent, onBeforeMount } from "vue";
import { useStore } from "vuex";
import {
  clinicActions,
  clinicActionTypes,
  serviceActions,
  serviceActionTypes,
  specialtyActions,
  specialtyActionTypes,
  userActions,
  userActionTypes,
} from "../store/types";
import ListCategoryVue from "./home/ListCategory.vue";

export default defineComponent({
  components: {
    SwiperSlide,
    ListCategoryVue,
  },
  setup() {
    const store = useStore();
    const dispatch = store.dispatch;

    onBeforeMount(() => {
      dispatch(clinicActions(clinicActionTypes.FETCH_ALL_CLINIC), {
        limit: 20,
      });
      dispatch(specialtyActions(specialtyActionTypes.FETCH_ALL_SPECIALTY), {
        limit: 20,
      });
      dispatch(userActions(userActionTypes.GET_DOCTOR), {
        limit: 20,
      });
      dispatch(serviceActions(serviceActionTypes.FETCH_ALL_SERVICE), {
        limit: 20,
      });
    });

    const dataFacilities = computed(() => store.state.clinic.clinics);
    const dataSpecialty = computed(() => store.state.specialty.specialties);
    const dataDoctor = computed(() => store.state.user.doctors.data);
    const dataService = computed(() => store.state.service.services);

    return {
      dataDoctor,
      dataFacilities,
      dataSpecialty,
      dataService,
    };
  },
});
</script>

<template>
  <div class="card-home">
    <!-- <CardService /> -->
    <div style="max-width: 1200px; margin: 0 auto; padding: 40px 12px">
      <list-category-vue isService>
        <swiper-slide v-for="item in dataService" :key="item.service_id">
          <div>
            <v-img
              cover
              height="150"
              :src="item.service_img"
              style="border-radius: 5px"
            />

            <div
              class="font-weight-bold mt-3"
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

            <v-card-actions style="padding: 0">
              <v-btn
                :to="{
                  name: 'gk.details',
                  params: { id: item.service_id },
                }"
                color="#45bee5"
                variant="outlined"
                >Xem chi tiết
              </v-btn>
            </v-card-actions>
          </div>
        </swiper-slide>
      </list-category-vue>
    </div>

    <!-- <CardSpecialty /> -->
    <div style="background: #eee">
      <div style="max-width: 1200px; margin: 0 auto; padding: 40px 12px">
        <list-category-vue
          title="Chuyên khoa phổ biến"
          textButton="Khám phá"
          onClickButton="/chuyen-khoa"
        >
          <swiper-slide v-for="item in dataSpecialty" :key="item.specialty_id">
            <router-link
              :to="{
                name: 'ck.details',
                params: { id: item.specialty_id },
              }"
              class="text-decoration-none text-black"
            >
              <v-img cover height="150" :src="item.specialty_img" />

              <div class="font-weight-bold" style="text-align: justify">
                {{ item.specialty_name }}
              </div>
            </router-link>
          </swiper-slide>
        </list-category-vue>
      </div>
    </div>

    <!-- <CardDoctor /> -->
    <div style="max-width: 1200px; margin: 0 auto; padding: 40px 12px">
      <list-category-vue
        title="Bác sĩ nổi bật tuần qua"
        textButton="Khám phá"
        onClickButton="/bac-si"
      >
        <swiper-slide v-for="item in dataDoctor" :key="item.user_id">
          <router-link
            :to="{
              name: 'bs.details',
              params: { id: item.user_id },
            }"
            class="text-decoration-none text-black"
          >
            <v-card class="card-doctor ma-1">
              <v-card-item>
                <img :src="item.avatar" :alt="item.avt || 'avt'" />

                <v-card-item class="px-0">
                  <v-card-title class="text-black">
                    {{ item.last_name + " " + item.first_name }}
                  </v-card-title>
                  <v-card-text>{{ item.specialty_name }}</v-card-text>
                </v-card-item>
              </v-card-item>
            </v-card>
          </router-link>
        </swiper-slide>
      </list-category-vue>
    </div>

    <!-- <CardHealthFacilities /> -->
    <div style="background: #eee">
      <div style="max-width: 1200px; margin: 0 auto; padding: 40px 12px">
        <list-category-vue
          title="Cơ sở y tế"
          textButton="Khám phá"
          onClickButton="/co-so-y-te"
        >
          <swiper-slide v-for="item in dataFacilities" :key="item.clinic_id">
            <router-link
              :to="{
                name: 'csyt.details',
                params: { id: item.clinic_id },
              }"
              class="text-decoration-none text-black"
            >
              <v-img cover height="150" :src="item.clinic_img" />

              <div class="font-weight-bold" style="text-align: justify">
                {{ item.clinic_name }}
              </div>
            </router-link>
          </swiper-slide>
        </list-category-vue>
      </div>
    </div>
  </div>
</template>
