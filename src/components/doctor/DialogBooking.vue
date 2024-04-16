<script>
import format from "date-fns/format";
import vi from "date-fns/locale/vi";
import * as Yup from "yup";
import { toast } from "vue3-toastify";
import { Form } from "vee-validate";
import { computed, defineComponent, ref } from "vue";
import {
  appActions,
  appActionTypes,
  bookingActions,
  bookingActionTypes,
} from "../../store/types";
import {
  deleteKeyObjectNull,
  fPrice,
  getKeyObject,
} from "../../utils/functions";
import TextInput from "../forms/TextInput.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default defineComponent({
  components: {
    TextInput,
    Form,
  },
  props: {
    dialog: {
      type: Boolean,
    },
    onClose: {
      type: Function,
    },
    data: {
      type: Object,
    },
    timeValue: {
      type: Object,
    },
    date: {
      type: Date,
    },
    getCurrentUser: {
      type: Object,
    },
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const dispatch = store.dispatch;
    const picked = ref(props.getCurrentUser?.gender);
    const payments = ref("");
    const message = ref("");
    const reason_exam = ref("");

    const handleSubmit = async (values, { resetForm }) => {
      try {
        if (_.isEmpty(props.getCurrentUser)) {
          router.push("/login");
          return;
        }
        if (!reason_exam.value || !payments.value) {
          toast.warn("Vui lòng chọn đầy đủ tất cả trường!");
          return;
        }
        const full_name = values.last_name + " " + values.first_name;

        let data = {
          ...values,
          full_name: full_name,
          reason_exam: reason_exam.value,
          price: 250000,
          payments: payments.value,
          doctor_id: props.data?.user_id,
          work_id: props.timeValue.work_id,
          booking_date: new Date(props.date),
        };

        data = getKeyObject(
          [
            "user_id",
            "full_name",
            "email",
            "phone",
            "address",
            "gender",
            "reason_exam",
            "price",
            "payments",
            "doctor_id",
            "work_id",
            "booking_date",
          ],
          deleteKeyObjectNull(data)
        );

        dispatch(appActions(appActionTypes.SET_OVERLAY), true);

        dispatch(bookingActions(bookingActionTypes.FETCH_CREATE_BOOKING), {
          ...data,
          booking_date: new Date(props.date),
        });
      } catch (error) {
        console.log("HANDLE SUBMIT ERROR:::", error);
      }
    };

    const datePicker = computed(() => {
      if (!props.date) return;

      const date = format(props.date, "E P", {
        locale: vi,
      });

      return date;
    });

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

    return {
      fPrice,
      handleSubmit,
      schema,
      picked,
      message,
      payments,
      datePicker,
      reason_exam,
    };
  },
});
</script>

