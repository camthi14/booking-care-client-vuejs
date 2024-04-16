<script>
import { computed, defineComponent, onBeforeMount, ref, watch } from "vue";
import { useStore } from "vuex";
import { roles } from "../../../store/modules/auth";
import { userActions, userActionTypes } from "../../../store/types";

export default defineComponent({
  setup() {
    const gender = {
      MALE: "Nam",
      FEMALE: "Nữ",
    };
    const page = 1;
    const store = useStore();
    const dispatch = store.dispatch;
    onBeforeMount(() => {
      dispatch(userActions(userActionTypes.FETCH_ALL_USER), {
        ...store.state["user"].filters,
        where: "role," + roles.CUSTOMER,
      });
    });

    watch(
      () => store.state["user"].filters,
      (filters) => {
        dispatch(userActions(userActionTypes.FETCH_ALL_USER), {
          ...filters,
          where: "role," + roles.CUSTOMER,
        });
      }
    );

    const dataUser = computed(() => store.state.user.users);
    const pagination = computed(() => store.state.user.pagination);

    const handleChangePage = (newPage) => {
      dispatch(userActions(userActionTypes.CHANGE_FILTER), {
        page: newPage,
      });
    };

    return {
      handleChangePage,
      dataUser,
      pagination,
      page,
      gender,
    };
  },
});
</script>

<template>
  <div>
    <v-container style="max-width: 1200px">
      <v-row>
        <v-col cols="12" sm="12">
          <v-sheet rounded="lg">
            <div class="text-center my-4">
              <h1>Danh sách tài khoản đăng ký</h1>
            </div>

            <div>
              <v-table class="table_manager">
                <thead>
                  <tr>
                    <th class="text-white">STT</th>
                    <th class="text-white">Thông tin</th>
                    <th class="text-white">Email</th>
                    <th class="text-white">Giới tính</th>
                    <th class="text-white">Số điện thoai</th>
                    <th class="text-white">Địa chỉ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in dataUser" :key="item.user_id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.last_name }} {{ item.first_name }}</td>
                    <td>{{ gender[item.gender] }}</td>
                    <td>{{ item.email }}</td>
                    <td>{{ item.phone }}</td>
                    <td>{{ item.address }}</td>
                  </tr>
                </tbody>
              </v-table>
            </div>

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
