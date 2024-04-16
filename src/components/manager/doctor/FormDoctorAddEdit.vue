<script>
import _ from "lodash";
import { Form } from "vee-validate";
import { computed, defineComponent, onBeforeMount, onMounted, ref } from "vue";
import { toast } from "vue3-toastify";
import { useStore } from "vuex";

import {
  appActions,
  appActionTypes,
  clinicActions,
  clinicActionTypes,
  userActions,
  userActionTypes,
} from "../../../store/types";
import { deleteKeyObjectNull, getKeyObject } from "../../../utils/functions";
import {
  schemaFormAddDoctor,
  schemaFormUpdateDoctor,
} from "../../../utils/schema";
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

    /**
     * select gender trình độ bác sĩ
     */

    const selectGender = ref("");
    const selectPosition = ref("");

    const genders = [
      { label: "Vui lòng chọn", value: "" },
      { label: "Nam", value: "MALE" },
      { label: "Nữ", value: "FEMALE" },
    ];

    const position = [
      { label: "Vui lòng chọn", value: "" },
      { label: "Bác sĩ", value: "NONE" },
      { label: "Thạc sĩ", value: "MASTER" },
      { label: "Tiến sĩ", value: "DOCTOR" },
      { label: "Phó giáo sư", value: "ASSOCIATE_PROFESSOR" },
      { label: "Giáo sư", value: "PROFESSOR" },
    ];

    const handleChangeSelect = (value) => {
      selectGender.value = value;
    };

    const handleSelectPosition = (value) => {
      selectPosition.value = value;
    };

    const onChangeEditor = (value) => {
      editorData.value = value;
    };

    /**
     * select phòng khám & chuyên khoa
     */

    const selectClinic = ref("");
    const selectSpecialty = ref("");

    // const dataSpecialty = ref([]);

    const dataClinic = computed(() => [
      { clinic_id: "", clinic_name: "Vui lòng chọn phòng khám..." },
      ...store.state.clinic.clinics,
    ]);

    const dataSpecialty = computed(() => {
      if (!store.state.clinic.specialties?.length) return null;

      return [
        { specialty_id: "", specialty_name: "Vui lòng chọn chuyên khoa..." },
        ...store.state.clinic.specialties,
      ];
    });

    onBeforeMount(() => {
      dispatch(clinicActions(clinicActionTypes.FETCH_ALL_CLINIC), {
        limit: 20,
      });
    });

    const handleSelectClinic = async (value) => {
      selectSpecialty.value = "";
      selectClinic.value = value;
      dispatch(
        clinicActions(clinicActionTypes.FETCH_ALL_SPECIALTY_CLINIC),
        value
      );
    };
    const handleSelectSpecialty = async (value) => {
      selectSpecialty.value = value;
    };

    onMounted(() => {
      if (_.isEmpty(props.initialValues)) return;

      selectGender.value = props.initialValues?.gender;
      selectPosition.value = props.initialValues?.doctor_position;
      selectSpecialty.value = props.initialValues?.specialty_id;
      selectClinic.value = props.initialValues?.clinic_id;
      selectGender.value = props.initialValues?.gender;
      imgUrl.value = props.initialValues?.avatar;
      editorData.value = props.initialValues?.doctor_desc;
    });

    const handleSubmit = async (values, { resetForm }) => {
      try {
        if (
          !imgUrl.value ||
          !selectGender.value ||
          !selectPosition.value ||
          !selectClinic.value
        ) {
          toast.warn("Vui lòng chọn đầy đủ tất cả trường!");
          return;
        }

        let data = {
          ...values,
          avatar: _.cloneDeep(image.value),
          gender: selectGender.value,
          doctor_position: selectPosition.value,
          doctor_desc: editorData.value,
          clinic_id: selectClinic.value,
          specialty_id: selectSpecialty.value,
          role: "DOCTOR",
        };

        dispatch(appActions(appActionTypes.SET_OVERLAY), true);
        //*ADD
        if (props.isModeAdd) {
          dispatch(userActions(userActionTypes.FETCH_CREATE_USER), data);
        } else {
          // * UPDATE
          data = getKeyObject(
            [
              "first_name",
              "last_name",
              "email",
              "phone",
              "address",
              "gender",
              "doctor_position",
              "doctor_desc",
              "content_title",
              "specialty_id",
              "clinic_id",
              "avatar",
              "file_name_avatar",
            ],
            deleteKeyObjectNull(data)
          );

          dispatch(userActions(userActionTypes.FETCH_UPDATE_DOCTOR), {
            id: values.user_id,
            data: data,
          });
        }
      } catch (error) {
        console.log("HANDLE SUBMIT ERROR:::", error);
      }
    };

    const resetForm = () => {
      selectGender.value = "";
      selectPosition.value = "";
      selectSpecialty.value = "";
      selectClinic.value = "";
      selectGender.value = "";
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

    return {
      schema: computed(() =>
        props.isModeAdd ? schemaFormAddDoctor : schemaFormUpdateDoctor
      ),
      onChangeEditor,
      handleSubmit,
      handleSelectClinic,
      handleSelectSpecialty,
      handleSelectPosition,
      handleChangeSelect,
      onFileChange,
      resetForm,
      genders,
      position,
      isModeAdd: props.isModeAdd,
      image,
      imgUrl,
      ruleImage,
      selectGender,
      selectPosition,
      selectClinic,
      selectSpecialty,
      dataClinic,
      dataSpecialty,
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
            <!-- lastName -->
            <v-col cols="12" xs="12" sm="12" md="6" lg="6">
              <text-input name="last_name" label="Họ" placeholder="VD: Khùng" />
            </v-col>

            <!-- firstName -->
            <v-col cols="12" xs="12" sm="12" md="6" lg="6">
              <text-input name="first_name" placeholder="VD: Thi" label="Tên" />
            </v-col>

            <!-- email -->
            <v-col
              cols="12"
              xs="12"
              sm="12"
              :md="isModeAdd ? 6 : 12"
              :lg="isModeAdd ? 6 : 12"
            >
              <text-input
                type="email"
                name="email"
                placeholder="VD: example@gmail.com"
                label="E-mail"
              />
            </v-col>

            <!-- password -->
            <v-col v-if="isModeAdd" cols="12" xs="12" sm="12" md="6" lg="6">
              <text-input
                type="password"
                name="password"
                placeholder="VD: Maukhau123@"
                label="Mật khẩu"
              />
            </v-col>

            <!-- phone -->
            <v-col cols="12" xs="12" sm="12" md="6" lg="6">
              <text-input
                name="phone"
                placeholder="VD: 0673491234"
                label="Số điện thoại"
              />
            </v-col>

            <!-- Address -->
            <v-col cols="12" xs="12" sm="12" md="6" lg="6">
              <text-input
                name="address"
                placeholder="VD: 21/A, Hưng Lợi, Ninh Kiều, Cần Thơ"
                label="Địa chỉ"
              />
            </v-col>

            <!-- Giới tính -->
            <v-col cols="12" xs="12" sm="12" md="6" lg="6">
              <v-select
                v-model="selectGender"
                :items="genders"
                label="Giới tính"
                item-title="label"
                item-value="value"
                density="default"
                @update:modelValue="handleChangeSelect"
              ></v-select>
            </v-col>

            <!--Trình độ bác sĩ -->
            <v-col cols="12" xs="12" sm="12" md="6" lg="6">
              <v-select
                v-model="selectPosition"
                :items="position"
                label="Trình độ"
                item-title="label"
                item-value="value"
                density="default"
                @update:modelValue="handleSelectPosition"
              ></v-select>
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

            <!-- Thuộc chuyên khoa -->
            <v-col v-if="dataSpecialty" cols="12" xs="12" sm="12" md="6" lg="6">
              <v-select
                v-model="selectSpecialty"
                :items="dataSpecialty"
                label="Chuyên khoa"
                item-title="specialty_name"
                item-value="specialty_id"
                density="default"
                @update:modelValue="handleSelectSpecialty"
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

            <!-- editorData -->
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
              <v-btn type="submit" color="#45bee5" class="ml-4 text-white">
                {{ isModeAdd ? "Tạo" : "Cập nhật" }}
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
