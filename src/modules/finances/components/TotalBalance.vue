<template>
  <v-card :color="color">
    <v-card-title primary-title>
      <div class="text-center ma-auto">
        <p class="subheading">Saldo atual</p>
        <h1 class="display-2">{{ totalInCurrency }}</h1>
      </div>
    </v-card-title>
  </v-card>
</template>

<script>
import formatCurrencyMixin from '@/mixins/format-currency'
import RecordsServices from '@/modules/services/records-services'

export default {
  name: 'TotalBalance',
  props: {
    month: {
      type: String,
      required: true
    }
  },
  mixins: [formatCurrencyMixin],
  data: () => ({
    total: 0
  }),
  computed: {
    color () {
      return this.total < 0 ? 'error' : 'primary'
    },
    totalInCurrency () {
      this.setTotalBalance(this.$route.query.month)
      return this.formatCurrency(this.total)
    }
  },
  methods: {
    async setTotalBalance (month) {
      this.total = await RecordsServices.getTotalBalance(month)
    }
  }
}
</script>
