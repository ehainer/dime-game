const INITIAL_STATE = {
  isLoaded: false,
  isInGame: false,
  isInHistory: false,
  title: '',
  theme: {},
  themeIndex: 0,
  enableHistory: true,
  view: 'home',
  action: 'answer',
  type: null,
  layouts: {},
  questions: [],
  answers: {},
  history: [],
  page: 1
}

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, view: action.payload }
    case 'SET_ACTION':
      return { ...state, action: action.payload }
    case 'SET_GAME_TITLE':
      return { ...state, title: action.payload }
    case 'SET_GAME_TYPE':
      return { ...state, type: action.payload }
    case 'SET_LAYOUT':
      let layouts = Object.assign(state.layouts, action.payload)
      return { ...state, layouts: layouts }
    case 'SET_IS_LOADED':
      return { ...state, isLoaded: action.payload }
    case 'SET_IS_IN_GAME':
      return { ...state, isInGame: action.payload }
    case 'SET_IS_IN_HISTORY':
      return { ...state, isInHistory: action.payload }
    case 'SET_THEME_INDEX':
      return { ...state, themeIndex: action.payload }
    case 'SET_ENABLE_HISTORY':
      return { ...state, enableHistory: action.payload }
    case 'SET_QUESTIONS':
      return { ...state, questions: action.payload }
    case 'SET_ANSWER':
      return { ...state, answers: Object.assign(state.answers, action.payload) }
    case 'SET_ANSWERS':
      return { ...state, answers: action.payload }
    case 'RESET_GAME':
      return { ...state, questions: [], answers: {}, type: null, isInGame: false }
    case 'SET_HISTORY':
      return { ...state, history: action.payload }
    case 'SET_PAGE':
      return { ...state, page: action.payload }
    default:
      return state
  }
}