<template>
  <v-dialog v-model="dialog" persistent width="50%">
    <v-card>
      <div>
        <!-- Thông tin bác sĩ -->
        <v-row>
          <v-col cols="12" style="background: #eee; width: 100%">
            <v-btn
              style="position: fixed; right: 0"
              variant="plain"
              @click="onClose"
            >
              <v-icon icon=" mdi-close" style="font-size: 30px"></v-icon>
            </v-btn>
            <div class="pa-4">
              <v-row class="d-flex" style="min-height: 150px">
                <v-col cols="4">
                  <img
                    :src="data?.avatar"
                    style="
                      width: 150px;
                      height: 150px;
                      border-radius: 50%;
                      object-fit: cover;
                      margin: auto;
                    "
                  />
                </v-col>

                <v-col cols="8">
                  <v-card-title class="pa-2" style="font-size: 16px">
                    ĐẶT LỊCH KHÁM
                  </v-card-title>
                  <v-card-title class="text-black pa-2 py-0">
                    Bác sĩ: {{ data?.last_name }} {{ data?.first_name }}
                  </v-card-title>
                  <v-card-text class="pa-2 pb-0">
                    Ngày khám: {{ datePicker }}
                  </v-card-text>
                  <v-card-text class="pa-2 pb-0">
                    Giờ khám: {{ timeValue?.value }}
                  </v-card-text>
                </v-col>
              </v-row>
            </div>
          </v-col>
          <v-col cols="12">
            <div>
              <v-card
                max-width="200"
                variant="outlined"
                color="error"
                class="ml-4"
              >
                <v-card-item class="text-center">
                  <div style="text-transform: uppercase">Giá khám</div>
                  <strong>{{ `${fPrice(250000)}` }}</strong>
                </v-card-item>
              </v-card>

              <div class="px-4">
                <v-row>
                  <Form
                    @submit="handleSubmit"
                    :validation-schema="schema"
                    :initial-values="getCurrentUser"
                    style="width: 100%"
                  >
                    <v-col cols="12" class="text-center mt-2">
                      <h1 style="color: #1e56c5">
                        Phiếu điền thông tin cá nhân
                      </h1>
                    </v-col>

                    <!-- Giới tính -->
                    <v-col
                      class="d-flex py-1"
                      cols="12"
                      style="flex-direction: column"
                    >
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

                    <!-- lastName -->
                    <v-col cols="12" style="padding: 0 12px 4px 12px">
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
                    <v-col cols="12" style="padding: 0 12px 4px 12px">
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
                      <v-textarea
                        clearable
                        label="Lý do khám"
                        variant="outlined"
                        v-model="reason_exam"
                      ></v-textarea>
                    </v-col>

                    <!-- Hình thức thanh toán -->
                    <v-col
                      class="d-flex py-1"
                      cols="12"
                      style="flex-direction: column"
                    >
                      <h3>Hình thức thanh toán:</h3>
                      <div>
                        <input
                          type="radio"
                          class="mx-1"
                          value="offline"
                          v-model="payments"
                        />
                        <label class="mr-3" for="offline">
                          Thanh toán sau tại cơ sở y tế</label
                        >
                        <input
                          type="radio"
                          class="mx-1"
                          value="online"
                          v-model="payments"
                        />
                        <label for="online"> Thanh toán online</label>
                      </div>
                    </v-col>

                    <v-col cols="12">
                      <div class="font-weight-thin">
                        <div
                          class="pl-0"
                          style="background: #f8f8f8; border-radius: 2px"
                        >
                          <div
                            class="pa-3 px-5"
                            style="
                              display: flex;
                              justify-content: space-between;
                            "
                          >
                            <span>Giá khám</span>
                            <strong>{{ `${fPrice(250000)}` }}</strong>
                          </div>
                          <div
                            class="pa-3 px-5"
                            style="
                              display: flex;
                              justify-content: space-between;
                            "
                          >
                            <span>Phí đặt lịch</span>
                            <span>Miễn phí</span>
                          </div>

                          <div
                            class="pa-3 px-5"
                            style="
                              display: flex;
                              justify-content: space-between;
                              background: #eee;
                            "
                          >
                            <span>Tổng cộng</span>
                            <span class="text-error">
                              {{ `${fPrice(250000)}` }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </v-col>

                    <v-col class="text-center">
                      <p style="color: #1e56c5; font-style: italic">
                        Quý khách vui lòng điền đầy đủ thông tin để tiết kiệm
                        thời gian làm thủ tục khám
                      </p>
                    </v-col>

                    <v-col cols="12">
                      <div class="font-weight-thin">
                        <div
                          class="pl-0"
                          style="background: #d4effc; border-radius: 2px"
                        >
                          <div
                            class="pa-5"
                            style="display: flex; flex-direction: column"
                          >
                            <h3>LƯU Ý</h3>
                            <span>
                              Thông tin anh/chị cung cấp sẽ được sử dụng làm hồ
                              sơ khám bệnh, khi điền thông tin anh/chị vui lòng:
                            </span>
                            <ul style="padding: 0 0 0 20px">
                              <li>
                                Ghi rõ họ và tên, viết hoa những chữ cái đầu
                                tiên, ví dụ: Trần Văn Phú
                              </li>
                              <li>
                                Điền đầy đủ, đúng và vui lòng kiểm tra lại thông
                                tin trước khi ấn "Xác nhận"
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </v-col>

                    <v-col
                      cols="12"
                      class="d-flex"
                      style="justify-content: end"
                    >
                      <v-btn
                        style="color: #fff; background: red"
                        @click="onClose"
                      >
                        Huỷ lịch
                      </v-btn>
                      <v-btn
                        style="color: #fff; background: #ffc419"
                        class="ml-2"
                        type="submit"
                      >
                        Xác nhận
                      </v-btn>
                    </v-col>
                  </Form>
                </v-row>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped>
textarea {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 8px;
}

.v-card::-webkit-scrollbar {
  width: 0px;
}
</style>
