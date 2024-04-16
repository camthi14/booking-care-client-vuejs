<script>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { vi } from "date-fns/locale";
import { defineComponent, ref } from "vue";

export default defineComponent({
  components: { VueDatePicker },
  props: ["date"],
  emits: ["update:date"],
  setup(props, { emit }) {
    const dateLocal = ref(props.date);

    const format = (date) => {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();

      return `Ngày đã chọn ${day}/${month}/${year}`;
    };

    const handleDate = (modelData) => {
      dateLocal.value = modelData;
      emit("update:date", modelData);
    };

    return {
      dateLocal,
      vi,
      format,
      handleDate,
    };
  },
});
</script>

<template>
  <VueDatePicker
    class="date"
    v-model="dateLocal"
    :format="format"
    cancelText="Huỷ bỏ"
    selectText="Chọn ngày"
    :disabled-week-days="[0]"
    :min-date="new Date()"
    @update:model-value="handleDate"
  >
    <template #calendar-header="{ index, day }">
      <div :class="index === 6 ? 'red-color' : ''">
        {{ day }}
      </div>
    </template>
  </VueDatePicker>
</template>

<style scoped>
.red-color {
  color: red;
}
</style>
