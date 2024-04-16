<script>
import moment from "moment";
import { computed, defineComponent } from "vue";

export default defineComponent({
  setup(props) {
    const dataIsEmpty = computed(() => (props.data.length ? false : true));

    return {
      moment,
      dataIsEmpty,
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
    data: {
      type: Array,
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
        title="Thông tin bệnh nhân đặt lịch"
        style="position: fixed"
      >
        <v-btn style="right: 0" variant="plain" @click="onCloseDialog">
          <v-icon icon=" mdi-close" style="font-size: 30px"></v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text v-if="!dataIsEmpty" style="padding-top: 70px">
        <div
          class="pl-0 my-2"
          style="background: #d4effc; border-radius: 5px"
          v-for="item in data"
          :key="item.booking_id"
        >
          <div class="pt-2 px-5">
            <span>Họ tên: </span>
            <b>{{ item?.full_name }}</b>
          </div>
          <div class="pb-2 px-5">
            <span>Lý do Khám: </span>
            <b>{{ item?.reason_exam }}</b>
          </div>
        </div>
      </v-card-text>

      <v-card-text v-else style="padding-top: 70px" class="text-center">
        Không có bệnh nhân nào!
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn color="error" variant="text" @click="onCloseDialog">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
