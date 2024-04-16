<script>
import { defineComponent } from "vue";
import qldv from "../assets/image/aboutme/quan-ly-dich-vu-khach-hang-1.jpg";
import tk from "../assets/image/aboutme/24-0.jpg";
import bg from "../assets/image/aboutme/1609.jpg_wh860.jpg";

export default defineComponent({
  components: {},
  setup() {
    const messages = [
      {
        step: "Bước 1",
        title: "TRUY CẬP WEBSITE",
        message: `Người dùng truy cập website để trải nghiệm sản phẩm tốt nhất và sử dụng các tính năng dịch vụ mới nhất.`,
        color: "deep-purple-lighten-1",
      },
      {
        step: "Bước 2",
        title: "ĐĂNG KÝ TÀI KHOẢN",
        message: "Thực hiện đăng ký đầy đủ các thông tin cần thiết.",
        color: "green",
      },
      {
        step: "Bước 3",
        title: "ĐẶT LỊCH KHÁM BỆNH",
        message: "Đặt lịch dễ dàng nhanh chóng",
        color: "organ",
      },
      {
        step: "Bước 4",
        title: "KHÁM VÀ THỰC HIỆN CẬN LÂM SÀNG",
        message:
          "Đến ngày khám, người bệnh vui lòng đến trực tiếp phòng khám hoặc quầy tiếp nhận theo như hướng dẫn trên phiếu khám.",
        color: "yellow",
      },
      {
        step: "Bước 5",
        title: "ĐẶT LỊCH TÁI KHÁM",
        message:
          "Sử dụng ứng dụng để đặt khám cho lần hẹn tái khám như BƯỚC 1 và BƯỚC 2.",
        color: "error",
      },
    ];
    return {
      messages,
      qldv,
      tk,
      bg,
    };
  },
});
</script>

<template>
  <div>
    <!-- slide -->
    <div class="background-top">
      <div style="max-width: 1200px; margin: auto">
        <div class="background-top-title" variant="outlined">
          <h1 class="text-center">ABOUT ME</h1>
        </div>
      </div>
    </div>

    <div style="max-width: 800px; margin: 0 auto">
      <v-timeline density="compact" align="start">
        <v-timeline-item
          v-for="(item, index) in messages"
          :key="index"
          :dot-color="item.color"
          size="x-small"
        >
          <div class="mb-4">
            <div class="font-weight-normal">
              <strong
                >{{ item.step }}
                <span style="color: blue">{{ item.title }} </span></strong
              >
            </div>
            <div>{{ item.message }}</div>
          </div>
        </v-timeline-item>
      </v-timeline>
    </div>

    <div style="max-width: 1200px; margin: 0 auto">
      <v-row>
        <v-col cols="12" class="text-center py-5">
          <h1 style="color: #1e56c5">TẠI SAO BẠN NÊN CHỌN CHÚNG TÔI?</h1>
          <p>
            Chúng tôi đã tích hợp Hệ thống Quản lý Phòng khám/Phòng mạch hoàn
            chỉnh của mình với nhiều tính năng ưu việt. Điều này giúp chúng tôi
            tạo ra một hệ sinh thái tiện dụng và an toàn cho Bệnh viện và Phòng
            khám/Phòng mạch.
          </p>
        </v-col>

        <v-col cols="12">
          <v-row>
            <v-col cols="6">
              <img
                :src="qldv"
                alt=""
                style="width: 300px; height: 300px; margin: auto"
              />
            </v-col>
            <v-col cols="6" style="margin: auto">
              <h2 style="color: #1e56c5">DỊCH VỤ QUẢN LÝ KHÁCH HÀNG</h2>
              <p>
                Bạn sẽ dễ dàng quản lý lịch khám hoặc tái khám của từng người
                bệnh đến được chia theo từng nguồn.
              </p>
            </v-col>
          </v-row>
        </v-col>

        <v-col cols="12">
          <v-row>
            <v-col cols="6" style="margin: auto">
              <h2 style="color: #1e56c5">BÁO CÁO THỐNG KÊ</h2>
              <p>
                ổng hợp tình hình hoạt động và tài chính của phòng khám/phòng
                mạch theo tổng hợp riêng với các biểu đồ đa dạng.
              </p>
            </v-col>
            <v-col cols="6">
              <img
                :src="tk"
                alt=""
                style="width: 300px; height: 300px; margin: auto"
              />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>

    <div class="background-bottom">
      <div style="max-width: 700px; margin: 0 auto">
        <h1 style="color: #1e56c5" class="py-3 text-center">
          ƯU ĐIỂM PHẦN MỀM
        </h1>
        <v-row style="font-size: 20px">
          <v-col cols="12" class="d-flex">
            <img
              src="https://medpro.vn/static/media/icon_tick.0b5e7e1c.svg"
              alt=""
              style="width: 20px; height: 20px; margin-right: 12px"
            />
            Giao diện đơn giản, dễ sử dụng
          </v-col>
          <v-col cols="12" class="d-flex">
            <img
              src="https://medpro.vn/static/media/icon_tick.0b5e7e1c.svg"
              alt=""
              style="width: 20px; height: 20px; margin-right: 12px"
            />

            Phù hợp theo từng loại hình phòng khám, đa khoa, chuyên khoa,...
          </v-col>
          <v-col cols="12" class="d-flex">
            <img
              src="https://medpro.vn/static/media/icon_tick.0b5e7e1c.svg"
              alt=""
              style="width: 20px; height: 20px; margin-right: 12px"
            />
            Ổn định, dữ liệu được bảo mật
          </v-col>
          <v-col cols="12" class="d-flex">
            <img
              src="https://medpro.vn/static/media/icon_tick.0b5e7e1c.svg"
              alt=""
              style="width: 20px; height: 20px; margin-right: 12px"
            />

            Tương thích trên nhiều thiết bị: Laptop, máy tính bảng, máy vi
            tính,...
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.background-top {
  position: relative;
  background: linear-gradient(to right, #08363633, #1c023c33),
    url("https://cdn.bookingcare.vn/fr/w1000/2023/03/31/182448-goi-cham-soc-suc-khoa-tai-nha.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 70%;
  width: 100%;

  &-title {
    font-size: 16px;
    padding: 50px 0;
    letter-spacing: 8px !important;
    color: #fff;
    text-shadow: 1px 1px 2px #1f2226, 0 0 25px #45bee5, 0 0 5px #45bee5;
  }
}

.background-bottom {
  position: relative;
  background: linear-gradient(to right, #08363633, #1c023c33),
    url("https://medpro.vn/static/media/BG_CLINIC.2ca22859.svg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 300px;
  width: 100%;
}
</style>
