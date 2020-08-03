<template>
  <v-container>
    <v-row wrap>
      <v-col
        cols="12"
        sm="6"
        md="4"
        lg="4"
      >
        <numeric-display
          :color="color"
          v-model="$v.record.amount.$model"
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
        md="8"
        lg="8"
      >
        <v-card>
          <v-card-text>
            <v-form>
              <v-menu
                v-model="showDateDialog"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    label="Vencimento"
                    prepend-icon="event"
                    readonly
                    :value="formattedDate"
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  :color="color"
                  locale="pt-br"
                  v-model="record.date"
                  @input="showDateDialog = false"
                ></v-date-picker>
              </v-menu>

              <v-select
                name="wallet"
                label="Conta"
                prepend-icon="account_balance"
                :items="wallets"
                item-text="description"
                item-value="id"
                v-model="$v.record.wallet.$model"
              >
                <v-list-item
                  slot="prepend-item"
                  ripple
                  :class="color"
                  @click="add('wallet')"
                >
                  <v-list-item-action>
                    <v-icon>add</v-icon>
                  </v-list-item-action>
                  <v-list-item-title>Conta</v-list-item-title>
                </v-list-item>
                <v-divider
                  slot="prepend-item"
                  class="mt-2"
                ></v-divider>
              </v-select>
              <v-select
                name="category"
                label="Categoria"
                prepend-icon="class"
                :items="categories"
                item-text="description"
                item-value="id"
                v-model="$v.record.category.$model"
              >
                <v-list-item
                  slot="prepend-item"
                  ripple
                  :class="color"
                  @click="add('category')"
                >
                  <v-list-item-action>
                    <v-icon>add</v-icon>
                  </v-list-item-action>
                  <v-list-item-title>Categoria</v-list-item-title>
                </v-list-item>
                <v-divider
                  slot="prepend-item"
                  class="mt-2"
                ></v-divider>
              </v-select>
              <v-text-field
                name="description"
                label="Descrição"
                prepend-icon="description"
                type="text"
                v-model.trim="$v.record.description.$model"
              ></v-text-field>
              <v-text-field
                v-show="showTagsInput"
                name="tags"
                label="Tags (separadas por vírgula)"
                prepend-icon="label"
                type="text"
                v-model.trim="record.tags"
              ></v-text-field>
              <v-text-field
                v-show="showNoteInput"
                name="note"
                label="Observação"
                prepend-icon="note"
                type="text"
                v-model.trim="record.note"
              ></v-text-field>
            </v-form>
            <!-- div dos campos tooltip escondidos -->
            <div
              align="center"
              class="mt-3"
            >
              <v-tooltip left>
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    small
                    class="mr-3"
                    v-on="on"
                    @click="showTagsInput = !showTagsInput"
                  >
                    <v-icon :color="color">label</v-icon>
                  </v-btn>
                </template>
                <span>Adicionar tags</span>
              </v-tooltip>
              <v-tooltip right>
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    small
                    v-on="on"
                    @click="showNoteInput = !showNoteInput"
                  >
                    <v-icon :color="color">note</v-icon>
                  </v-btn>
                </template>
                <span>Adicionar observação</span>
              </v-tooltip>
            </div>
          </v-card-text>
        </v-card>
        <div
          align="right"
          class="mt-2"
        >
          <v-btn
            color="secondary"
            large
            fab
            class="mt-2 mr-2 mb-2"
            @click="$router.back()"
          >
            <v-icon>close</v-icon>
          </v-btn>
          <v-btn
            :color="color"
            large
            fab
            class="mt-2 mr-2 mb-2"
            @click="submit"
            :disabled="$v.$invalid"
          >
            <v-icon>check</v-icon>
          </v-btn>
        </div>
        <v-dialog
          v-model="showWalletCategoryDialog"
          max-width="350px"
        >
          <wallet-category-add
            v-if="showWalletCategoryDialog == true"
            :entity="entity"
            @close="showWalletCategoryDialog = false"
            @saved="walletCategorySaved"
          />
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapActions } from 'vuex'
import moment from 'moment'
import { decimal, minLength, maxLength, required } from 'vuelidate/lib/validators'
import WalletsServices from '@/modules/services/wallets-services'
import CategoriesServices from '@/modules/services/categories-services.js'
import NumericDisplay from '../components/NumericDisplay.vue'
import WalletCategoryAdd from '../components/WalletCategoryAdd.vue'
import RecordsServices from '@/modules/services/records-services'
import { formatError } from '@/utils'

