<script>
import _ from "lodash";
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import {
  appActions,
  appActionTypes,
  authActions,
  authActionTypes,
} from "../../store/types";
import switchNavConfig from "./NavConfig";

export default defineComponent({
  setup: () => {
    const store = useStore();

    const config = computed(() => {
      if (!_.isEmpty(store.state["auth"].user)) {
        return switchNavConfig[store.state["auth"].user.role];
      }
    });

    const user = computed(() =>
      Object.keys(store.state.auth.user).length === 0
        ? null
        : store.state.auth.user
    );

    const handleLogout = async () => {
      store.dispatch(appActions(appActionTypes.SET_OVERLAY), true);
      setTimeout(() => {
        store.dispatch(authActions(authActionTypes.FETCH_LOGOUT));
      }, 1500);
    };

    return { config, user, handleLogout };
  },
});
</script>

<template>
  <v-container fluid style="height: 300px">
    <v-row justify="center">
      <v-menu min-width="200px" rounded>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-avatar color="brown">
              <v-icon v-if="!user?.avatar" icon="mdi-account-circle"></v-icon>
              <v-img v-else :src="user?.avatar" alt="John"></v-img>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <div class="mx-auto text-center">
              <v-avatar color="brown">
                <v-icon v-if="!user?.avatar" icon="mdi-account-circle"></v-icon>
                <v-img v-else :src="user?.avatar" alt="John"></v-img>
              </v-avatar>

              <h3>{{ user?.first_name + " " + user?.last_name }}</h3>

              <p class="text-caption mt-1">
                {{ user.email }}
              </p>

              <v-divider class="my-1"></v-divider>

              <div v-for="(item, index) in config" :key="index">
                <v-btn
                  :to="item.to"
                  rounded
                  variant="plain"
                  :class="{ 'hover-class': true }"
                >
                  {{ item.label }}
                </v-btn>
                <v-divider class="my-1"></v-divider>
              </div>

              <v-btn
                rounded
                variant="plain"
                @click="handleLogout"
                :class="{ 'hover-class': true }"
              >
                Đăng xuất
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
.hover-class:hover {
  color: #45bee5;
}
</style>
