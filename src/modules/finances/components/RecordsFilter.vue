<template>
  <div>
    <v-row
      gutters
      align="center"
      justify-lg="start"
      justify-md="start"
      justify-sm="start"
    >

      <v-col
        cols="4"
        md="3"
        v-if="isFiltering"
      >
        <v-btn
          icon
          @click="filter('clear')"
        >
          <v-icon>close</v-icon>
        </v-btn>
      </v-col>

      <v-col
        cols="4"
        md="2"
      >
        <v-btn
          icon
          :class="buttonfilterClass"
          @click="showFilterDialog = true"
        >
          <v-icon>filter_list</v-icon>
        </v-btn>
      </v-col>

    </v-row>

    <v-dialog
      v-model="showFilterDialog"
      max-width="350px"
    >
      <v-card>
        <v-card-title>
          <h3 class="headline">Filtros</h3>
          <v-spacer></v-spacer>
          <v-btn
            icon
            @click="showFilterDialog = false"
          >
            <v-icon>close</v-icon>
          </v-btn>
          <v-btn
            icon
            @click="filter"
          >
            <v-icon>check</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <v-list three-line>

            <!-- Tipo de Lançamentos -->
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Tipo de Lançamento</v-list-item-title>
                <v-list-item-subtitle>
                  <v-select
                    placeholder="Todos os Lançamentos"
                    chips
                    deletable-chips
                    :items="operations"
                    item-text="description"
                    item-value="value"
                    @change="localFilters.type = $event"
                    :value="filters && filters.type"
                  ></v-select>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <!-- Contas -->
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Conta</v-list-item-title>
                <v-list-item-subtitle>
                  <v-select
                    placeholder="Todas as Contas"
                    chips
                    deletable-chips
                    multiple
                    :items="wallets"
                    item-text="description"
                    item-value="id"
                    @change="localFilters.wallets = $event"
                    :value="filters && filters.id"
                  ></v-select>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <!-- Categorias -->
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Categorias</v-list-item-title>
                <v-list-item-subtitle>
                  <v-select
                    placeholder="Todas as Categorias"
                    chips
                    deletable-chips
                    multiple
                    :items="categories"
                    item-text="description"
                    item-value="id"
                    @change="localFilters.categories = $event"
                    :value="filters && filters.id"
                  ></v-select>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import WalletsServices from '@/modules/services/wallets-services'
import CategoriesServices from '@/modules/services/categories-services'

const { mapState, mapActions } = createNamespacedHelpers('finances')

export default {
  name: 'RecordsFilter',
  data: () => ({
    wallets: [],
    categories: [],
    operations: [
      { description: 'Receita', value: 'C' },
      { description: 'Despesa', value: 'D' }
    ],
    localFilters: {
      type: undefined,
      wallets: [],
      categories: []
    },
    showFilterDialog: false,
    subscriptions: []
  }),
  computed: {
    ...mapState(['filters', 'isFiltering']),
    buttonfilterClass () {
      return !this.isFiltering ? 'offset-lg-6' : ''
    }
  },
  methods: {
    ...mapActions(['setFilters']),
    filter (type) {
      this.showFilterDialog = false
      this.setFilters({ filters: type !== 'clear' ? this.localFilters : undefined })
      this.$emit('filter')
    },
    setItems () {
      this.subscriptions.push(
        WalletsServices.getAllWallets()
          .subscribe(wallets => (this.wallets = wallets))
      )
      this.subscriptions.push(
        CategoriesServices.getAllCategories()
          .subscribe(categories => (this.categories = categories))
      )
    }
  },
  created () {
    this.setItems()
  },
  destroyed () {
    this.subscriptions.forEach(s => s.unsubscribe())
  }
}
</script>