export default {
  name: 'RecordsAdd',
  components: { NumericDisplay, WalletCategoryAdd },
  /*
  * Obs.: Nessa situação não foi utilizada a arrow function porque dentro do data é necessário
  * fazer uma referência para a Vue Instance e com arrow function o this não iria funcionar
  * adequadamente.
  */
  data () {
    return {
      wallets: [],
      categories: [],
      entity: '', // Propriedade para saber se quer cadastrar uma nova conta ou categoria
      record: {
        type: this.$route.query.type[0].toUpperCase(),
        amount: 0,
        date: moment().format('YYYY-MM-DD'),
        wallet: '',
        category: '',
        description: '',
        tags: '',
        note: ''
      },
      showTagsInput: false,
      showNoteInput: false,
      showDateDialog: false,
      showWalletCategoryDialog: false,
      subscriptions: []
    }
  },
  validations: {
    record: {
      type: { required },
      amount: { required, decimal, different: value => value !== 0 },
      date: { required },
      wallet: { required },
      category: { required },
      description: { required, minLength: minLength(6), maxLength: maxLength(255) }
    }
  },
  computed: {
    color () {
      switch (this.record.type[0].toUpperCase()) {
        case 'C':
          return 'primary' // Como tem o return não necessita da propriedade break
        case 'D':
          return 'error'
        default:
          return 'primary'
      }
    },
    formattedDate () {
      return moment(this.record.date).format('DD/MM/YYYY')
    }
  },
  methods: {
    ...mapActions(['setTitle']),
    changeTitle (recordType) {
      let title
      switch (recordType) {
        case 'credit':
          title = 'Nova Receita'
          break
        case 'debit':
          title = 'Nova Despesa'
          break
        default:
          title = 'Novo Lançamento'
          break
      }
      this.setTitle({ title })
    },
    subscribeWallets () {
      return WalletsServices.getAllWallets().subscribe(response => {
        this.wallets = response
      })
    },
    subscribeCategories (type) {
      return CategoriesServices.getAllByType(type).subscribe(response => {
        this.categories = response
      })
    },
    async submit () {
      try {
        const response = await RecordsServices.create(this.record)
        console.log(response)
        this.$router.push('/dashboard/records')
      } catch (error) {
        console.log(formatError(error))
      }
    },
    add (entity) {
      this.showWalletCategoryDialog = true
      this.entity = entity
    },
    async walletCategorySaved (item) {
      this.showWalletCategoryDialog = false
      // Atualiza os select após salvar o novo registro e seta-o como padrão
      switch (this.entity) {
        case 'wallet':
          this.subscriptions.push(this.subscribeWallets())
          break
        case 'category':
          this.subscriptions.push(this.subscribeCategories(this.record.type))
      }
      this.record[`${this.entity}`] = item.id // Seta como padrão o novo registro cadastrado
    }
  },
  beforeRouteUpdate (to, from, next) {
    // to.type or from.type
    const { type } = to.query

    this.changeTitle(type)
    this.record.type = type[0].toUpperCase()
    this.record.category = '' // Reseta o campo de categoria
    this.subscriptions.push(this.subscribeCategories(type[0].toUpperCase()))
    next()
  },
  created () {
    this.changeTitle(this.$route.query.type[0].toUpperCase())
    // this.wallets = await WalletsServices.getAll()
    this.subscriptions.push(this.subscribeWallets())
    this.subscriptions.push(this.subscribeCategories(this.record.type))
  },
  destroyed () {
    this.subscriptions.forEach(s => s.unsubscribe())
  }
}
</script>
