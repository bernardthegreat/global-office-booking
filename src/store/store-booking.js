import moment from 'moment'
const state = {
  apiUrl: process.env.API_URL,
  hourlyBookings: [],
  paypalBreakdownVisibility: false,
  bookingCost: '20.00',
  hourlyBookingsAvailable: [],
  hourlyBookingsTaken: [],
  orderSummary: [],
  paymentStatusSuccess: '',
  overallTime: '',
  paypalDialog: false
}

const mutations = {
  // setHourlyBookingsAvailable (state, availableBookings) {
  //   state.hourlyBookingsAvailable = availableBookings
  // },
  setAvailableBookings (state, bookings) {
    const timeTaken = bookings.bookings
    timeTaken.sort((a, b) => {
      const bookFromA = `${moment(bookings.date).format('YYYY-MM-DD')} ${a.book_from}`
      const bookFromB = `${moment(bookings.date).format('YYYY-MM-DD')} ${b.book_from}`
      if (bookFromA < bookFromB) {
        return -1
      }

      if (bookFromA > bookFromB) {
        return 1
      }
    })
    const availableTimeArray = []
    var endTimeFarthest = moment(bookings.date).format('YYYY-MM-DD') + ' ' + '0:00'
    var startTimeMinimum = moment(bookings.date).format('YYYY-MM-DD') + ' ' + '0:00'

    timeTaken.forEach((element, index) => {
      const currentEndTime = moment(bookings.date).format('YYYY-MM-DD') + ' ' + element.book_to
      const currentStartTime = moment(bookings.date).format('YYYY-MM-DD') + ' ' + element.book_from
      if (moment(currentStartTime).isBefore(startTimeMinimum)) {
        startTimeMinimum = currentStartTime
      }
      if (moment(currentEndTime).isAfter(endTimeFarthest)) {
        endTimeFarthest = currentEndTime
      }
      if (index === timeTaken.length - 1) {
        if (timeTaken.length === 1) {
          availableTimeArray.push({
            book_from: '0:00',
            book_to: moment(currentStartTime).format('H:mm')
          })
        }

        availableTimeArray.push({
          book_from: moment(endTimeFarthest).format('H:mm'),
          book_to: '0:00'
        })
      } else {
        const nextBusyTime = timeTaken[index + 1]
        const nextStartTime = `${bookings.date} ${nextBusyTime.book_from}`
        if (index === 0) {
          availableTimeArray.push({
            book_from: '0:00',
            book_to: moment(currentStartTime).format('H:mm')
          })
        }
        var endTimeToCompare = moment(currentEndTime).isBefore(endTimeFarthest) ? endTimeFarthest : currentEndTime
        if (moment(endTimeToCompare).isBefore(nextStartTime)) {
          availableTimeArray.push({
            book_from: moment(endTimeToCompare).format('H:mm'),
            book_to: moment(nextStartTime).format('H:mm')
          })
        }
      }
    })
    if (availableTimeArray.length > 0) {
      if (availableTimeArray[0].book_from === '0:00' && availableTimeArray[0].book_to === '0:00') {
        availableTimeArray.splice(0, 1)
      }
    }
    state.hourlyBookingsAvailable = availableTimeArray
    state.hourlyBookingsTaken = bookings.bookings
  },
  setOrderSummary (state, order) {
    state.orderSummary = order
  },
  setPaymentStatus (state, status) {
    state.paymentStatusSuccess = status
  },
  displayPaypalBreakdown (state, display) {
    state.paypalBreakdownVisibility = display
    state.paypalDialog = display
  },
  closePaypalDialog (state, status) {
    state.paypalDialog = status
  },
  setOverallTime (state, time) {
    state.overallTime = time
    state.paypalBreakdownVisibility = false
  }
}

const actions = {
  async getHourlyBookings (state, date) {
    try {
      var takenBookings = await fetch(
        `${this.state.booking.apiUrl}/get-hourly-bookings.php?book_date=${date}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        }
      ).then((response) => response.json())
    } catch (error) {
      return error
    }

    // const takenBookings = this.state.booking.testHourlyBookings
    if (takenBookings !== undefined) {
      for (var result of takenBookings) {
        result.book_from = moment(result.book_from).format('H:mm')
        result.book_to = moment(result.book_to).format('H:mm')
      }
      const bookings = {
        bookings: takenBookings,
        date: date
      }
      state.commit('setAvailableBookings', bookings)
    }
  },
  getOrderSummary (state, order) {
    state.commit('setOrderSummary', order)
  },
  async displayPaypalBreakdown (state, status) {
    state.commit('displayPaypalBreakdown', status)
  },
  async setOverallTime (state, time) {
    state.commit('setOverallTime', time)
  },
  async paypalDialog (state) {
    state.commit('closePaypalDialog', false)
  },
  async processPayment (state, payment) {
    state.commit('setPaymentStatus', true)
    try {
      await fetch(
        `${this.state.booking.apiUrl}/post-hourly-booking.php?fullname=${payment.name}&email=${payment.emailAddress}&book_date=${payment.bookingDate}&book_from=${payment.bookFrom}&book_to=${payment.bookTo}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        }
      ).then((response) => response.json())
    } catch (error) {
      return error
    }
  }
}

const getters = {
  hourlyBookingsAvailable (state) {
    return state.hourlyBookingsAvailable
  },
  hourlyRateCost (state) {
    return state.bookingCost
  },
  hourlyBookingsTaken (state) {
    return state.hourlyBookingsTaken
  },
  paypalBreakdownVisibility (state) {
    return state.paypalBreakdownVisibility
  },
  orderSummary (state) {
    return state.orderSummary
  },
  paymentStatusSuccess (state) {
    return state.paymentStatusSuccess
  },
  overallTime (state) {
    return state.overallTime
  },
  paypalDialog (state) {
    return state.paypalDialog
  }
}

export default {
  namespace: true,
  state,
  mutations,
  actions,
  getters
}
