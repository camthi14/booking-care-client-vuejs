<script>
import { computed, defineComponent, watch } from "vue";
import { useStore } from "vuex";
import { appActions, appActionTypes } from "../store/types";

export default defineComponent({
  setup() {
    const store = useStore();

    const snackbar = computed(() => store.state["app"].snackbar.open);
    const timeout = computed(() => store.state["app"].snackbar.timeout);
    const color = computed(() => store.state["app"].snackbar.color);
    const text = computed(() => store.state["app"].snackbar.message);

    const onDeleteSnackbar = () => {
      store.dispatch(appActions(appActionTypes.SET_SNACKBAR), { open: false });
    };

    watch(
      () => store.state["app"].snackbar.open,
      (open) => {
        if (open) {
          setTimeout(
            () =>
              store.dispatch(appActions(appActionTypes.SET_SNACKBAR), {
                open: false,
              }),
            timeout.value + 5
          );
        }
      }
    );

    return {
      snackbar,
      timeout,
      color,
      text,
      onDeleteSnackbar,
    };
  },
});
</script>

<template>
  <div class="text-center" v-if="snackbar">
    <v-snackbar
      location="top right"
      v-model="snackbar"
      :timeout="timeout"
      :color="color"
    >
      {{ text }}

      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="onDeleteSnackbar">
          <v-icon icon="mdi-close"></v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
