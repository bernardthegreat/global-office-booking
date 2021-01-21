<template>
  <div>
    <q-card>
        <q-card-section class="bg-primary text-white">
          <div class="text-h5" align="center">
            SLOTS
          </div>
        </q-card-section>
        <q-card-section class="q-mt-md" v-if="showLoading">
          <q-inner-loading :showing="showLoading">
            <q-spinner-gears size="50px" color="primary" />
          </q-inner-loading>
        </q-card-section>
          <transition
            appear
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut"
          >
            <div>
              <q-card-section v-show="showSlots">
                <div class="row justify-center">
                  <div class="col-lg-12 text-h6" align="center">
                    Taken Slots
                  </div>
                  <div class="col-lg-6"
                    v-for="bookings in hourlyBookingsTaken"
                    :key="bookings.id"
                  >
                    <q-card
                      class="q-ma-sm bg-primary text-white"
                    >
                      <q-card-section>
                        <div class="text-h6">
                          {{bookings.book_from}} - {{bookings.book_to}}
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>

                  <div class="col-lg-12 text-h6 q-pt-md" align="center">
                    Available Slots
                  </div>
                  <div class="col-lg-6"
                    v-for="bookings in hourlyBookingsAvailable"
                    :key="bookings.id"
                  >
                    <q-card
                      class="q-ma-sm bg-secondary text-white"
                    >
                      <q-card-section>
                        <div class="text-h6">
                          {{bookings.book_from}} - {{bookings.book_to}}
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                </div>
              </q-card-section>
              <q-card-section>
                <div v-show="showSlots">
                  <q-card-section>
                    <div class="flex flex-center">
                      <div class="q-pa-md">
                        <q-input filled v-model="overallTime">
                          <template v-slot:prepend>
                            <q-icon name="access_time" class="cursor-pointer">
                              <q-popup-proxy transition-show="scale" transition-hide="scale">
                                <q-time
                                  v-model="timeFrom"
                                  :minute-options="officeTimeFromMinutes"
                                >
                                  <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                  </div>
                                </q-time>
                              </q-popup-proxy>
                              <q-tooltip
                                transition-show="rotate"
                                transition-hide="rotate"
                              >From Time</q-tooltip>
                            </q-icon>
                          </template>
                          <template v-slot:append>
                            <q-icon name="access_time" class="cursor-pointer">
                              <q-popup-proxy transition-show="scale" transition-hide="scale">
                                <q-time
                                  v-model="timeTo"
                                  :minute-options="officeTimeToMinutes"
                                >
                                  <div class="row items-center justify-end">
                                    <q-btn v-close-popup label="Close" color="primary" flat />
                                  </div>
                                </q-time>
                              </q-popup-proxy>
                              <q-tooltip
                                transition-show="rotate"
                                transition-hide="rotate"
                              >To Time</q-tooltip>
                            </q-icon>
                          </template>
                        </q-input>
                      </div>
                      <div class="q-pa-md">
                        <q-btn color="primary" push>
                          BOOK
                          <q-tooltip
                            transition-show="rotate"
                            transition-hide="rotate"
                          >BOOK HOURLY RENTALS</q-tooltip>
                        </q-btn>
                      </div>
                    </div>
                  </q-card-section>
                  <q-card-actions>
                    <div class="q-pt-sm" v-show="displayError" style="width: 740px">
                      <q-banner inline-actions class="text-white bg-red">
                        <template v-slot:avatar>
                          <q-icon name="error" color="white" />
                        </template>
                        PLEASE ENTER A VALID TIME
                      </q-banner>
                    </div>
                  </q-card-actions>
                </div>
              </q-card-section>
            </div>
          </transition>
      </q-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: [
    'date',
    'showSlots',
    'showLoading'
  ],
  computed: {
    ...mapGetters([
      'hourlyBookingsAvailable',
      'hourlyBookingsTaken'
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
      officeTimeToMinutes: [0, 30]
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
    overallTime (val) {
      const splittedTime = val.split(' - ')
      const fromDate = `${this.date} ${splittedTime[0]}`
      const dateFrom = new Date(fromDate)
      const toDate = `${this.date} ${splittedTime[1]}`
      const dateTo = new Date(toDate)
      const seconds = Math.floor((dateTo - (dateFrom)) / 1000)
      const minutes = Math.floor(seconds / 60)
      if (minutes >= 30 && minutes < 360) {
        this.disableButton = false
        this.displayError = false
      } else {
        this.disableButton = true
        this.displayError = true
      }
    }
  },
  mounted () {
    this.overallTime = `${this.timeFrom} - ${this.timeTo}`
  }
}
</script>

<style lang="sass" scoped>
.card-slot
  height: 290px
  width: 290px
</style>
