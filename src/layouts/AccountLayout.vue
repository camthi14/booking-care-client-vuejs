<script>
import { defineComponent } from "vue";
import "../assets/scss/Components/_form.scss";
import ToastVue from "../components/Toast.vue";

export default defineComponent({
  components: {
    ToastVue,
  },
  setup() {
    return {
      Image,
    };
  },
});
</script>

<template>
  <v-app>
    <v-main class="account-layout">
      <toast-vue />
      <v-container>
        <v-row>
          <v-col>
            <router-view />
          </v-col>

          <v-col class="d-flex" style="margin: auto">
            <v-card class="mx-auto" variant="outlined" style="border: none">
              <v-card-item>
                <div>
                  <div class="text-sub1 text-overline">WELCOME</div>
                  <div class="text-title text-h5" data-text="BOOKINGCARE">
                    BOOKINGCARE
                  </div>
                  <div class="text-sub">
                    Nền tảng y tế chăm sóc sức khoẻ toàn diện
                  </div>
                  <v-btn to="/" color="#1f2226" class="my-2" variant="outlined">
                    Khám phá
                  </v-btn>
                </div>
              </v-card-item>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style>
.text-title {
  font-size: 30px !important;
  font-weight: 500;
  letter-spacing: 8px !important;
  position: relative;
  animation: text-title 2s 1;
  margin-bottom: 8px;
  margin-top: 8px;
}
.text-title::before {
  content: attr(data-text);
  position: absolute;
  color: #fff;
  text-shadow: 1px 1px 2px #1f2226, 0 0 25px #45bee5, 0 0 5px #45bee5;
  width: 200px;
  overflow: hidden;
  white-space: nowrap;
  border-right: 4px solid #fff;
  animation: animate 8s linear infinite;
}
.text-sub1 {
  font-size: 20px !important;
}
.text-sub {
  font-size: 20px;
}
@keyframes text-title {
  0% {
    margin-bottom: -40px;
    margin-top: -40px;
  }
}
@keyframes animate {
  0%,
  10%,
  100% {
    width: 0;
  }
  70%,
  90% {
    width: 100%;
  }
}
</style>
