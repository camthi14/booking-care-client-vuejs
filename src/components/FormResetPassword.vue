<script>
import _ from "lodash";
import { computed, defineComponent, ref } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import {
  appActions,
  appActionTypes,
  authActions,
  authActionTypes,
} from "../store/types";

export default defineComponent({
  setup() {
    const store = useStore();
    const dispatch = store.dispatch;
    const password = ref("");
    const visible = ref(false);
    const loadingLogin = computed(() => store.state["auth"].isLoading);
    const route = useRoute();

    const passRules = [
      (v) => !!v || "Password là trường bắt buộc",
      (v) => (v && v.length <= 80) || `Mật khẩu không vươt quá 80 kí tự`,
      (v) => (v && v.length >= 4) || `Mật ít nhất ${4} kí tự`,
    ];

    const handleSubmit = async () => {
      return new Promise(async (resolve, reject) => {
        if (_.isEmpty(route.query)) return;

        const payload = {
          password: password.value,
          userId: route.query.user_id,
          token: route.query.token,
        };

        dispatch(appActions(appActionTypes.SET_OVERLAY), true);
        dispatch(authActions(authActionTypes.RESET_PASSWORD), payload);
      });
    };

    return {
      handleSubmit,
      password,
      loadingLogin,
      visible,
      passRules,
    };
  },
});
</script>

<template>
  <v-card
    style="border-radius: 12px"
    variant="outlined"
    class="card-login"
    elevation="8"
    max-width="448"
    rounded="lg"
  >
    <v-form @submit.prevent="handleSubmit" style="width: 80%">
      <div class="text-center mt-5">
        <v-icon
          icon="mdi-pencil-box-outline text-h3"
          class="font-weight-thin"
        ></v-icon>
        <h1 class="font-weight-light">Thay đổi mật khẩu</h1>
        <p class="font-weight-thin text-h7 my-2">Great to have back!</p>
      </div>

      <v-text-field
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'"
        density="compact"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        class="mt-2"
        v-model="password"
        :rules="passRules"
        label="Mật khẩu"
        @click:append-inner="visible = !visible"
      />

      <div class="center mb-3">
        <v-btn
          type="submit"
          :disabled="!password || loadingLogin"
          :loading="loadingLogin"
          class="mt-3 text-center"
          style="
            background: linear-gradient(
              135deg,
              rgba(34, 193, 195, 1) 0%,
              rgba(253, 187, 45, 1) 100%
            );
          "
          >Thay đổi
          <template v-slot:loader>
            <span class="custom-loader">
              <v-icon light>mdi-cached</v-icon>
            </span>
          </template>
        </v-btn>
      </div>
    </v-form>
  </v-card>
</template>
