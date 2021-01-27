<template>
  <div class="row">
    <div class="col-lg-4 col-sm-12 col-xs-12 q-pa-md">
      <q-card>
        <q-card-section align="center" class="bg-primary text-white">
          <div class="text-h5">
            HOURLY RENTALS
          </div>
        </q-card-section>
        <q-card-section>
          <div class="q-pa-md" style="max-width: 340px">
            <q-input filled v-model="date" readonly >
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date v-model="date" mask="YYYY-MM-DD" :options="optionFrom">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                  <q-tooltip
                    transition-show="rotate"
                    transition-hide="rotate"
                  >Date</q-tooltip>
                </q-icon>
              </template>
            </q-input>
          </div>
        </q-card-section>
        <q-card-actions align="center">
          <q-btn class="full-width" color="primary" push @click="getHourlyBookings()">CHECK AVAILABILITY
            <q-tooltip
              transition-show="rotate"
              transition-hide="rotate"
            >CHECK AVAILABILITY OF DATE</q-tooltip>
          </q-btn>
        </q-card-actions>
      </q-card>
    </div>
    <div class="col-lg-8 col-sm-12 col-xs-12 q-pa-md">
      <available-slots :date="date" :showSlots="showSlots" :showLoading="showLoading"></available-slots>
      <paypal-buttons v-show="paypalBreakdownVisibility"></paypal-buttons>
    </div>
  </div>
</template>

<script>
import { date } from 'quasar'
import AvailableSlots from './AvailableSlots.vue'
import { mapGetters } from 'vuex'
import PaypalButtons from './PaypalButtons.vue'
export default {
  components: { AvailableSlots, PaypalButtons },
  data () {
    return {
      date: '',
      showLoading: false,
      showSlots: false
    }
  },
  computed: {
    ...mapGetters([
      'loading',
      'paypalBreakdownVisibility',
      'overallTime'
    ])
  },
  watch: {
    overallTime (val) {
      this.$store.dispatch('displayPaypalBreakdown', false)
    }
  },
  created () {
    this.formatDates()
  },
  methods: {
    optionFrom (d) {
      return d >= date.formatDate(Date.now(), 'YYYY/MM/DD')
    },
    formatDates () {
      const dateNow = new Date().toISOString().substring(0, 10)
      this.date = dateNow
    },
    async getHourlyBookings () {
      this.showLoading = true
      this.showSlots = false
      await this.$store.dispatch('getHourlyBookings', this.date)
      setTimeout(() => {
        this.showLoading = false
        this.showSlots = true
      }, 2000)
    }
  }
}
</script>
