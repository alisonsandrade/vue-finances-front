<template>
  <v-card :color="color">
    <v-card-title>
      <v-spacer></v-spacer>
      <h3 class="display-2 font-weght-light pt-3 mr-5">{{ display }}</h3>
    </v-card-title>
    <v-card-text>
      <v-row justify="end">
        <v-col
          cols="4"
          align="center"
          pa-1
          v-for="btn in buttons"
          :key="btn"
        >
          <v-btn
            :color="color"
            class="headline"
            @click="change(btn, 'add')"
          >{{ btn }}</v-btn>
        </v-col>
        <v-col
          cols="4"
          align="center"
        >
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="change"
          >
            <v-icon>backspace</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import formatCurrencyMixin from '@/mixins/format-currency'
export default {
  name: 'NumericDisplay',
  mixins: [formatCurrencyMixin],
  props: {
    color: String,
    value: Number
  },
  data: () => ({
    buttons: [7, 8, 9, 4, 5, 6, 1, 2, 3, 0]
  }),
  computed: {
    display () {
      return this.formatCurrency(this.value || 0)
    }
  },
  methods: {
    change (btnValue, operation) {
      const currentValue = this.value.toFixed(2) // o método toFixed formata o número com notação de ponto fixo. Ex. 125.55
      const total =
        operation === 'add'
          ? (+(currentValue + btnValue) * 10)
          : (+currentValue.slice(0, -1) / 10)
      this.$emit('input', total)
    }
  }
}
</script>
