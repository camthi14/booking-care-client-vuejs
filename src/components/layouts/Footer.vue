<script>
import { defineComponent } from "vue";
import Image from "../../assets/image/BookingCare.png";

export default defineComponent({
  setup() {
    return {
      Image,
    };
  },
});
</script>

<template>
  <v-footer style="background: #45bee5; color: #f9f9f9">
    <v-container style="max-width: 1200px">
      <v-row>
        <v-col cols="12" sm="6" md="4" lg="4" style="text-align: center">
          <div
            style="
              width: 150px;
              height: 150px;
              border-radius: 50%;
              margin: auto;
              border: 2px solid yellow;
              padding: 2px;
            "
          >
            <div
              style="
                width: 100%;
                border: 2px solid yellow;
                height: 100%;
                border-radius: 100%;
                padding: 2px;
              "
            >
              <img
                to="/"
                :src="Image"
                alt="avt"
                style="width: 100%; height: 100%; border-radius: 100%"
              />
            </div>
          </div>
          <div class="text-white">
            <p class="my-2">Công ty cổ phần Công nghệ BookingCare</p>
            <div>
              <p>
                <v-icon icon="mdi-map-marker"></v-icon>
                <span class="address-name">Address: Dai Hoc Can Tho</span>
              </p>
              <div class="my-2">
                <p color="#1f2226">
                  <v-icon class="mr-2" icon="mdi-cellphone-basic"></v-icon>ĐKKD
                  số: 0106790291
                </p>
                <p class="my-2">
                  <v-icon class="mr-2" icon="mdi-email-outline"></v-icon>Email:
                  Ashley@gmail.com
                </p>
              </div>
            </div>
          </div>
        </v-col>
        <v-col
          cols="12"
          sm="6"
          md="4"
          lg="4"
          class="px-5"
          style="
            display: flex;
            justify-content: center;
            align-items: self-end;
            font-size: 14px;
          "
        >
          <ul class="list-item">
            <li>Liên hệ hợp tác</li>
            <li>Gói chuyển đổi doanh nghiệp</li>
            <li>Tuyển dụng</li>
            <li>Câu hỏi thường gặp</li>
            <li>Điều khoản sử dụng</li>
            <li>Chính sách bảo mật</li>
            <li>Quy trình hỗ trợ giải quyết khiếu nại</li>
            <li>Quy chế hoạt động</li>
          </ul>
        </v-col>
        <v-col
          cols="12"
          sm="6"
          md="4"
          lg="4"
          style="display: flex; justify-content: center; align-items: center"
        >
          <ul class="list-item">
            <li style="list-style: none">
              <p class="title">Trụ sở tại Cần Thơ</p>
              <p class="font-weight-thin font-italic">
                Địa chỉ: Đại học Cần Thơ
              </p>
            </li>
            <li style="list-style: none">
              <p class="title">Văn phòng tại Cần Thơ</p>
              <p class="font-weight-thin font-italic">
                Trường công nghệ thông tin
              </p>
            </li>
            <li style="list-style: none">
              <p class="title">Hỗ trợ khách hàng</p>
              <p class="font-weight-thin font-italic">
                Bookingcare@gmail.com <strong>(7h30 - 20h)</strong>
              </p>
            </li>
          </ul>
        </v-col>

        <v-col
          cols="12"
          style="flex-direction: row; display: flex; justify-content: center"
        >
          {{ new Date().getFullYear() }} — <strong>Design by Cẩm Thi</strong>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<style scoped>
.list-item li {
  padding: 5px;
}

.title {
  font-weight: 700;
  text-transform: uppercase;
  color: #ddd;
}
</style>
