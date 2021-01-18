const state = {
  apiUrl: process.env.API_URL,
  availableSlots: [
    {
      from: '08:00',
      to: '08:30',
      status: 'taken'
    }
  ]
}

const mutations = {
}

const actions = {

}

const getters = {
  availableSlots (state) {
    return state.availableSlots
  }
}

export default {
  namespace: true,
  state,
  mutations,
  actions,
  getters
}
