<script>
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { defineComponent, ref, watch } from "@vue/runtime-core";
import { uploadImage } from "../../utils/functions";

export default defineComponent({
  props: {
    editorData: {
      type: String,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const value = ref("");

    watch(
      () => props.editorData,
      (editorData, newData) => {
        value.value = editorData;
      },
      { immediate: true }
    );

    function uploader(editor) {
      editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
        return new uploadImage(loader);
      };
    }

    watch(value, (value) => {
      emit("update:modelValue", value);
    });

    return {
      editor: ClassicEditor,
      value,
      editorConfig: {
        extraPlugins: [uploader],
      },
    };
  },
});
</script>

<template>
  <ckeditor :editor="editor" v-model="value" :config="editorConfig"></ckeditor>
</template>
