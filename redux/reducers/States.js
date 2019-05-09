const INITIAL_STATE = {
  page: 1,
  isLoaded: false,
  isInGame: false,
  isInMenu: false,
  isInHistory: false,
  isInThanks: false,
  isFullScreen: false,
  changePage: false,
  isGameStarted: false,
  isGameDescribed: false,
  isScrollEnabled: true
}

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SET_PAGE':
      return { ...state, page: action.payload }
    case 'SET_IS_LOADED':
      return { ...state, isLoaded: action.payload }
    case 'SET_IS_IN_GAME':
      return { ...state, isInGame: action.payload }
    case 'SET_IS_IN_MENU':
      return { ...state, isInMenu: action.payload }
    case 'SET_IS_IN_HISTORY':
      return { ...state, isInHistory: action.payload }
    case 'SET_IS_IN_THANKS':
      return { ...state, isInThanks: action.payload }
    case 'SET_IS_FULL_SCREEN':
      return { ...state, isFullScreen: action.payload }
    case 'SET_CHANGE_PAGE':
      return { ...state, changePage: action.payload }
    case 'SET_GAME_STARTED':
      return { ...state, isGameStarted: action.payload }
    case 'SET_GAME_DESCRIBED':
      return { ...state, isGameDescribed: action.payload }
    case 'SET_IS_SCROLL_ENABLED':
      return { ...state, isScrollEnabled: action.payload }
    default:
      return state
  }
}