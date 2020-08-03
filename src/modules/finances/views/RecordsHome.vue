<template>
  <RecordsList />
</template>
<script>
import RecordsList from '@/modules/finances/components/RecordsList.vue'
import { mapActions } from 'vuex'

export default {
  name: 'RecordsHome',
  components: {
    RecordsList
  },
  methods: {
    ...mapActions(['setTitle'])
  },
  created () {
    this.setTitle({ title: 'Lançamentos' })
  }
}
</script>
