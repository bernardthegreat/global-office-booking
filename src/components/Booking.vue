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
            <q-input filled v-model="date">
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
        </q-card-section>
        <q-card-actions align="center">
          <q-btn class="full-width" color="primary" :disable="disableButton">CHECK AVAILABILITY
            <q-tooltip
              transition-show="rotate"
              transition-hide="rotate"
            >CHECK AVAILABILITY OF DATE AND TIME</q-tooltip>
          </q-btn>
          <div class="q-pt-sm" v-show="displayError" style="width: 340px">
            <q-banner inline-actions class="text-white bg-red">
              <template v-slot:avatar>
                <q-icon name="error" color="white" />
              </template>
              PLEASE ENTER A VALID TIME
            </q-banner>
          </div>
        </q-card-actions>
      </q-card>
    </div>
    <div class="col-lg-8 col-sm-12 col-xs-12 q-pa-md">
      <q-card>
        <q-card-section class="bg-primary text-white">
          <div class="text-h5" align="center">
            AVAILABILITY
          </div>
        </q-card-section>
        <q-card-section>
          BOOKING HERE
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import { date } from 'quasar'
export default {
  data () {
    return {
      date: '',
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
  created () {
    this.formatDates()
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
  methods: {
    optionFrom (d) {
      return d >= date.formatDate(Date.now(), 'YYYY/MM/DD')
    },
    formatDates () {
      const dateNow = new Date().toISOString().substring(0, 10)
      this.date = dateNow
      this.overallTime = `${this.timeFrom} - ${this.timeTo}`
    }
  }
}
</script>
