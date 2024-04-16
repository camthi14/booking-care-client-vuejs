<script>
import { computed, defineComponent, ref, watch } from "vue";
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
    const email = ref("");
    const password = ref("");
    const visible = ref(false);

    const dialog = ref(false);
    const emailForgotPass = ref("");
    const phone = ref("");
    const messageAlert = ref("");
    const loadingLogin = computed(() => store.state["auth"].isLoading);
    let errors = {};

    const emailRules = [
      (v) => !!v || "Email là trường bắt buộc",
      (v) => /.+@.+\..+/.test(v) || "E-mail không hợp lệ",
    ];

    const passRules = [
      (v) => !!v || "Mật khẩu là trường bắt buộc",
      (v) => (v && v.length <= 80) || `Mật khẩu không vươt quá 80 kí tự`,
      (v) => (v && v.length >= 4) || `Mật ít nhất ${4} kí tự`,
    ];

    const phoneNumberRule = [
      (v) => !!v || "Só điện thoại là trường bắt buộc",
      (v) =>
        /(03|05|07|08|09|02|04|06|01[2|6|8|9])+([0-9]{7})\b/.test(v) ||
        "Số điện thoại không hợp lệ",
    ];

    const handleSubmit = async () => {
      return new Promise(async (resolve, reject) => {
        const data = {
          email: email.value,
          password: password.value,
        };

        store.dispatch(appActions(appActionTypes.SET_OVERLAY), true);
        store.dispatch(authActions(authActionTypes.FETCH_LOGIN), data);
      });
    };

    //Thực hiện chức năng quên mật khẩu
    const onOpenForgotPass = (value) => {
      dialog.value = true;
    };

    watch(emailForgotPass, (email) => {
      if (!/.+@.+\..+/.test(email)) {
        errors["email"] = true;
      } else {
        errors = {};
      }
    });

    const submitFormForgotPass = async () => {
      if (!emailForgotPass.value || !phone.value) return;

      const payload = {
        email: emailForgotPass.value,
        phone: phone.value,
      };

      store.dispatch(appActions(appActionTypes.SET_OVERLAY), true);
      store.dispatch(authActions(authActionTypes.FORGOT_PASSWORD), payload);
    };

    return {
      submitFormForgotPass,
      onOpenForgotPass,
      handleSubmit,
      email,
      emailForgotPass,
      password,
      passRules,
      emailRules,
      dialog,
      messageAlert,
      loadingLogin,
      visible,
      phoneNumberRule,
      phone,
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
        <h1 class="font-weight-light">Đăng nhập</h1>
        <p class="font-weight-thin text-h7 my-2">Great to have back!</p>
      </div>

      <v-text-field
        v-model="email"
        label="E-mail"
        :rules="emailRules"
        density="compact"
        prepend-inner-icon="mdi-email-outline"
        variant="outlined"
      />

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

      <p
        class="text-error cursor-point text-decoration-underline"
        style="display: inline-block"
        @click="onOpenForgotPass"
      >
        Quên mật khẩu?
      </p>

      <div class="center mb-3">
        <v-btn
          type="submit"
          :disabled="!email || !password || loadingLogin"
          :loading="loadingLogin"
          class="mt-3 text-center"
          style="
            background: linear-gradient(
              135deg,
              rgba(34, 193, 195, 1) 0%,
              rgba(253, 187, 45, 1) 100%
            );
          "
          >Đăng nhập
          <template v-slot:loader>
            <span class="custom-loader">
              <v-icon light>mdi-cached</v-icon>
            </span>
          </template>
        </v-btn>
      </div>

      <p class="text-black cursor-point text-center mb-3">
        Bạn chưa có tài khoản?
        <router-link to="/register">Đăng ký ngay</router-link>
      </p>

      <!-- model forgot password -->
      <v-dialog v-model="dialog" persistent width="1024">
        <v-form class="form-forgot-pass" @submit.prevent="submitFormForgotPass">
          <h1 class="mb-5 text-center">Quên mật khẩu</h1>

          <v-alert v-if="messageAlert" type="success" class="mb-3">{{
            messageAlert
          }}</v-alert>

          <v-text-field
            v-model="emailForgotPass"
            label="E-mail"
            :rules="emailRules"
          />

          <v-text-field
            v-model="phone"
            label="Số điện thoại"
            placeholder="Số điện thoại đăng ký tài khoản"
            :rules="phoneNumberRule"
          />

          <div class="text-center">
            <v-btn
              class="mt-5"
              color="error"
              variant="text"
              @click="dialog = false"
            >
              Huỷ
            </v-btn>
            <v-btn
              type="submit"
              class="mt-5"
              :loading="loading"
              :disabled="!emailForgotPass || !phone || loading"
              color="success"
            >
              Gửi
              <template v-slot:loader>
                <span class="custom-loader">
                  <v-icon light>mdi-cached</v-icon>
                </span>
              </template>
            </v-btn>
          </div>
        </v-form>
      </v-dialog>
    </v-form>
  </v-card>
</template>
