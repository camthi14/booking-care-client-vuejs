<template>
  <v-container
    fluid
    fill-height
    class="d-flex align-center justify-center customer"
  >
    <!-- <v-card>
     
    </v-card> -->
    <v-card class="card-700">
      <!-- Header của card -->
      <v-card-title class="headline text-success darken-1 white--text"
        >Đặt lịch khám thành công</v-card-title
      >

      <!-- Nội dung của card -->
      <v-card-text>
        <v-alert type="success" class="alert-large">
          Thông tin lịch khám vui lòng xem ở trang chi tiết.
        </v-alert>
      </v-card-text>

      <!-- Footer của card -->
      <v-card-actions>
        <v-btn>
          <router-link :to="{ name: 'bookings.details' }">
            Xem chi tiết
          </router-link>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<style scoped>
.customer {
  height: 100%;
}

.card-700 {
  min-width: 700px;
  padding: 16px;
}

.alert-large {
  font-size: 24px;
}
</style>
