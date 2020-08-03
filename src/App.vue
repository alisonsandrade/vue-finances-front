<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import env from '@/.env'

export default {
  name: 'App',

  components: {
    //
  },

  data: () => ({
    //
  }),

  beforeDestroy: function () {
    // Remove o token sempre que for fechado o navegador
    localStorage.removeItem(env.AUTH_TOKEN)
  }
}
</script>
