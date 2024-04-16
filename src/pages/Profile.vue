<script>
import _ from "lodash";
import { Form } from "vee-validate";
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import * as Yup from "yup";
import TextInput from "../components/forms/TextInput.vue";
import {
  appActions,
  appActionTypes,
  userActions,
  userActionTypes,
} from "../store/types";
import { deleteKeyObjectNull, getKeyObject } from "../utils/functions";

export default defineComponent({
  components: {
    TextInput,
    Form,
  },
  setup() {
    const store = useStore();
    const dispatch = store.dispatch;
    const picked = ref("");
    const image = ref(undefined);
    const imgUrl = ref("");
    let uploader;
    const ruleImage = [
      (v) =>
        !v ||
        !v.length ||
        v[0].size < 2000000 ||
        "Kích thước ảnh nhỏ hơn 2 MB!",
    ];

    const getCurrentUser = computed(() =>
      !_.isEmpty(store.state.auth.user) ? store.state.auth.user : null
    );

    onMounted(() => {
      if (!_.isEmpty(store.state.auth.user)) {
        picked.value = store.state.auth.user.gender;
        imgUrl.value = store.state.auth.user.avatar;
      }
    });

    onMounted(() => {
      const specificElements = document.querySelector(".uploader");
      uploader = specificElements;
    });

    watch(
      () => store.state.auth.user,
      (user) => {
        picked.value = user.gender;
        imgUrl.value = user.avatar;
      }
    );

    const handleSubmit = async (values, { resetForm }) => {
      try {
        if (!getCurrentUser.value || !store.state.auth.accessToken) return;

        let data = {
          ...getCurrentUser.value,
          ...values,
          avatar: image.value ? Array.from(image.value) : null,
          gender: picked.value,
        };

        data = getKeyObject(
          [
            "first_name",
            "last_name",
            "email",
            "phone",
            "address",
            "gender",
            "avatar",
            "file_name_avatar",
          ],
          deleteKeyObjectNull(data)
        );

        dispatch(appActions(appActionTypes.SET_OVERLAY), true);
        dispatch(userActions(userActionTypes.FETCH_UPDATE_USER), {
          id: getCurrentUser.value.user_id,
          data: data,
          accessToken: store.state.auth.accessToken,
        });
      } catch (error) {
        console.log("HANDLE SUBMIT ERROR:::", error);
      }
    };

    const createImage = (file) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        imgUrl.value = e.target.result;
      };
      reader.readAsDataURL(file);
    };

    const onFileChanged = (event) => {
      const files = event.target.files;

      if (!event.target.files?.length) {
        imgUrl.value = "";
        return;
      }

      image.value = files;

      createImage(files[0]);
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
        .min(2, "Ít nhất 2 ký tự")
        .max(30, "Nhiều nhất 30 ký tự")
        .required("Đây là trường bắt buộc"),
      phone: Yup.string()
        .matches(phoneRegExp, "Số điện thoại không hợp lệ.")
        .required("Số điện thoại là trường bắt buộc"),
      address: Yup.string()
        .min(2, "Ít nhất 2 ký tự")
        .max(500, "Nhiều nhất 500 ký tự")
        .required("Đây là trường bắt buộc"),
    });

    const onButtonClick = () => {
      uploader?.click();
    };

    return {
      handleSubmit,
      onFileChanged,
      schema,
      getCurrentUser,
      picked,
      image,
      imgUrl,
      ruleImage,
      uploader,
      onButtonClick,
    };
  },
});
</script>

<template>
  <v-card style="max-width: 500px; margin: 20px auto">
    <Form
      @submit="handleSubmit"
      :validation-schema="schema"
      :initial-values="getCurrentUser"
      style="width: 100%"
    >
      <v-col cols="12" class="text-center mt-2">
        <h1 style="color: #1e56c5">Thông tin cá nhân</h1>
      </v-col>

      <v-col
        align-self="start"
        class="d-flex justify-center align-center pa-0"
        cols="12"
      >
        <v-avatar
          class="profile avatar-center-height avatar-shadow"
          color="grey"
          size="164"
        >
          <v-btn @click="onButtonClick" class="upload-btn" x-large icon>
            <v-icon> mdi-camera </v-icon>
          </v-btn>
          <input
            ref="uploader"
            class="d-none uploader"
            type="file"
            accept="image/*"
            @change="onFileChanged"
          />
          <v-img v-if="imgUrl" :src="imgUrl"></v-img>
        </v-avatar>
      </v-col>

      <!-- Giới tính -->
      <v-col class="d-flex py-1" cols="12" style="flex-direction: column">
        <h3>Giới tính</h3>
        <div>
          <input
            type="radio"
            class="mx-1"
            id="male"
            value="MALE"
            v-model="picked"
          />
          <label class="mr-3" for="male">Nam</label>
          <input
            type="radio"
            class="mx-1"
            id="female"
            value="FEMALE"
            v-model="picked"
          />
          <label for="female">Nữ</label>
        </div>
      </v-col>

      <v-col cols="12" style="padding: 0 12px 4px 12px">
        <v-row>
          <!-- lastName -->
          <v-col cols="6">
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
          <v-col cols="6">
            <text-input
              density="compact"
              prepend-inner-icon="mdi-account"
              variant="outlined"
              name="first_name"
              placeholder="VD: Thi"
              label="Tên"
            />
          </v-col>
        </v-row>
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

      <v-col cols="12" class="pt-1">
        <v-btn
          style="color: #fff; background: #ffc419; margin: 0 auto"
          type="submit"
          class="d-flex"
        >
          Cập nhật
        </v-btn>
      </v-col>
    </Form>
  </v-card>
</template>

<style lang="scss" scoped>
.avatar-shadow {
  box-shadow: 0px 0px 10px 0px rgba(12, 99, 112, 0.75);
  -webkit-box-shadow: 0px 0px 10px 0px rgba(12, 80, 112, 0.75);
  -moz-box-shadow: 0px 0px 10px 0px rgba(12, 90, 112, 0.75);
}

.upload-btn {
  position: absolute !important;
  z-index: 999;
  top: 121px;
  color: cadetblue;
  background: blueviolet;
  background: rgb(125, 198, 163);
  background: linear-gradient(
    50deg,
    rgba(125, 198, 163, 1) 0%,
    rgba(35, 216, 227, 1) 72%
  );
}
</style>
