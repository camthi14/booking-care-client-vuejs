<script>
import { debounce } from "lodash";
import { useStore } from "vuex";
import { fPrice } from "../../../utils/functions";
import { computed, defineComponent, onBeforeMount, ref, watch } from "vue";

import {
  appActions,
  appActionTypes,
  serviceActions,
  serviceActionTypes,
} from "../../../store/types";

export default defineComponent({
  setup() {
    const store = useStore();
    const dispatch = store.dispatch;
    const selected = ref("");
    const search = ref("");
    const dialog = ref(false);
    const page = 1;

    onBeforeMount(() => {
      dispatch(serviceActions(serviceActionTypes.FETCH_ALL_SERVICE), {
        ...store.state["service"].filters,
      });
    });

    watch(
      () => store.state["service"].filters,
      (filters) => {
        dispatch(serviceActions(serviceActionTypes.FETCH_ALL_SERVICE), {
          ...filters,
        });
      }
    );

    watch(
      search,
      debounce((value) => {
        dispatch(serviceActions(serviceActionTypes.CHANGE_FILTER), {
          ...filters.value,
          page: 1,
          field: "service_name",
          search: value,
        });
      }, 500)
    );

    const dataService = computed(() => store.state.service.services);
    const pagination = computed(() => store.state.service.pagination);
    const isLoading = computed(() => store.state.service.isLoading);
    const filters = computed(() => store.state.service.filters);

    const handleChangePage = (newPage) => {
      dispatch(serviceActions(serviceActionTypes.CHANGE_FILTER), {
        ...filters.value,
        page: newPage,
      });
    };

    const onOpenDialogDelete = (service) => {
      selected.value = service;
      dialog.value = true;
    };

    const handleDelete = (service) => {
      dialog.value = false;
      dispatch(appActions(appActionTypes.SET_OVERLAY), true);
      dispatch(
        serviceActions(serviceActionTypes.FETCH_DELETE_SERVICE),
        service.service_id
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
      fPrice,
      dataService,
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
        <v-col cols="12"><h1 class="text-center">Danh sách gói khám</h1></v-col>
        <v-col cols="6" style="display: flex; align-items: center">
          <router-link
            :to="{
              name: 'service.add',
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
              placeholder="Tìm kiếm theo tên gói khám"
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
                    <th class="text-white">Tên Gói Khám</th>
                    <th class="text-white">Loại</th>
                    <th class="text-white">Giá gói khám</th>
                    <th class="text-white">Thuộc cơ sở y tế</th>
                    <th class="text-white">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in dataService"
                    :key="item.service_id"
                  >
                    <td>{{ index + 1 }}</td>
                    <td style="padding: 12px">
                      <v-sheet
                        class="rounded mx-0"
                        max-width="100"
                        elevation="12"
                        width="100%"
                      >
                        <v-img :src="item.service_img" class="rounded" />
                      </v-sheet>
                    </td>
                    <td>
                      <p class="text-truncate" style="max-width: 200px">
                        {{ item.service_name }}
                      </p>
                    </td>
                    <td>
                      {{ item.type }}
                    </td>
                    <td>
                      {{ `${fPrice(item.service_price)}` }}
                    </td>
                    <td>
                      <p class="text-truncate" style="max-width: 200px">
                        {{ item.clinic_name }}
                      </p>
                    </td>
                    <td>
                      <div class="d-flex">
                        <router-link
                          class="text-primary mr-4 text-decoration-none"
                          variant="outlined"
                          style="border: none"
                          :to="{
                            name: 'service.update',
                            params: {
                              serviceId: item.service_id,
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
