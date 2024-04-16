<script>
import { Form } from "vee-validate";
import { computed, defineComponent, onBeforeMount, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { toast } from "vue3-toastify";
import { deleteKeyObjectNull, getKeyObject } from "../../../utils/functions";

import * as Yup from "yup";
import _ from "lodash";

import {
  appActions,
  appActionTypes,
  clinicActions,
  clinicActionTypes,
  serviceActions,
  serviceActionTypes,
} from "../../../store/types";

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
    },
  },

  setup(props) {
    const store = useStore();
    const dispatch = store.dispatch;
    const editorData = ref("");

    const image = ref(undefined);
    const imgUrl = ref("");
    const ruleImage = [
      (v) =>
        !v ||
        !v.length ||
        v[0].size < 2000000 ||
        "Kích thước ảnh nhỏ hơn 2 MB!",
    ];

    const handleChangeSelect = (value) => {
      selectType.value = value;
    };

    const selectType = ref("");
    const types = [
      { label: "Vui lòng chọn", value: "" },
      { label: "CƠ BẢN", value: "BASIC" },
      { label: "NÂNG CAO", value: "ADVANCE" },
      { label: "NAM", value: "MALE" },
      { label: "NỮ", value: "FEMALE" },
      { label: "TRẺ EM", value: "CHILDREN" },
      { label: "NGƯỜI CAO TUỔI", value: "OLD_PERSON" },
    ];

    // select phòng khám
    const selectClinic = ref("");

    const dataClinic = computed(() => [
      { clinic_id: "", clinic_name: "Vui lòng chọn phòng khám..." },
      ...store.state.clinic.clinics,
    ]);

    onBeforeMount(() => {
      dispatch(clinicActions(clinicActionTypes.FETCH_ALL_CLINIC), {
        limit: 20,
      });
    });

    const handleSelectClinic = (value) => {
      selectClinic.value = value;
    };

    const onChangeEditor = (value) => {
      editorData.value = value;
    };

    onMounted(() => {
      if (_.isEmpty(props.initialValues)) return;

      selectType.value = props.initialValues?.type;
      selectClinic.value = props.initialValues?.clinic_id;
      editorData.value = props.initialValues?.service_desc;
      imgUrl.value = props.initialValues?.service_img;
    });

    const handleSubmit = async (values, { resetForm }) => {
      try {
        if (!imgUrl.value || !selectType.value) {
          toast.warn("Vui lòng chọn đầy đủ các trường!");
          return;
        }

        let data = {
          ...values,
          service_img: _.cloneDeep(image.value),
          service_desc: editorData.value,
          type: selectType.value,
          clinic_id: selectClinic.value,
        };

        dispatch(appActions(appActionTypes.SET_OVERLAY), true);

        // * ADD
        if (props.isModeAdd) {
          dispatch(
            serviceActions(serviceActionTypes.FETCH_CREATE_SERVICE),
            data
          );
        } else {
          // * UPDATE
          data = getKeyObject(
            [
              "service_name",
              "content_title",
              "service_desc",
              "service_price",
              "type",
              "service_img",
              "service_img_name",
              "clinic_id",
            ],
            deleteKeyObjectNull(data)
          );

          dispatch(serviceActions(serviceActionTypes.FETCH_UPDATE_SERVICE), {
            id: values.service_id,
            data: data,
          });
        }
      } catch (error) {
        console.log("HANDLE SUBMIT ERROR:::", error);
      }
    };

    const resetForm = () => {
      selectType.value = "";
      selectClinic.value = "";
      editorData.value = "";
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
      service_name: Yup.string()
        .min(8, "Ít nhất 8 ký tự.")
        .max(100, "Nhiều nhất 100 ký tự.")
        .required("Đây là trường bắt buộc."),
      content_title: Yup.string()
        .min(2, "Ít nhất 2 ký tự")
        .max(500, "Nhiều nhất 500 ký tự")
        .required("Đây là trường bắt buộc"),
    });

    return {
      resetForm,
      onChangeEditor,
      schema,
      handleSubmit,
      handleChangeSelect,
      onFileChange,
      types,
      isModeAdd: props.isModeAdd,
      image,
      imgUrl,
      ruleImage,
      selectType,
      editorData,
      selectClinic,
      dataClinic,
      handleSelectClinic,
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
            <!-- Tên Gói dịch vụ -->
            <v-col cols="12" xs="12" sm="12" md="6" lg="6">
              <text-input
                name="service_name"
                label="Tên gói khám"
                placeholder="VD: dịch vụ 1"
              />
            </v-col>

            <!-- Loại -->
            <v-col cols="12" xs="12" sm="12" md="6" lg="6">
              <v-select
                v-model="selectType"
                :items="types"
                label="Loại"
                item-title="label"
                item-value="value"
                density="default"
                @update:modelValue="handleChangeSelect"
              ></v-select>
            </v-col>

            <!-- Content title -->
            <v-col cols="12">
              <text-input
                name="content_title"
                placeholder="VD: Nội dung tiêu đề"
                label="Nội dung tiêu đề"
              />
            </v-col>

            <!-- Giá Gói dịch vụ -->
            <v-col cols="12" xs="12" sm="12" md="6" lg="6">
              <text-input
                name="service_price"
                label="Giá gói khám"
                placeholder="VD: 1000000"
              />
            </v-col>

            <!-- Thuộc phòng khám -->
            <v-col cols="12" xs="12" sm="12" md="6" lg="6">
              <v-select
                v-model="selectClinic"
                :items="dataClinic"
                label="Phòng khám"
                item-title="clinic_name"
                item-value="clinic_id"
                density="default"
                class="text-truncate"
                @update:modelValue="handleSelectClinic"
              ></v-select>
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
                label="Avatar"
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
                {{ isModeAdd ? "Tạo " : "Cập nhật" }}
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
