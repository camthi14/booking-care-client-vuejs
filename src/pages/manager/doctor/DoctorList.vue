<script>
import { useStore } from "vuex";
import {
  computed,
  defineComponent,
  onBeforeMount,
  onMounted,
  ref,
  watch,
} from "vue";
import {
  appActions,
  appActionTypes,
  userActions,
  userActionTypes,
} from "../../../store/types";
import _, { debounce } from "lodash";
import { roles } from "../../../store/modules/auth";

export default defineComponent({
  setup() {
    const store = useStore();
    const dispatch = store.dispatch;
    const selected = ref("");
    const search = ref("");
    const dialog = ref(false);
    const page = 1;
    const user = computed(() =>
      _.isEmpty(store.state.auth.user) ? null : store.state.auth.user
    );

    onMounted(() => {
      if (user.value && user.value.role === roles.ADMIN) {
        dispatch(userActions(userActionTypes.GET_DOCTOR), {
          ...store.state.user.doctors.filters,
        });
      } else {
        dispatch(userActions(userActionTypes.GET_DOCTOR), {
          where: `user_id,${user.value.user_id}`,
        });
      }
    });

    watch(
      () => store.state.user.doctors.filters,
      (filters) => {
        dispatch(userActions(userActionTypes.GET_DOCTOR), {
          ...filters,
        });
      }
    );

    watch(
      search,
      debounce((value) => {
        store.dispatch(userActions(userActionTypes.CHANGE_FILTER_DOCTOR), {
          ...filters.value,
          page: 1,
          field: "specialty_name",
          search: value,
        });
      }, 500)
    );

    const dataDoctor = computed(() => store.state.user.doctors.data);
    const pagination = computed(() => store.state.user.doctors.pagination);
    const isLoading = computed(() => store.state.user.isLoading);
    const filters = computed(() => store.state.user.doctors.filters);

    const handleChangePage = (newPage) => {
      store.dispatch(userActions(userActionTypes.CHANGE_FILTER_DOCTOR), {
        ...filters.value,
        page: newPage,
      });
    };

    const onOpenDialogDelete = (user) => {
      dialog.value = true;
      selected.value = user;
    };

    const handleDelete = (user) => {
      dialog.value = false;
      dispatch(appActions(appActionTypes.SET_OVERLAY), true);
      dispatch(userActions(userActionTypes.FETCH_DELETE_USER), user.user_id);
    };

    const onClose = () => {
      dialog.value = false;
    };

    const switchRole = {
      NONE: "Bác sĩ",
      MASTER: "Thạc sĩ",
      DOCTOR: "Tiến sĩ",
      ASSOCIATE_PROFESSOR: "Phó giáo sư",
      PROFESSOR: "Giáo sư",
    };

    return {
      onOpenDialogDelete,
      handleDelete,
      onClose,
      handleChangePage,
      switchRole,
      dataDoctor,
      pagination,
      dialog,
      selected,
      search,
      page,
      isLoading,
      user,
      roles,
    };
  },
});
</script>

<template>
  <div>
    <v-container style="max-width: 1200px">
      <v-row>
        <v-col cols="12"><h1 class="text-center">Danh sách bác sĩ</h1></v-col>
        <v-col
          v-if="user && user.role === roles.ADMIN"
          cols="6"
          style="display: flex; align-items: center"
        >
          <router-link
            :to="{
              name: 'doctor.add',
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

        <v-col cols="6" v-if="user && user.role === roles.ADMIN">
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
                    <th class="text-white">Thông tin</th>
                    <th class="text-white">Thuộc chuyên khoa</th>
                    <th class="text-white">Chức vụ</th>
                    <th class="text-white">Thuộc cơ sở y tế</th>
                    <th class="text-white">Hành động</th>
                  </tr>
                </thead>
                <tbody v-if="dataDoctor.length">
                  <tr v-for="(item, index) in dataDoctor" :key="item.user_id">
                    <td>{{ index + 1 }}</td>
                    <td>
                      <v-sheet
                        class="rounded mx-0"
                        max-width="100"
                        elevation="12"
                        width="100%"
                      >
                        <v-img :src="item.avatar" class="rounded" />
                      </v-sheet>
                    </td>
                    <td>
                      <div>
                        <p class="text-truncate" style="max-width: 200px">
                          {{ item.first_name + " " + item.last_name }}
                        </p>
                        <p class="text-truncate" style="max-width: 200px">
                          {{ item.email }}
                        </p>
                        <p>{{ item.phone }}</p>
                        <p>{{ item.gender }}</p>
                      </div>
                    </td>
                    <td>
                      <p class="text-truncate" style="max-width: 200px">
                        {{ item.specialty_name }}
                      </p>
                    </td>
                    <td>
                      <p class="text-truncate" style="max-width: 200px">
                        {{ switchRole[item.doctor_position] }}
                      </p>
                    </td>
                    <td>
                      <p class="text-truncate" style="max-width: 200px">
                        {{ item.clinic_name }}
                      </p>
                    </td>
                    <td>
                      <div class="d-flex">
                        <router-link
                          class="text-info mr-4 text-decoration-none"
                          variant="outlined"
                          style="border: none"
                          :to="{
                            name: 'doctor.schedule.add',
                            params: { doctorId: item.user_id },
                          }"
                        >
                          <v-icon icon="mdi-calendar" class="text-h4"> </v-icon>
                          <v-tooltip activator="parent" location="top">
                            Thêm lịch khám
                          </v-tooltip>
                        </router-link>

                        <router-link
                          class="text-primary mr-4 text-decoration-none"
                          variant="outlined"
                          style="border: none"
                          :to="{
                            name: 'doctor.update',
                            params: {
                              doctorId: item.user_id,
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
                  <strong>{{
                    selected.first_name + selected.last_name
                  }}</strong>
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
