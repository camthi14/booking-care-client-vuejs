<script>
import { defineComponent } from "vue";
import LoadingVue from "./components/Loading.vue";
import ToastVue from "./components/Toast.vue";

export default defineComponent({
  components: {
    LoadingVue,
    ToastVue,
  },
});
</script>

<template>
  <div>
    <loading-vue />
    <toast-vue />
    <router-view />
  </div>
</template>
