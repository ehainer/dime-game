const INITIAL_STATE = {
  theme: {},
  themeIndex: 0,
  enableHistory: true
}

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, view: action.payload }
    case 'SET_ENABLE_HISTORY':
      return { ...state, enableHistory: action.payload }
    default:
      return state
  }
}