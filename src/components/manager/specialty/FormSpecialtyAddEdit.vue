<script>
import { Form } from "vee-validate";
import { defineComponent, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { toast } from "vue3-toastify";
import * as Yup from "yup";

import _ from "lodash";
import {
  appActions,
  appActionTypes,
  specialtyActions,
  specialtyActionTypes,
} from "../../../store/types";
import {
  convertSlug,
  deleteKeyObjectNull,
  getKeyObject,
} from "../../../utils/functions";
import TextInput from "../../forms/TextInput.vue";
import CKeditorCustomVue from "../CKeditorCustom.vue";

export default defineComponent({
  components: {
    TextInput,
    Form,
    CKeditorCustomVue,
  },
  props: {
    isModeAdd: {
      type: Boolean,
    },
    initialValues: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const dispatch = store.dispatch;

    const image = ref(undefined);
    const imgUrl = ref("");
    const ruleImage = [
      (v) =>
        !v ||
        !v.length ||
        v[0].size < 2000000 ||
        "Kích thước ảnh nhỏ hơn 2 MB!",
    ];
    const editorData = ref("");

    onMounted(() => {
      if (_.isEmpty(props.initialValues)) return;

      editorData.value = props.initialValues?.specialty_desc;
      imgUrl.value = props.initialValues?.specialty_img;
    });

    const handleSubmit = async (values, { resetForm }) => {
      try {
        if (!imgUrl.value) {
          toast.warn("Vui lòng chọn đầy đủ tất cả trường!");
          return;
        }

        let data = {
          ...values,
          specialty_name: values.specialty_name?.trim(),
          specialty_img: _.cloneDeep(image.value),
          slug: convertSlug(values.specialty_name),
          specialty_desc: editorData.value,
        };

        dispatch(appActions(appActionTypes.SET_OVERLAY), true);

        // * ADD
        if (props.isModeAdd) {
          dispatch(
            specialtyActions(specialtyActionTypes.FETCH_CREATE_SPECIALTY),
            data
          );
        } else {
          // * UPDATE
          data = getKeyObject(
            [
              "specialty_name",
              "slug",
              "specialty_desc",
              "specialty_img",
              "specialty_img_name",
            ],
            deleteKeyObjectNull(data)
          );

          dispatch(
            specialtyActions(specialtyActionTypes.FETCH_UPDATE_SPECIALTY),
            {
              id: values.specialty_id,
              data: data,
            }
          );
        }
      } catch (error) {
        console.log("HANDLE SUBMIT ERROR:::", error);
      }
    };

    const resetForm = () => {
      editorData.value = "";
    };

    const onChangeEditor = (value) => {
      editorData.value = value;
    };

    const createImage = (file) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        imgUrl.value = e.target.result;
      };
      reader.readAsDataURL(file);
    };

    const onFileChange = (files) => {
      image.value = files;

      if (!files?.length) {
        imgUrl.value = "";
        return;
      }

      createImage(files[0]);
    };

    const schema = Yup.object().shape({
      specialty_name: Yup.string()
        .min(8, "Ít nhất 8 ký tự.")
        .max(100, "Nhieu nhat 100 ký tự.")
        .required("Đây là trương bắt buộc."),
    });

    return {
      resetForm,
      onChangeEditor,
      schema,
      handleSubmit,
      onFileChange,
      isModeAdd: props.isModeAdd,
      image,
      imgUrl,
      ruleImage,
      editorData,
    };
  },
});
</script>
<template>
  <Form
    @submit="handleSubmit"
    :initial-values="initialValues"
    :validation-schema="schema"
  >
    <v-row>
      <v-col md="8" sm="12">
        <v-card class="card">
          <v-row>
            <!-- Tên chuyên khoa -->
            <v-col cols="12">
              <text-input
                name="specialty_name"
                label="Tên chuyên khoa"
                placeholder="VD: Tên chuyên khoa"
              />
            </v-col>

            <v-col cols="12">
              <CKeditorCustomVue
                :editorData="editorData"
                @update:modelValue="onChangeEditor"
              />
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col md="4" sm="12">
        <v-card class="card">
          <v-row>
            <!-- avatar  -->

            <v-col cols="12" v-if="imgUrl">
              <div class="wrapper__img">
                <img :src="imgUrl" />
              </div>
            </v-col>
            <!-- Avatar -->
            <v-col cols="12">
              <v-file-input
                label="Ảnh chuyên khoa"
                accept="image/png, image/jpeg, image/bmp"
                outlined
                dense
                :v-model="image || null"
                @update:modelValue="onFileChange"
              ></v-file-input>
            </v-col>

            <!-- submit -->
            <v-col cols="12" sm="12">
              <v-btn
                variant="outlined"
                color="error"
                v-if="isModeAdd"
                type="reset"
                @click="resetForm"
              >
                <v-icon icon="mdi-autorenew"></v-icon>
              </v-btn>
              <v-btn type="submit" color="#45bee5" class="text-white ml-4">
                {{ isModeAdd ? "Tạo " : "Cập nhật " }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </Form>
</template>

<style lang="scss" scoped>
.card {
  padding: 20px;
  box-shadow: 1px 2px 5px #999;
}

.wrapper__img {
  width: 350px;
  height: 200px;
  margin: 0 auto;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 2px;
  max-width: 100%;

  & > img {
    border-radius: 2px;
  }
}
</style>
