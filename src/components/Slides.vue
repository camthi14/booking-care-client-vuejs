<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import { computed, defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import image from "../assets/image/bookingcare-cover-4.jpg";
import image_kck from "../assets/image/kham_chuyen_khoa.png";
import image_ktq from "../assets/image/kham_tong_quat.png";
import image_spyt from "../assets/image/san_pham_yte.png";
import new1 from "../assets/image/slide/new1.jpg";
import new2 from "../assets/image/slide/new2.jpg";
import new3 from "../assets/image/slide/new3.jpg";

export default defineComponent({
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    const window = ref(0);
    const store = useStore();
    const router = useRouter();
    const selectSpecialty = ref("");

    const dataSpecialty = computed(() => [
      { specialty_id: "", specialty_name: "Tìm kiếm theo chuyên khoa..." },
      ...store.state.specialty.specialties,
    ]);

    const handleSelectSpecialty = async (value) => {
      selectSpecialty.value = value;
      router.push({
        name: "ck.details",
        params: { id: value },
      });
    };

    const categories = [
      {
        img: image_kck,
        title: "Khám chuyên khoa",
        to: {
          name: "ck.index",
        },
      },
      {
        img: image_ktq,
        title: "Khám tổng quát",
        to: {
          name: "gk.index",
        },
      },
      {
        img: image_spyt,
        title: "Gói khám",
        to: {
          name: "gk.index",
        },
      },
    ];

    const advertisement = [
      {
        img: new1,
        title: "Đặt khám nhanh chóng",
        sub: "Bệnh nhân chủ động chọn thông tin đặt khám",
      },
      {
        img: new2,
        title: "Thanh toán dễ dàng",
        sub: "Người dùng chọn và thực hiện thanh toán trên phần mềm",
      },
      {
        img: new3,
        title: "Nhận phiếu trực tuyến",
        sub: "Bệnh nhân sẽ nhận phiếu khám trực tuyến ngay trên gmail",
      },
    ];
    return {
      handleSelectSpecialty,
      dataSpecialty,
      selectSpecialty,
      window,
      image,
      categories,
      advertisement,
    };
  },
});
</script>

<template>
  <div class="slide">
    <v-img :src="image" cover>
      <div class="slide-content" variant="outlined">
        <h1 class="slide-content-title">
          <p style="font-size: 24px">NỀN TẢNG Y TẾ</p>
          <p>CHĂM SÓC SỨC KHOẺ</p>
        </h1>
        <!-- v-model="specialty" -->
        <div>
          <v-select
            v-model="selectSpecialty"
            :items="dataSpecialty"
            item-title="specialty_name"
            item-value="specialty_id"
            density="default"
            @update:modelValue="handleSelectSpecialty"
            hide-details
          >
          </v-select>
        </div>
      </div>

      <v-list>
        <v-list-item v-for="item in categories" :key="item">
          <router-link :to="item.to">
            <li>
              <v-avatar color="white" size="50" class="img-icon">
                <img :src="item.img" alt="avt" />
              </v-avatar>
              <p style="text-transform: capitalize" class="text-h7">
                {{ item.title }}
              </p>
            </li>
          </router-link>
        </v-list-item>
      </v-list>
    </v-img>

    <div style="padding: 0 12px">
      <v-container style="max-width: 1200px">
        <v-row>
          <swiper
            :navigation="false"
            :breakpoints="{
              '@0.00': {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              '@0.75': {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              '@1.00': {
                slidesPerView: 3,
                spaceBetween: 20,
              },
            }"
            class="mySwiper"
          >
            <swiper-slide
              v-for="item in advertisement"
              :key="item"
              class="info-content"
            >
              <div>
                <img :src="item.img" alt="" style="margin: 0" />
              </div>
              <div class="card">
                <b>{{ item.title }}</b>
                <p style="max-width: 300px">{{ item.sub }}</p>
              </div>
            </swiper-slide>
          </swiper>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.info-content {
  position: relative;
  margin: 0;

  img {
    border-radius: 10px;
    height: 200px;
  }
  .card {
    background: #fff;
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    text-align: center;
    min-height: 100px;
    padding: 0 12px;
    color: #1f2226;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    box-shadow: 0 25px 45px rgba(1, 2, 2, 0.1215686275);
  }
}
</style>
