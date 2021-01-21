import moment from 'moment'
const state = {
  apiUrl: process.env.API_URL,
  hourlyBookings: [],
  testHourlyBookings: [
    {
      book_from: '15:00',
      book_to: '16:30'
    },
    {
      book_from: '16:30',
      book_to: '19:00'
    },
    {
      book_from: '04:00',
      book_to: '15:00'
    },
    {
      book_from: '03:00',
      book_to: '04:00'
    }
  ],
  hourlyBookingsAvailable: [],
  hourlyBookingsTaken: []
}

const mutations = {
  // setHourlyBookingsAvailable (state, availableBookings) {
  //   state.hourlyBookingsAvailable = availableBookings
  // },
  setAvailableBookings (state, bookings) {
    const timeTaken = bookings.bookings
    timeTaken.sort((a, b) => {
      const bookFromA = `${bookings.date} ${a.book_from}`
      const bookFromB = `${bookings.date} ${b.book_from}`
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

    state.hourlyBookingsAvailable = availableTimeArray
    state.hourlyBookingsTaken = bookings.bookings
  }
}

const actions = {
  async getHourlyBookings (state, date) {
    // const takenBookings = await fetch(
    //   `${this.state.booking.apiUrl}/get-hourly-bookings.php?book_date=${date}`,
    //   {
    //     method: 'GET',
    //     headers: { 'Content-Type': 'application/json' }
    //   }
    // ).then((response) => response.json())

    const takenBookings = this.state.booking.testHourlyBookings
    const bookings = {
      bookings: takenBookings,
      date: date
    }
    if (takenBookings.length > 0) {
      state.commit('setAvailableBookings', bookings)
    } else {
      state.commit('setAvailableBookings', bookings)
    }
    console.log(date)
  }
}

const getters = {
  hourlyBookingsAvailable (state) {
    return state.hourlyBookingsAvailable
  },
  hourlyBookingsTaken (state) {
    return state.hourlyBookingsTaken
  }
}

export default {
  namespace: true,
  state,
  mutations,
  actions,
  getters
}
