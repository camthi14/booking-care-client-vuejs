<script>
import { ref, onMounted } from "vue";

export default {
  name: "BackToTopButton",
  setup() {
    const isVisible = ref(false);

    const handleScroll = () => {
      const scrollPos =
        window.pageYOffset || document.documentElement.scrollTop;
      isVisible.value = scrollPos > 200;
    };

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    onMounted(() => {
      window.addEventListener("scroll", handleScroll);
    });

    return {
      isVisible,
      scrollToTop,
    };
  },
};
</script>

<template>
  <div v-show="isVisible" class="back-to-top-btn" @click="scrollToTop">
    <v-icon class="mt-0" icon="mdi-arrow-up"></v-icon>
  </div>
</template>

<style>
.back-to-top-btn {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 43px;
  height: 44px;
  line-height: 40px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  background-color: #45bee5;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  opacity: 0.8;
  z-index: 9999;
  transform: translateY(0);
  transition: transform 0.25s ease-in-out;
}

.back-to-top-btn:hover {
  opacity: 1;
  animation: bounce 1s ease-in-out infinite;
}

.back-to-top-btn i {
  margin-top: 10px;
}

@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
