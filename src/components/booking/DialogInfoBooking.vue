<script>
import { defineComponent } from "vue";
import moment from "moment";
import { fPrice } from "../../utils/functions";

export default defineComponent({
  setup() {
    return {
      moment,
      fPrice,
    };
  },

  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    onCloseDialog: {
      type: Function,
      required: true,
    },
    selected: {
      type: Object,
      required: true,
    },
    doctor: {
      type: Object,
      required: true,
    },
  },
});
</script>

<template>
  <v-dialog v-model="dialog" transition="dialog-top-transition" max-width="500">
    <v-card>
      <v-toolbar
        color="primary"
        title="Thông tin lịch khám"
        style="position: fixed"
      >
        <v-btn style="right: 0" variant="plain" @click="onCloseDialog">
          <v-icon icon=" mdi-close" style="font-size: 30px"></v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text style="padding-top: 70px">
        <div>
          <h2>Thông Tin Bệnh Nhân</h2>
          <div class="font-weight-thin">
            <div class="pl-0" style="background: #f8f8f8; border-radius: 5px">
              <div
                class="pa-2 px-5"
                style="display: flex; justify-content: space-between"
              >
                <span>Họ và Tên</span>
                <strong>{{ selected?.full_name }}</strong>
              </div>
              <div
                class="pa-2 px-5"
                style="display: flex; justify-content: space-between"
              >
                <span>Email</span>
                <strong>{{ selected?.email }}</strong>
              </div>
              <div
                class="pa-2 px-5"
                style="display: flex; justify-content: space-between"
              >
                <span>Số điện thoại</span>
                <strong>{{ selected?.phone }}</strong>
              </div>
              <div
                class="pa-2 px-5"
                style="display: flex; justify-content: space-between"
              >
                <span>Địa chỉ</span>
                <strong>{{ selected?.address }}</strong>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2>Thông Tin Bác sĩ</h2>
          <div class="font-weight-thin">
            <div class="pl-0" style="background: #f8f8f8; border-radius: 5px">
              <div
                class="pa-2 px-5"
                style="display: flex; justify-content: space-between"
              >
                <span>Họ và Tên</span>
                <strong
                  >{{ doctor?.last_name }} {{ doctor?.first_name }}</strong
                >
              </div>
              <div
                class="pa-2 px-5"
                style="display: flex; justify-content: space-between"
              >
                <span>Email</span>
                <strong>{{ doctor?.email }}</strong>
              </div>
              <div
                class="pa-2 px-5"
                style="display: flex; justify-content: space-between"
              >
                <span>Số điện thoại</span>
                <strong>{{ doctor?.phone }}</strong>
              </div>
              <div
                class="pa-2 px-5"
                style="display: flex; justify-content: space-between"
              >
                <span>Cơ sở y tế</span>
                <strong>{{ doctor?.clinic_name }}</strong>
              </div>
              <div
                class="pa-2 px-5"
                style="display: flex; justify-content: space-between"
              >
                <span>Chuyên khoa</span>
                <strong>{{ doctor?.specialty_name }}</strong>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h2>Thông Tin Đặt Khám</h2>
          <div>
            <div class="pl-0" style="background: #d4effc; border-radius: 5px">
              <div class="pa-2 px-5">
                <span>Lý do Khám: </span>
                <b>{{ selected?.reason_exam }}</b>
              </div>
              <div class="pa-2 px-5">
                <span>Ngày Khám: </span>
                <b>{{ moment(selected?.booking_date).format("DD/MM/YYYY") }}</b>
              </div>
              <div class="pa-2 px-5">
                <span>Hình thức thanh toán: </span>
                <b>{{ selected?.payments }}</b>
              </div>
              <div class="pa-2 px-5">
                <span>Giá Khám: </span>
                <b>{{ fPrice(selected?.price) }}</b>
              </div>
            </div>
          </div>
        </div>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn color="error" variant="text" @click="onCloseDialog">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped>
.v-card::-webkit-scrollbar {
  width: 0px;
}
</style>
