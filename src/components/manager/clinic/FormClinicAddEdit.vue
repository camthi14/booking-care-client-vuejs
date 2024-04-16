<script>
import { Form } from "vee-validate";
import { computed, defineComponent, onBeforeMount, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { toast } from "vue3-toastify";
import * as Yup from "yup";

import _ from "lodash";
import {
  appActions,
  appActionTypes,
  clinicActions,
  clinicActionTypes,
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
    const selectType = ref("");
    const types = [
      { label: "Vui lòng chọn", value: "" },
      { label: "PHÒNG KHÁM", value: "CLINIC" },
      { label: "CƠ SỞ", value: "FACILITY" },
      { label: "BỆNH VIỆN", value: "HOPITAL" },
      { label: "KHÁC", value: "OTHER" },
    ];

    const selectAreas = ref("");
    const areas = [
      { label: "Vui lòng chọn", value: "" },
      { label: "HÀ NỘI", value: "HÀ NỘI" },
      { label: "HỒ CHÍ MINH", value: "HỒ CHÍ MINH" },
      { label: "CẦN THƠ", value: "CẦN THƠ" },
      { label: "VĨNH LONG", value: "VĨNH LONG" },
    ];

    const selectSpecialty = ref([]);
    const dataSpecialty = computed(() => [
      ...store.state.specialty.specialties,
    ]);

    onBeforeMount(() => {
      dispatch(specialtyActions(specialtyActionTypes.FETCH_ALL_SPECIALTY), {
        limit: 20,
      });
    });

    const handleSelectSpecialty = async (value) => {
      selectSpecialty.value = value;
    };

    const handleChangeSelect = (value) => {
      selectType.value = value;
    };

    const handleSelectAreas = (value) => {
      selectAreas.value = value;
    };

    const onChangeEditor = (value) => {
      editorData.value = value;
    };

    onMounted(() => {
      if (_.isEmpty(props.initialValues)) return;

      selectType.value = props.initialValues?.type;
      selectAreas.value = props.initialValues?.area;
      editorData.value = props.initialValues?.clinic_desc;
      imgUrl.value = props.initialValues?.clinic_img;
      selectSpecialty.value = props.initialValues?.specialties;
    });

    const handleSubmit = async (values, { resetForm }) => {
      try {
        if (
          !imgUrl.value ||
          !selectType.value ||
          !selectAreas.value ||
          !selectSpecialty.value.length
        ) {
          toast.warn("Vui lòng chọn đầy đủ tất cả trường!");
          return;
        }

        let data = {
          ...values,
          clinic_name: values.clinic_name?.trim(),
          clinic_img: _.cloneDeep(image.value),
          slug: convertSlug(values.clinic_name),
          clinic_desc: editorData.value,
          type: selectType.value,
          area: selectAreas.value,
          specialties: JSON.stringify(selectSpecialty.value),
        };

        dispatch(appActions(appActionTypes.SET_OVERLAY), true);

        // * ADD
        if (props.isModeAdd) {
          dispatch(clinicActions(clinicActionTypes.FETCH_CREATE_CLINIC), data);
        } else {
          // * UPDATE
          data = getKeyObject(
            [
              "clinic_name",
              "slug",
              "clinic_desc",
              "clinic_address",
              "type",
              "area",
              "clinic_img",
              "clinic_img_name",
              "specialties",
            ],
            deleteKeyObjectNull(data)
          );

          dispatch(clinicActions(clinicActionTypes.FETCH_UPDATE_CLINIC), {
            id: values.clinic_id,
            data: data,
          });
        }
      } catch (error) {
        console.log("HANDLE SUBMIT ERROR:::", error);
      }
    };

    const resetForm = () => {
      editorData.value = "";
      selectType.value = "";
      selectAreas.value = "";
      selectSpecialty.value = [];
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
      clinic_name: Yup.string()
        .min(8, "Ít nhất 8 ký tự.")
        .max(100, "Nhieu nhat 100 ký tự.")
        .required("Đây là trương bắt buộc."),
      clinic_address: Yup.string()
        .min(2, "Ít nhất 2 ký tự")
        .max(300, "Nhiều nhất 300 ký tự")
        .required("Đây là trường bắt buộc"),
    });

    return {
      resetForm,
      onChangeEditor,
      schema,
      handleSubmit,
      handleChangeSelect,
      handleSelectAreas,
      onFileChange,
      types,
      areas,
      isModeAdd: props.isModeAdd,
      image,
      imgUrl,
      ruleImage,
      selectType,
      selectAreas,
      editorData,
      selectSpecialty,
      dataSpecialty,
      handleSelectSpecialty,
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
            <!-- Tên Phòng -->
            <v-col cols="12">
              <text-input
                name="clinic_name"
                label="Tên Phòng"
                placeholder="VD: Tên phòng khám"
              />
            </v-col>

            <!-- Đia chỉ  -->
            <v-col cols="12">
              <text-input
                name="clinic_address"
                placeholder="VD: 21/A, Hưng Lợi, Ninh Kiều, Cần Thơ"
                label="Địa chỉ"
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

            <!-- Khu vực -->
            <v-col cols="12" xs="12" sm="12" md="6" lg="6">
              <v-select
                v-model="selectAreas"
                :items="areas"
                label="Khu vực"
                item-title="label"
                item-value="value"
                density="default"
                @update:modelValue="handleSelectAreas"
              ></v-select>
            </v-col>

            <!-- Chuyên khoa -->
            <v-col cols="12">
              <v-select
                v-model="selectSpecialty"
                :items="dataSpecialty"
                chips
                label="Chuyên khoa"
                multiple
                item-title="specialty_name"
                item-value="specialty_id"
                density="default"
                @update:modelValue="handleSelectSpecialty"
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
