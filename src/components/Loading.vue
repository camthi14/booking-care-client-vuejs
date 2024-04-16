<template>
  <div v-if="overlay" class="text-center">
    <v-overlay
      persistent
      :model-value="overlay"
      class="d-flex align-center justify-center"
      style="flex-direction: column"
    >
      <div class="text-center">
        <v-progress-circular
          color="#fff"
          indeterminate
          size="30"
        ></v-progress-circular>
        <p class="text-white">Đang tải...</p>
      </div>
    </v-overlay>
  </div>
</template>

<script>
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  setup() {
    const store = useStore();

    const overlay = computed(() => store.state["app"].openOverlay);

    return {
      overlay,
    };
  },
});
</script>
