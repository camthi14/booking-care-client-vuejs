<script>
import { defineComponent } from "@vue/runtime-core";
import CardHome from "../components/CardHome.vue";
import Slides from "../components/Slides.vue";

export default defineComponent({
  components: {
    CardHome,
    Slides,
  },
  setup() {
    return {};
  },
});
</script>

<template>
  <div>
    <Slides />
    <v-row>
      <v-col cols="12" sm="12">
        <v-sheet rounded="lg">
          <CardHome />
        </v-sheet>
      </v-col>
    </v-row>
  </div>
</template>
