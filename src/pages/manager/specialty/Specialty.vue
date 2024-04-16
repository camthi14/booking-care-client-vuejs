<script>
import { computed, defineComponent, onBeforeMount, ref, watch } from "vue";
import { useStore } from "vuex";
import {
  appActions,
  appActionTypes,
  specialtyActions,
  specialtyActionTypes,
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
      dispatch(specialtyActions(specialtyActionTypes.FETCH_ALL_SPECIALTY), {
        ...store.state["specialty"].filters,
      });
    });

    watch(
      () => store.state["specialty"].filters,
      (filters) => {
        dispatch(specialtyActions(specialtyActionTypes.FETCH_ALL_SPECIALTY), {
          ...filters,
        });
      }
    );

    watch(
      search,
      debounce((value) => {
        dispatch(specialtyActions(specialtyActionTypes.CHANGE_FILTER), {
          ...filters.value,
          page: 1,
          field: "specialty_name",
          search: value,
        });
      }, 500)
    );

    const dataSpecialty = computed(() => store.state.specialty.specialties);
    const pagination = computed(() => store.state.specialty.pagination);
    const isLoading = computed(() => store.state.specialty.isLoading);
    const filters = computed(() => store.state.specialty.filters);

    const handleChangePage = (newPage) => {
      dispatch(specialtyActions(specialtyActionTypes.CHANGE_FILTER), {
        ...filters.value,
        page: newPage,
      });
    };

    const onOpenDialogDelete = (specialty) => {
      selected.value = specialty;
      dialog.value = true;
    };

    const handleDelete = async (specialty) => {
      dialog.value = false;
      dispatch(appActions(appActionTypes.SET_OVERLAY), true);
      dispatch(
        specialtyActions(specialtyActionTypes.FETCH_DELETE_SPECIALTY),
        specialty.specialty_id
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
      dataSpecialty,
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
          ><h1 class="text-center">Danh sách chuyên khoa</h1></v-col
        >
        <v-col cols="6" style="display: flex; align-items: center">
          <router-link
            :to="{
              name: 'specialty.add',
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
              placeholder="Tìm kiếm theo tên chuyên khoa"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              hide-details="auto"
            ></v-text-field>
          </div>
        </v-col>

        <v-col cols="12" sm="12">
          <v-sheet rounded="lg">
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
                    <th class="text-white">Tên chuyên khoa</th>
                    <th class="text-white">Mô tả</th>
                    <th class="text-white">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in dataSpecialty"
                    :key="item.specialty_id"
                  >
                    <td>{{ index + 1 }}</td>
                    <td style="padding: 12px">
                      <v-sheet
                        class="rounded mx-0"
                        max-width="100"
                        elevation="12"
                        width="100%"
                      >
                        <v-img :src="item.specialty_img" class="rounded" />
                      </v-sheet>
                    </td>
                    <td>
                      <p class="text-truncate" style="max-width: 200px">
                        {{ item.specialty_name }}
                      </p>
                    </td>
                    <td>
                      <p class="text-truncate" style="max-width: 400px">
                        {{ item.specialty_desc }}
                      </p>
                    </td>
                    <td>
                      <div class="d-flex">
                        <router-link
                          class="text-primary mr-4 text-decoration-none"
                          variant="outlined"
                          style="border: none"
                          :to="{
                            name: 'specialty.update',
                            params: {
                              specialtyId: item.specialty_id,
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
                  <strong>{{ selected.specialty_name }}</strong>
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
