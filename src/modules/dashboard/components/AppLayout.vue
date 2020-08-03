<template>
  <div>
    <AppToolbar v-model="drawer" />
    <AppMenu v-model="drawer" />
    <v-main>
      <v-container>
        <slot></slot>
      </v-container>
      <AppFloatButton />
    </v-main>
  </div>
</template>

<script>
import AppToolbar from './AppToolbar'
import AppMenu from './AppMenu'
import AppFloatButton from './AppFloatButton'

export default {
  name: 'AppLayout',
  components: {
    AppToolbar,
    AppMenu,
    AppFloatButton
  },
  data: () => ({
    drawer: false
  })
}
</script>

<style>
</style>
