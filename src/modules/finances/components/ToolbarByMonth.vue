<template>
  <v-toolbar :color="color">
    <v-row
      no-gutters
      wrap
      center
      align="center"
    >
      <v-col
        cols="1"
        class="flex-grow-0 flex-shrink-0 text-center"
      >
        <v-btn
          icon
          text
          @click="decrement"
        >
          <v-icon>chevron_left</v-icon>
        </v-btn>
      </v-col>
      <v-col
        cols="1"
        style="min-width: 100px; max-width: 100%;"
        class="flex-grow-1 flex-shrink-0"
        offset-lg="1"
      >
        <v-toolbar-title class="d-flex justify-center pa-2">
          <v-btn
            rounded
            :color="color"
            dark
            class="pl-4 pr-4"
            @click="defaultMonth"
          >
            <v-icon
              right
              dark
              class="mr-2"
            >event</v-icon>
            {{ currentMonth }}
          </v-btn>
        </v-toolbar-title>
      </v-col>

      <v-col
        cols="1"
        class="text-right"
        v-if="showSlot"
      >
        <slot />
      </v-col>

      <v-col
        cols="1"
        class="flex-grow-0 flex-shrink-0 text-center"
      >
        <v-btn
          icon
          text
          @click="increment"
        >
          <v-icon>chevron_right</v-icon>
        </v-btn>
      </v-col>
    </v-row>

  </v-toolbar>
</template>
<script>
import moment from 'moment'

export default {
  name: 'ToolbarByMonth',
  props: {
    color: String,
    format: String,
    month: String,
    showSlot: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    date: undefined
  }),
  computed: {
    currentMonth () {
      return this.date.format('MMMM YYYY')
    },
    arrowRightClass () {
      return !this.showSlot ? 'offset-xs1' : ''
    }
  },
  created () {
    this.setCurretMonth()
    this.emit()
  },
  methods: {
    emit () {
      this.$emit('month', this.date.format(this.format))
    },
    increment () {
      this.date = this.date.clone().add(1, 'month')
      this.emit()
    },
    decrement () {
      this.date = this.date.clone().subtract(1, 'month')
      this.emit()
    },
    defaultMonth () {
      this.date = moment()
      this.emit()
    },
    setCurretMonth () {
      this.date = this.month ? moment(this.month, this.format) : moment()
    }
  }
}
</script>
