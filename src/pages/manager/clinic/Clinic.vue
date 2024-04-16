<script>
import { computed, defineComponent, onBeforeMount, ref, watch } from "vue";
import { useStore } from "vuex";
import {
  appActions,
  appActionTypes,
  clinicActions,
  clinicActionTypes,
} from "../../../store/types";
import { debounce } from "lodash";

export default defineComponent({
  setup() {
    const store = useStore();
    const dispatch = store.dispatch;
    const selected = ref("");
    const search = ref("");
    const dialog = ref(false);
    const page = 1;

    onBeforeMount(() => {
      dispatch(clinicActions(clinicActionTypes.FETCH_ALL_CLINIC), {
        ...store.state["clinic"].filters,
      });
    });

    watch(
      () => store.state["clinic"].filters,
      (filters) => {
        dispatch(clinicActions(clinicActionTypes.FETCH_ALL_CLINIC), {
          ...filters,
        });
      }
    );

    watch(
      search,
      debounce((value) => {
        dispatch(clinicActions(clinicActionTypes.CHANGE_FILTER), {
          ...filters.value,
          page: 1,
          field: "type",
          search: value,
        });
      }, 500)
    );

    const dataClinic = computed(() => store.state.clinic.clinics);
    const pagination = computed(() => store.state.clinic.pagination);
    const isLoading = computed(() => store.state.clinic.isLoading);
    const filters = computed(() => store.state.clinic.filters);

    const handleChangePage = (newPage) => {
      dispatch(clinicActions(clinicActionTypes.CHANGE_FILTER), {
        ...filters.value,
        page: newPage,
      });
    };

    const onOpenDialogDelete = (clinic) => {
      selected.value = clinic;
      dialog.value = true;
    };

    const handleDelete = (clinic) => {
      dialog.value = false;
      dispatch(appActions(appActionTypes.SET_OVERLAY), true);
      dispatch(
        clinicActions(clinicActionTypes.FETCH_DELETE_CLINIC),
        clinic.clinic_id
      );
    };

    const onClose = () => {
      dialog.value = false;
    };

    return {
      onOpenDialogDelete,
      handleDelete,
      onClose,
      handleChangePage,
      dataClinic,
      pagination,
      dialog,
      selected,
      page,
      isLoading,
      search,
    };
  },
});
</script>

<template>
  <div>
    <v-container style="max-width: 1200px">
      <v-row>
        <v-col cols="12"
          ><h1 class="text-center">Danh sách cơ sở y tế</h1></v-col
        >
        <v-col cols="6" style="display: flex; align-items: center">
          <router-link
            :to="{
              name: 'clinic.add',
            }"
            class="text-decoration-none"
          >
            <v-btn variant="outlined">
              <v-icon icon="mdi-plus-circle-outline" style="font-size: 20px">
              </v-icon>
              Thêm
            </v-btn>
          </router-link>
        </v-col>

        <v-col cols="6">
          <div>
            <v-text-field
              v-model="search"
              density="compact"
              placeholder="Tìm kiếm theo tên cơ sở y tế"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              hide-details="auto"
            ></v-text-field>
          </div>
        </v-col>

        <v-col cols="12" sm="12">
          <v-sheet rounded="lg">
            <!-- Loading -->
            <div class="position-relative">
              <v-progress-linear
                v-if="isLoading"
                color="green"
                indeterminate
                rounded
                height="3"
                class="position-absolute"
              />

              <v-table class="table_manager">
                <thead>
                  <tr>
                    <th class="text-white">STT</th>
                    <th class="text-white">Hình ảnh</th>
                    <th class="text-white">Tên Phòng Khám</th>
                    <th class="text-white">Loại</th>
                    <th class="text-white">Thuộc khu vực</th>
                    <th class="text-white">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in dataClinic" :key="item.clinic_id">
                    <td>{{ index + 1 }}</td>
                    <td style="padding: 12px">
                      <v-sheet
                        class="rounded mx-0"
                        max-width="100"
                        elevation="12"
                        width="100%"
                      >
                        <v-img :src="item.clinic_img" class="rounded" />
                      </v-sheet>
                    </td>
                    <td>
                      <p class="text-truncate" style="max-width: 200px">
                        {{ item.clinic_name }}
                      </p>
                    </td>
                    <td>
                      {{ item.type }}
                    </td>
                    <td>
                      {{ item.area }}
                    </td>
                    <td>
                      <div class="d-flex">
                        <router-link
                          class="text-primary mr-4 text-decoration-none"
                          variant="outlined"
                          style="border: none"
                          :to="{
                            name: 'clinic.update',
                            params: {
                              clinicId: item.clinic_id,
                            },
                          }"
                        >
                          <v-icon icon="mdi-pencil-box-outline" class="text-h4">
                          </v-icon>
                        </router-link>
                        <div
                          class="cursor-point text-error"
                          variant="outlined"
                          @click="onOpenDialogDelete(item)"
                        >
                          <v-icon icon="mdi-delete" class="text-h4"> </v-icon>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </div>

            <!-- dialog -->
            <v-dialog v-model="dialog" persistent width="50%">
              <v-card>
                <v-card-title class="text-h5"
                  >Xác nhận trước khi xoá</v-card-title
                >
                <v-card-text
                  >Bạn có muốn xoá
                  <strong>{{ selected.clinic_name }}</strong>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="error" variant="text" @click="onClose(dialog)">
                    Huỷ
                  </v-btn>
                  <v-btn
                    color="green-darken-1"
                    variant="text"
                    @click="handleDelete(selected)"
                  >
                    Xoá
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <!-- pagination -->
            <div class="text-center mt-5">
              <v-pagination
                v-model="pagination.page"
                :length="pagination.totalPage"
                rounded="circle"
                @update:modelValue="handleChangePage"
              ></v-pagination>
            </div>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
