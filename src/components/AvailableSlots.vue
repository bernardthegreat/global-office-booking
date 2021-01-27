<template>
  <div>
    <form @keydown.enter.prevent='bookNow'>
      <q-card>
        <q-card-section class='bg-primary text-white'>
          <div class='text-h5' align='center'>
            SLOTS
          </div>
        </q-card-section>
        <q-card-section>
          <div class='text-h5' align='center'>
            AVAILABLE AND TAKEN SLOTS FOR HOURLY RENTALS
          </div>
        </q-card-section>
        <q-card-section class='q-mt-md' v-if='showLoading'>
          <q-inner-loading :showing='showLoading == true'>
            <q-spinner-gears size='100px' color='primary' />
          </q-inner-loading>
        </q-card-section>
        <transition
          appear
          enter-active-class='animated fadeIn'
          leave-active-class='animated fadeOut'
        >
          <div>
            <q-card-section v-show='showSlots' class='q-pa-sm' v-if='hourlyBookingsTaken.length > 0'>
              <div class='row flex flex-center'>
                <div class='col-lg-12 text-h6' align='center'>
                  Taken Slots
                </div>
                <div class='col-lg-6 flex flex-center'
                  v-for='bookings in hourlyBookingsTaken'
                  :key='bookings.id'
                >
                  <q-card
                    class='q-ma-sm bg-primary text-white'
                    style='width:160px'
                  >
                    <q-card-section>
                      <div class='text-h6' align='center'>
                        {{bookings.book_from}} - {{bookings.book_to}}
                      </div>
                    </q-card-section>
                  </q-card>
                </div>

                <div class='col-lg-12 text-h6 q-pt-md' align='center'>
                  Available Slots
                </div>
                <div class='col-lg-6 flex flex-center'
                  v-for='bookings in hourlyBookingsAvailable'
                  :key='bookings.id'
                >
                  <q-card
                    class='q-ma-sm bg-secondary text-white'
                    style='width:160px'
                  >
                    <q-card-section>
                      <div class='text-h6' align='center'>
                        {{bookings.book_from}} - {{bookings.book_to}}
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </q-card-section>
            <q-card-section v-show='showSlots' v-else>
              <q-card>
                <q-card-section class='bg-primary text-white' align='center'>
                  <div class='text-h4'>
                    ALL SLOTS ARE AVAILABLE
                  </div>
                </q-card-section>
              </q-card>
            </q-card-section>
            <q-card-section class='q-mt-lg q-pa-md'>
              <div v-show='showSlots' class='col-lg-12'>
                <q-separator></q-separator>
                <q-card-section class='q-pa-md'>
                  <div class='flex flex-center'>
                    <div class='q-pa-sm'>
                      <q-input filled v-model='overallTime' style='width:200px'>
                        <template v-slot:prepend>
                          <q-icon name='access_time' class='cursor-pointer'>
                            <q-popup-proxy transition-show='scale' transition-hide='scale'>
                              <q-time
                                v-model='timeFrom'
                                :minute-options='officeTimeFromMinutes'
                              >
                                <div class='row items-center justify-end'>
                                  <q-btn v-close-popup label='Close' color='primary' flat />
                                </div>
                              </q-time>
                            </q-popup-proxy>
                            <q-tooltip
                              transition-show='rotate'
                              transition-hide='rotate'
                            >From Time</q-tooltip>
                          </q-icon>
                        </template>
                        <template v-slot:append>
                          <q-icon name='access_time' class='cursor-pointer'>
                            <q-popup-proxy transition-show='scale' transition-hide='scale'>
                              <q-time
                                v-model='timeTo'
                                :minute-options='officeTimeToMinutes'
                              >
                                <div class='row items-center justify-end'>
                                  <q-btn v-close-popup label='Close' color='primary' flat />
                                </div>
                              </q-time>
                            </q-popup-proxy>
                            <q-tooltip
                              transition-show='rotate'
                              transition-hide='rotate'
                            >To Time</q-tooltip>
                          </q-icon>
                        </template>
                      </q-input>
                    </div>
                    <div class='q-pa-sm'>
                      <q-btn color='primary' push :disable='disableButton' @click='bookNow'>
                        BOOK
                        <q-tooltip
                          transition-show='rotate'
                          transition-hide='rotate'
                        >BOOK HOURLY RENTALS</q-tooltip>
                      </q-btn>
                    </div>
                  </div>
                </q-card-section>
                <q-card-actions>
                  <div class='q-pt-sm' v-show='displayError' style='width: 740px'>
                    <q-banner inline-actions class='text-white bg-red'>
                      <template v-slot:avatar>
                        <q-icon name='error' color='white' />
                      </template>
                      {{ timeError }}
                    </q-banner>
                  </div>
                </q-card-actions>
              </div>
            </q-card-section>
          </div>
        </transition>
        <vue-recaptcha
          sitekey='6LfXAtYZAAAAAOLvN_WeE3cILHNjb4xVjt4M86kO'
          :loadRecaptchaScript='true'
        >
          <button class='hidden'></button>
        </vue-recaptcha>
      </q-card>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VueRecaptcha from 'vue-recaptcha'
