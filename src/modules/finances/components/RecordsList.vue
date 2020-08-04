<template>
  <div>

    <TotalBalance
      class="mb-2"
      :month="$route.query.month || `${new Date().getMonth()}-${new Date().getFullYear()}`"
    />

    <ToolbarByMonth
      class="mb-2"
      format="MM-YYYY"
      @month="changeMonth"
      :color="toolbarColor"
      :month="$route.query.month"
      :showSlot="true"
    >
      <RecordsFilter @filter="filter" />
    </ToolbarByMonth>
    <v-card elevation="8">
      <v-card-text
        class="text-center secondary"
        v-if="mappedRecordsLenght === 0"
      >
        <v-icon
          size="100"
          color="grey"
        >assignment</v-icon>
        <p class="font-weight-light text--secondary">
          Nenhum lançamento no período selecionado
        </p>
      </v-card-text>
      <v-list
        v-else
        color="grey darken-4"
      >
        <template v-for="(recordsArray, date, index) in mappedRecords">
          <v-subheader :key="date">{{ date }}</v-subheader>
          <records-list-item
            v-for="record in recordsArray"
            :key="record.id"
            :record="record"
          />
          <v-divider
            :key="`${date}-${index}`"
            v-if="showDivider(index, mappedRecords)"
          />
        </template>
      </v-list>
      <v-card-actions>
        <v-spacer></v-spacer>
        <h3 class="font-weight-light">
          <span>Saldo do mês</span>
          <strong
            class="ml-5"
            :class="amountColor(totalAmount)"
          >{{ formatCurrency(totalAmount) }}</strong>
        </h3>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { Subject } from 'rxjs'
import { mergeMap } from 'rxjs/operators'
import ToolbarByMonth from './ToolbarByMonth.vue'
import RecordsFilter from './RecordsFilter.vue'
import RecordsListItem from './RecordsListItem.vue'
import RecordsServices from '@/modules/services/records-services'
import { groupBy } from '@/utils'
import moment from 'moment'
import amountColorMixin from '@/modules/finances/mixins/amount-color'
import formatCurrencyMixin from '@/mixins/format-currency'
import TotalBalance from './TotalBalance.vue'

const { mapState, mapActions } = createNamespacedHelpers('finances')

export default {
  name: 'RecordsList',
  mixins: [amountColorMixin, formatCurrencyMixin],
  components: {
    RecordsListItem, ToolbarByMonth, TotalBalance, RecordsFilter
  },
  data () {
    return {
      records: [],
      filtersSubject$: new Subject(), // Variável do tipo Observable
      subscriptions: [] // Guardará todos os subscriptions para posteriores desinscrever-se
    }
  },
  computed: {
    ...mapState(['filters', 'month']),
    mappedRecords () {
      return groupBy(this.records, 'date', (record, dateKey) => {
        return moment(record[dateKey]).format('DD/MM/YYYY')
      })
    },
    mappedRecordsLenght () {
      return Object.keys(this.mappedRecords).length
    },
    totalAmount () {
      return this.records.reduce((sum, record) => sum + +record.amount, 0)
    },
    toolbarColor () {
      return this.totalAmount < 0 ? 'error' : 'primary'
    }
  },
  methods: {
    ...mapActions(['setMonth']),
    showDivider (index, object) {
      return index < Object.keys(object).length - 1
    },
    changeMonth (month) {
      this.$router.push({
        path: this.$route.path,
        query: { month: month }
      })
        .catch(() => { })
        .finally(
          this.setMonth({ month }), // seta o valor do mês após atualização e antes de filtrar os registros
          this.filter()
        )
      // .finally(this.filtersSubject$.next({ month }))
      // .finally(this.setRecords(month))
    },
    filter () {
      this.filtersSubject$.next({ month: this.month, ...this.filters })
    },
    setRecords () {
      // const records = await RecordsServices.getAllRecords()
      // this.records = records.filter(record => {
      //   return moment(record.date).format('MM-YYYY') === month
      // })

      this.subscriptions.push( // Guardando o subscribe no array
        this.filtersSubject$
          .pipe(
            mergeMap(variables => {
              this.setMonth({ month: variables.month })
              return RecordsServices.getAll(variables)
            })
          ).subscribe(records => {
            this.records = records.filter(record => {
              return moment(record.date).format('MM-YYYY') === this.month
            })
          })
      ) // fim do subscription
    }
  },
  created () {
    this.setRecords()
  },
  destroyed () {
    this.subscriptions.forEach(s => s.unsubscribe())
  }
}
</script>

<style>
</style>
