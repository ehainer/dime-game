const INITIAL_STATE = {
  theme: {},
  themeIndex: 0,
  enableHistory: true,
  layout: null,
  bottomLayout: {
    height: 0
  }
}

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, view: action.payload }
    case 'SET_ENABLE_HISTORY':
      return { ...state, enableHistory: action.payload }
    case 'SET_LAYOUT':
      return { ...state, layout: action.payload }
    case 'SET_BOTTOM_LAYOUT':
      return { ...state, bottomLayout: action.payload }
    default:
      return state
  }
}