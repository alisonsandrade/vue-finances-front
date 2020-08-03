<template>
  <v-toolbar
    fixed
    color="primary"
    dark
  >
    <v-app-bar-nav-icon @click.stop="$emit('hide', !show)"></v-app-bar-nav-icon>
    <v-toolbar-title>{{ title || 'Dashboard' }}</v-toolbar-title>
  </v-toolbar>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'AppToolbar',
  props: {
    show: Boolean
  },
  model: { // propriedade do v-model
    prop: 'show',
    event: 'hide'
  },
  computed: {
    ...mapState(['title'])
  }
}
</script>
