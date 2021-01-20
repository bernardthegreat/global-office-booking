const state = {
  apiUrl: process.env.API_URL,
  loading: null,
  hourlyBookings: []
}

const mutations = {
  setHourlyBookings (state, bookings) {
    state.hourlyBookings = bookings
  }
}

const actions = {
  async getHourlyBookings (state, date) {
    const bookings = await fetch(
      `${this.state.booking.apiUrl}/get-hourly-bookings.php?book_date=${date}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    ).then((response) => response.json())

    if (bookings.length > 0) {
      state.commit('setHourlyBookings', bookings)
    }
  }
}

const getters = {
  getHourlyBookings (state) {
    return state.hourlyBookings
  },
  loading (state) {
    return state.loading
  }
}

export default {
  namespace: true,
  state,
  mutations,
  actions,
  getters
}
