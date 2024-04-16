<script>
import { defineComponent } from "vue";
import ButtonTopVue from "../components/ButtonTop.vue";

export default defineComponent({
  components: {
    ButtonTopVue,
  },
});
</script>

<template>
  <div>
    <button-top-vue />
    <router-view />
  </div>
</template>