export default {
  components: {
    VueRecaptcha
  },
  props: [
    'date',
    'showSlots',
    'showLoading'
  ],
  computed: {
    ...mapGetters([
      'hourlyBookingsAvailable',
      'hourlyBookingsTaken',
      'hourlyRateCost'
    ])
  },
  data () {
    return {
      timeFrom: '00:00',
      timeTo: '00:30',
      overallTime: '',
      disableButton: false,
      displayError: false,
      // officeTimeFromHour: [1, 2, 3, 4, 8, 9, 10, 11, 12],
      officeTimeFromMinutes: [0, 30],
      // officeTimeToHour: [1, 2, 3, 4, 5, 9, 10, 11, 12, 13, 14, 15, 16, 17],
      officeTimeToMinutes: [0, 30],
      timeError: '',
      showPaypalButtons: false,
      taxRate: 5,
      bookingSummary: {
        name: 'Hourly Rental',
        itemCostQty: '',
        durationInMinutes: '',
        orderCost: '',
        taxCost: '',
        totalCost: '',
        bookingDate: '',
        bookingTime: ''
      }
    }
  },
  watch: {
    timeTo (val) {
      const time = this.overallTime.split(' - ')
      this.overallTime = `${time[0]} - ${val}`
    },
    timeFrom (val) {
      const time = this.overallTime.split(' - ')
      this.overallTime = `${val} - ${time[1]}`
    },
    async overallTime (val) {
      this.validateTime()
      await this.$store.dispatch('setOverallTime', this.overallTime)
    },
    showLoading (val) {
      if (val) {
        this.disableButton = false
        this.displayError = false
        this.timeError = ''
      }
    }
  },
  mounted () {
    this.overallTime = `${this.timeFrom} - ${this.timeTo}`
  },
  methods: {
    bookNow () {
      this.showPaypalButtons = true
      this.validateTime()
      if (this.showPaypalButtons) {
        this.$store.dispatch('displayPaypalBreakdown', true)
        this.$store.dispatch('getOrderSummary', this.bookingSummary)
      }
    },
    validateTime () {
      var splittedTime = this.overallTime.split(' - ')
      const fromDate = `${this.date} ${splittedTime[0]}`
      const dateFrom = new Date(fromDate)
      const toDate = `${this.date} ${splittedTime[1]}`
      const dateTo = new Date(toDate)
      const seconds = Math.floor((dateTo - (dateFrom)) / 1000)
      const minutes = Math.floor(seconds / 60)
      if (minutes >= 30 && minutes <= 360) {
        this.disableButton = false
        this.displayError = false
        var splittedTimeFrom = splittedTime[0].split(':')
        var computedTimeFrom = splittedTimeFrom[0] * 60 + splittedTimeFrom[1] * 1
        var splittedTimeTo = splittedTime[1].split(':')
        var computedTimeTo = splittedTimeTo[0] * 60 + splittedTimeTo[1] * 1
        this.hourlyBookingsTaken.forEach((val) => {
          const splittedBookingsTimeFrom = val.book_from.split(':')
          var computedBookingsTimeFrom = splittedBookingsTimeFrom[0] * 60 + splittedBookingsTimeFrom[1] * 1

          const splittedBookingsTimeTo = val.book_to.split(':')
          var computedBookingsTimeTo = splittedBookingsTimeTo[0] * 60 + splittedBookingsTimeTo[1] * 1

          const timeFrom = splittedTime[0]
          const timeTo = splittedTime[1]

          if (val.book_from > val.book_to) val.book_from += 0
          if ((computedTimeFrom >= computedBookingsTimeFrom) && (computedTimeTo <= computedBookingsTimeTo)) {
            this.disableButton = true
            this.displayError = true
            this.showPaypalButtons = false
            this.timeError = `${timeFrom} - ${timeTo} CONFLICTS WITH ANOTHER SLOT. PLEASE SELECT ANOTHER TIME`
          } else if ((computedTimeTo > computedBookingsTimeFrom) && (computedTimeTo >= computedBookingsTimeTo)) {
            this.disableButton = true
            this.displayError = true
            this.showPaypalButtons = false
            this.timeError = `${timeFrom} - ${timeTo} CONFLICTS WITH ANOTHER SLOT. PLEASE SELECT ANOTHER TIME`
          } else if ((computedTimeFrom > computedBookingsTimeFrom) && (computedTimeTo > computedBookingsTimeTo)) {
            this.disableButton = true
            this.displayError = true
            this.showPaypalButtons = false
            this.timeError = `${timeFrom} - ${timeTo} CONFLICTS WITH ANOTHER SLOT. PLEASE SELECT ANOTHER TIME`
          }
        })

        const orderQty = minutes / 60
        if (orderQty > 0 && orderQty < 6.5) {
          const totalCost = orderQty * this.hourlyRateCost
          const taxCost = totalCost * (this.taxRate / 100)
          const overallCost = totalCost + taxCost

          this.bookingSummary.itemCostQty = `$${this.hourlyRateCost} x ${orderQty.toFixed(2)}`
          this.bookingSummary.orderCost = `$${totalCost.toFixed(2)}`
          this.bookingSummary.taxCost = `$${taxCost.toFixed(2)}`
          this.bookingSummary.totalCost = `$${overallCost.toFixed(2)}`
          this.bookingSummary.bookingDate = this.date
          this.bookingSummary.bookingTime = this.overallTime
          this.bookingSummary.durationInMinutes = orderQty
        }
      } else {
        this.disableButton = true
        this.displayError = true
        this.timeError = 'PLEASE ENTER A VALID TIME. MINIMUM OF 30 MINS. AND MAXIMUM OF 6 HOURS'
      }
    }
  }
}
</script>
<style lang='sass' scoped>
.card-slot
  height: 290px
  width: 290px
</style>
