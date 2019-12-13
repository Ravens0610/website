export const getters = {
  isAuthed(state) {
    return state.auth.loggedIn
  },
  getUser(state) {
    return state.auth.user
  }
}
