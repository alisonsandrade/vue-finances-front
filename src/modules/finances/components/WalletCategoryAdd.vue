
<template>
  <v-card>
    <v-card-title class="headline">{{ title }}</v-card-title>

    <v-card-text>

      <v-text-field
        label="Descrição"
        v-model="$v.item.description.$model"
      ></v-text-field>

      <v-select
        v-if="entity === 'category'"
        label="Operação"
        :items="operations"
        item-text="description"
        item-value="value"
        v-model="$v.item.operation.$model"
      >
        ></v-select>

    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        text
        @click="$emit('close')"
      >Cancelar</v-btn>
      <v-btn
        text
        color="primary"
        :disabled="$v.$invalid"
        @click="save"
      >Salvar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import CategoriesServices from '@/modules/services/categories-services'
import WalletsServices from '@/modules/services/wallets-services'

export default {
  name: 'WalletCategoryAdd',
  props: {
    entity: String
  },
  data () {
    return {
      item: {
        description: '',
        operation: this.$route.query.type[0].toUpperCase()
      },
      operations: [
        { description: 'Receita', value: 'C' },
        { description: 'Despesa', value: 'D' }
      ]
    }
  },
  validations () {
    const validations = {
      item: {
        description: {
          required,
          minLength: minLength(3),
          maxLength: maxLength(255)
        }
      }
    }
    if (this.entity === 'wallet') { return validations }

    return {
      item: {
        ...validations.item,
        operation: { required }
      }
    }
  },
  computed: {
    title () {
      return this.entity === 'wallet'
        ? 'Nova Conta'
        : 'Nova Categoria'
    }
  },
  methods: {
    async save (e) {
      let promise
      switch (this.entity) {
        case 'wallet':
          promise = await WalletsServices.create(this.item)
          break
        case 'category':
          promise = await await CategoriesServices.create(this.item)
      }

      try {
        const item = await promise
        this.$emit('saved', item)
      } catch (error) {
        console.log('Ocorreu um erro', error)
      }
    }
  }
}
</script>
