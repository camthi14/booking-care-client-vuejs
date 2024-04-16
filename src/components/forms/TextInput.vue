<script setup>
import { toRef, defineProps, defineComponent, ref, computed, watch } from "vue";
import { useField } from "vee-validate";

const props = defineProps({
  type: {
    type: String,
    default: "text",
  },

  value: {
    type: String,
    default: "",
  },

  name: {
    type: String,
    required: true,
  },

  successMessage: {
    type: String,
    default: "",
  },

  placeholder: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
});

const visible = ref(false);

const handleClick = () => {
  visible.value = !visible.value;
};

const name = toRef(props, "name");

const {
  value: inputValue,
  errorMessage,
  handleBlur,
  handleChange,
  meta,
} = useField(name, undefined, {
  initialValue: props.value,
});
</script>

<template>
  <v-text-field
    :append-inner-icon="
      type === 'password' ? (visible ? 'mdi-eye-off' : 'mdi-eye') : ''
    "
    :type="type === 'password' ? (visible ? 'text' : 'password') : type"
    @click:append-inner="handleClick"
    :name="name"
    :label="label"
    v-model="inputValue"
    :error="!!errorMessage"
    :error-messages="errorMessage && errorMessage"
    :placeholder="placeholder"
    @input="handleChange"
    @blur="handleBlur"
  />
</template>
