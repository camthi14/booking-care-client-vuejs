<script>
import { defineComponent, reactive, ref, watch } from "vue";
import * as Yup from "yup";
import { Form } from "vee-validate";
import TextInput from "./forms/TextInput.vue";
import { useStore } from "vuex";
import {
  appActions,
  appActionTypes,
  authActions,
  authActionTypes,
} from "../store/types";

export default defineComponent({
  components: {
    TextInput,
    Form,
  },
  setup() {
    const visible = ref(false);
    const dispatch = useStore().dispatch;

    const handleSubmit = async (values) => {
      dispatch(appActions(appActionTypes.SET_OVERLAY), true);
      dispatch(authActions(authActionTypes.FETCH_REGISTER), values);
    };

    const phoneRegExp = /(03|05|07|08|09|02|04|06|01[2|6|8|9])+([0-9]{7})\b/;

    const schema = Yup.object().shape({
      email: Yup.string()
        .email("Vui lòng nhập e-mail hợp lệ!")
        .required("Đây là trường bắt buộc."),
      first_name: Yup.string()
        .min(2, "Ít nhất 2 ký tự.")
        .max(30, "Nhiều nhất 30 ký tự.")
        .required("Đây là trường bắt buộc."),
      last_name: Yup.string()
        .min(2, "Ít nhất 2 ký tự.")
        .max(30, "Nhiều nhất 30 ký tự.")
        .required("Đây là trường bắt buộc."),
      phone: Yup.string()
        .matches(phoneRegExp, "Số điện thoại không hợp lệ.")
        .required("Số điện thoại là trường bắt buộc."),
      address: Yup.string()
        .min(2, "Ít nhất 2 ký tự")
        .max(500, "Nhiều nhất 500 ký tự.")
        .required("Đây là trường bắt buộc."),
      password: Yup.string()
        .min(4, "Ít nhất 4 ký tự.")
        .max(80, "Nhiều nhất 80 ký tự.")
        .required("Đây là trường bắt buộc."),
    });
    return {
      handleSubmit,
      schema,
      visible,
    };
  },
});
</script>

<template>
  <v-card class="card-res" style="border-radius: 12px" variant="outlined">
    <Form @submit="handleSubmit" :validation-schema="schema" style="width: 80%">
      <v-row>
        <v-col cols="12" class="text-center mt-2">
          <v-icon
            icon="mdi-pencil-box-outline text-h3"
            class="font-weight-thin"
          ></v-icon>
          <h1 class="font-weight-light">Đăng ký tài khoản</h1>
          <p class="font-weight-thin text-h7 my-2">Great to have back!</p>
        </v-col>

        <!-- lastName -->
        <v-col cols="12" md="6" lg="6" style="padding: 0 12px 4px 12px">
          <text-input
            density="compact"
            prepend-inner-icon="mdi-account"
            variant="outlined"
            name="last_name"
            label="Họ"
            placeholder="VD: Nguyễn Ngọc"
          />
        </v-col>

        <!-- firstName -->
        <v-col cols="12" md="6" lg="6" style="padding: 0 12px 4px 12px">
          <text-input
            density="compact"
            prepend-inner-icon="mdi-account"
            variant="outlined"
            name="first_name"
            placeholder="VD: Thi"
            label="Tên"
          />
        </v-col>

        <!-- email -->
        <v-col cols="12" style="padding: 0 12px 4px 12px">
          <text-input
            density="compact"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            type="email"
            name="email"
            placeholder="VD: example@gmail.com"
            label="E-mail"
          />
        </v-col>

        <!-- phone -->
        <v-col cols="12" style="padding: 0 12px 4px 12px">
          <text-input
            density="compact"
            prepend-inner-icon=" mdi-cellphone-basic"
            variant="outlined"
            name="phone"
            placeholder="VD: 0673491234"
            label="Số điện thoại"
          />
        </v-col>

        <!-- Address -->
        <v-col cols="12" style="padding: 0 12px 4px 12px">
          <text-input
            density="compact"
            prepend-inner-icon="mdi-map-marker-radius"
            variant="outlined"
            name="address"
            placeholder="VD: 21/A, Hưng Lợi, Ninh Kiều, Cần Thơ"
            label="Địa chỉ"
          />
        </v-col>

        <v-col cols="12" style="padding: 0 12px 4px 12px">
          <text-input
            density="compact"
            prepend-inner-icon="mdi-lock-outline"
            variant="outlined"
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="visible ? 'text' : 'password'"
            name="password"
            placeholder="VD: example@gmail.com"
            label="Mật khẩu"
            @click:append-inner="visible = !visible"
          />
        </v-col>

        <v-col cols="12" style="padding: 0 12px 4px 12px" class="center">
          <v-btn
            type="submit"
            :loading="loading"
            class="mt-3 d-block"
            style="
              background: linear-gradient(
                135deg,
                rgba(34, 193, 195, 1) 0%,
                rgba(253, 187, 45, 1) 100%
              );
            "
          >
            Đăng ký
            <template v-slot:loader>
              <span class="custom-loader">
                <v-icon light>mdi-cached</v-icon>
              </span>
            </template>
          </v-btn>
        </v-col>
        <v-col
          cols="12"
          style="padding: 0 12px 20px 12px"
          class="text-black cursor-point text-center my-2"
        >
          <router-link to="/login">Đăng nhập</router-link>
        </v-col>
      </v-row>
    </Form>
  </v-card>
</template>
