<script>
import { Autoplay, Navigation, Pagination } from "swiper";
import { Swiper } from "swiper/vue";
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    title: String,
    textButton: String,
    onClickButton: Function,
    data: Array,
    isDoctorWeek: Boolean,
    isService: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    Swiper,
  },
  setup() {
    return {
      modules: [Autoplay, Pagination, Navigation],
    };
  },
});
</script>

<template>
  <div>
    <div v-if="!isService">
      <div class="card-home-title mb-5">
        <h1 class="font-weight-light">{{ title }}</h1>
        <v-btn :to="onClickButton" color="#45bee5" variant="outlined"
          >{{ textButton }}
        </v-btn>
      </div>

      <swiper
        :navigation="true"
        :breakpoints="{
          '@0.00': {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          '@0.75': {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          '@1.00': {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          '@1.50': {
            slidesPerView: 4,
            spaceBetween: 20,
          },
        }"
        :modules="modules"
        class="mySwiper"
      >
        <slot />
      </swiper>
    </div>

    <div v-if="isService">
      <swiper
        :navigation="false"
        :autoplay="{
          delay: 2500,
          disableOnInteraction: true,
        }"
        :breakpoints="{
          '@0.00': {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          '@0.75': {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          '@1.00': {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          '@1.50': {
            slidesPerView: 4,
            spaceBetween: 20,
          },
        }"
        :modules="modules"
        class="mySwiper"
      >
        <slot />
      </swiper>
    </div>
  </div>
</template>
<style lang="scss">
.swiper-button-prev,
.swiper-button-next {
  color: #1f2226;
  &::after {
    font-size: 30px;
  }
}
</style>
