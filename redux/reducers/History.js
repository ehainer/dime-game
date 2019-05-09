const INITIAL_STATE = {
  history: []
}

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SET_HISTORY':
      return { ...state, history: action.payload }
    default:
      return state
  }
}