export default {
  methods: {
    amountColor (amount) {
      return amount < 0
        ? 'error--text text-light-1' // aplica a cor vermelha quando houver o débito
        : 'success--text text-light-1'
    }
  }
}
