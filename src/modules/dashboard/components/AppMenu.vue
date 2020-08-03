<template>
  <v-navigation-drawer
    :value="value"
    @input="$emit('input', $event)"
    :mini-variant="mini"
    absolute
    temporary
  >
    <v-list flat>
      <v-list-item-group>
        <v-list-item
          v-if="mini"
          @click.stop="mini = !mini"
        >
          <v-list-item-icon>
            <v-icon>chevron_right</v-icon>
          </v-list-item-icon>
        </v-list-item>

        <v-list-item>
          <v-list-item-icon>
            <v-icon>person</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ user.first_name }}</v-list-item-title>
          </v-list-item-content>

          <v-list-item-icon>
            <v-btn
              icon
              @click.stop="mini = !mini"
            >
              <v-icon>chevron_left</v-icon>
            </v-btn>
          </v-list-item-icon>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <v-list
      class="pt-0"
      dense
    >
      <v-divider light></v-divider>
      <v-list-item
        v-for="item in items"
        :key="item.title"
        :to="item.url"
        :exact="item.exact"
        @click.stop="$emit('input', false)"
      >
        <v-list-item-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

    </v-list>
  </v-navigation-drawer>
</template>

<script>
import AuthService from '@/modules/services/auth-services'

export default {
  nema: 'AppMenu',
  props: {
    value: Boolean
  },
  data: () => ({
    items: [
      { title: 'Home', icon: 'dashboard', url: '/dashboard', exact: true },
      { title: 'Receita', icon: 'add', url: '/dashboard/records/add?type=credit', exact: true },
      { title: 'Despesa', icon: 'remove', url: '/dashboard/records/add?type=debit', exact: true }
    ],
    mini: false,
    user: {}
  }),
  async created () {
    this.user = await AuthService.getUserAuthenticated()
    console.log(this.user)
  }
}
</script>
