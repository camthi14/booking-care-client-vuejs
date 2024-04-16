<script>
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { specialtyApi } from "../../apis";
import DoctorScheduleVue from "../../components/doctor/DoctorSchedule.vue";
import Footer from "../../components/layouts/Footer.vue";

export default defineComponent({
  components: {
    Footer,
    DoctorScheduleVue,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const back = ref(false);
    const showPrice = ref(false);
    const showInsurance = ref(false);
    const dataSpecialty = ref({});
    const isSpecialty = ref(false);
    const show = ref(false);

    const id = computed(() => route.params?.id);

    const getSpecialty = async (id) => {
      try {
        const response = await specialtyApi.getById(id);

        if (response && response.data) {
          return response.data;
        }
      } catch (error) {
        console.log("ERROR GET BY ID:::", error);
      }
    };

    onMounted(async () => {
      if (route.params?.id) {
        dataSpecialty.value = await getSpecialty(route.params.id);
      }
    });

    const items = ref([
      { label: "Hà nội", value: "HÀ NỘI" },
      { label: "Cần thơ", value: "CẦN THƠ" },
      { label: "Hồ chí minh", value: "HỒ CHÍ MINH" },
      { label: "Vĩnh long", value: "VĨNH LONG" },
    ]);

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

    const handleBack = () => {
      back.value = true;
      router.push("/chuyen-khoa");
    };

    const handleClick = () => {
      show.value = !show.value;
    };

    return {
      noneInsuranceList,
      showInsuranceList,
      showPriceList,
      nonePriceList,
      handleBack,
      handleClick,
      id,
      back,
      showPrice,
      showInsurance,
      items,
      dataSpecialty,
      show,
    };
  },
});
</script>

<template>
  <v-app id="inspire" :v-if="Object.keys(dataSpecialty).length">
    <!-- header  -->
    <v-app-bar style="background: #45bee5" class="text-white">
      <v-app-bar-nav-icon v-if="!back" @click="handleBack">
        <v-icon icon="mdi-arrow-left"></v-icon>
      </v-app-bar-nav-icon>
      <v-toolbar-title>
        Chuyên khoa:
        {{ dataSpecialty?.specialty_name }}
      </v-toolbar-title>
      <router-link to="/" class="text-white mr-5 text-h6">
        <v-icon icon="mdi-home"></v-icon>
      </router-link>
    </v-app-bar>

    <!-- main -->
    <v-main>
      <div class="specialty">
        <img
          :src="dataSpecialty?.specialty_img"
          alt="avt"
          class="specialty_img"
          :class="!show ? 'hidden_img' : ''"
        />
        <v-container
          style="max-width: 1200px"
          class="specialty_container"
          :class="!show ? 'hidden_container' : ''"
        >
          <div
            :class="!show ? 'text-desc' : ''"
            v-html="dataSpecialty?.specialty_desc"
          ></div>
          <v-btn
            v-if="!show"
            variant="plain"
            class="text-capitalize"
            style="color: #45bee5; padding: 0"
            @click="handleClick"
          >
            Hiện thêm
          </v-btn>
          <v-btn
            v-else
            variant="plain"
            class="text-capitalize"
            style="color: #45bee5; padding: 0"
            @click="handleClick"
          >
            Ẩn bớt
          </v-btn>
        </v-container>
      </div>

      <div class="doctor" style="background: #eee">
        <v-container style="max-width: 1200px; padding: 16px 30px">
          <v-row>
            <v-col cols="12">
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-btn v-bind="props">
                    Toàn Quốc
                    <v-icon class="ml-1" icon="mdi-chevron-down"></v-icon>
                  </v-btn>
                </template>

                <v-list>
                  <v-list-item v-for="(item, index) in items" :key="index">
                    <v-list-item-title class="p-0">
                      <v-btn
                        style="width: 100%"
                        variant="plain"
                        :class="{ 'hover-class': true }"
                        >{{ item.label }}</v-btn
                      >
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>

            <v-col cols="12">
              <div>
                <v-card
                  v-for="(item, index) in dataSpecialty.schedules"
                  :key="index"
                  style="margin: 0 0 20px; padding: 0 15px; min-height: 500px"
                >
                  <v-row>
                    <!-- information -->
                    <v-col class="doctor-information" cols="12" sm="4" lg="6">
                      <v-row class="d-flex py-3">
                        <v-col lg="4" cols="12">
                          <img
                            :src="item?.avatar"
                            alt="avt"
                            style="
                              width: 150px;
                              height: 150px;
                              border-radius: 50%;
                              object-fit: cover;
                            "
                          />
                        </v-col>

                        <v-col
                          lg="8"
                          cols="12"
                          class="pl-5"
                          style="min-width: 180px"
                        >
                          <v-card-title class="text-black">
                            {{ item?.last_name + " " + item?.first_name }}
                          </v-card-title>
                          <v-card-text
                            style="padding: 0 16px; font-style: italic"
                          >
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
                        </v-col>
                      </v-row>
                    </v-col>

                    <!-- schedule -->
                    <v-col cols="12" sm="8" lg="6">
                      <doctor-schedule-vue
                        :data="item"
                        :works="item.schedules"
                        :isSpecialty="(isSpecialty = true)"
                      />
                    </v-col>
                  </v-row>
                </v-card>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-main>

    <!-- Footer -->
    <Footer />
  </v-app>
</template>

<style lang="scss" scoped>
.hidden {
  max-height: 200px;
}

.hover-class:hover {
  color: #45bee5;
}

.specialty {
  .specialty_img {
    max-height: 550px;
    filter: opacity(0.2);
    position: relative;
    transition: all 0.25s;
  }
  .specialty_container {
    position: absolute;
    left: 0;
    top: 60px;
    right: 0;
  }
  .specialty_container > div {
    transition: all 0.25s;
  }
  .hidden_img {
    max-height: 200px;
    filter: opacity(0.2);
    position: relative;
  }
  .hidden_container > .text-desc {
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 25px;
    -webkit-line-clamp: 6;
    height: 150px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }
}
</style>
