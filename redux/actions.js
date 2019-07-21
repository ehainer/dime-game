import Options from '../resources/questions.json'

export default {
  setLayout: (event) => {
    return (dispatch) => {
      dispatch({ type: 'SET_LAYOUT', payload: event.nativeEvent.layout })
      return Promise.resolve()
    }
  },
  setBottomLayout: (event) => {
    return (dispatch) => {
      dispatch({ type: 'SET_BOTTOM_LAYOUT', payload: event.nativeEvent.layout })
      return Promise.resolve()
    }
  },
  setPage: (page) => {
    return (dispatch) => {
      dispatch({ type: 'SET_PAGE', payload: page })
      return Promise.resolve()
    }
  },
  setIsLoaded: (loaded) => {
    return (dispatch) => {
      dispatch({ type: 'SET_IS_LOADED', payload: loaded })
      return Promise.resolve()
    }
  },
  setIsInGame: (gaming) => {
    return (dispatch) => {
      dispatch({ type: 'SET_IS_IN_GAME', payload: gaming })
      return Promise.resolve()
    }
  },
  setIsInHistory: (history) => {
    return (dispatch) => {
      dispatch({ type: 'SET_IS_IN_HISTORY', payload: history })
      return Promise.resolve()
    }
  },
  setIsInMenu: (menu) => {
    return (dispatch) => {
      dispatch({ type: 'SET_IS_IN_MENU', payload: menu })
      return Promise.resolve()
    }
  },
  setIsInThanks: (thanks) => {
    return (dispatch) => {
      dispatch({ type: 'SET_IS_IN_THANKS', payload: thanks })
      return Promise.resolve()
    }
  },
  setIsFullScreen: (fullscreen) => {
    return (dispatch) => {
      dispatch({ type: 'SET_IS_FULL_SCREEN', payload: fullscreen })
      return Promise.resolve()
    }
  },
  setGameTitle: (title) => ({ type: 'SET_GAME_TITLE', payload: title }),
  setGameIndex: (index) => ({ type: 'SET_GAME_INDEX', payload: index }),
  setGameType: (type) => {
    return (dispatch, getState) => {
      if(getState().Game.type !== type){
        dispatch({ type: 'SET_ANSWERS', payload: [] })
      }
      dispatch({ type: 'SET_GAME_TYPE', payload: type })
      dispatch({ type: 'SET_GAME_INDEX', payload: -1 })
      dispatch({ type: 'SET_ALL_QUESTIONS', payload: Options[getState().Game.type] })
      dispatch({ type: 'SET_QUESTIONS', payload: Options[getState().Game.type].slice(0, getState().Game.answers + 1) })
      return Promise.resolve()
    }
  },
  setGameStep: (step) => ({ type: 'SET_GAME_STEP', payload: step }),
  setAnswer: (index, value) => {
    return (dispatch, getState) => {
      dispatch({ type: 'SET_ANSWER', payload: { index: index, value: value } })
      dispatch({ type: 'SET_QUESTIONS', payload: Options[getState().Game.type].slice(0, getState().Game.answers.length + 1) })
      return Promise.resolve()
    }
  },
  setAnswers: (answers) => {
    return (dispatch) => {
      dispatch({ type: 'SET_ANSWERS', payload: answers })
      return Promise.resolve()
    }
  },
  resetGame: () => {
    return (dispatch) => {
      dispatch({ type: 'SET_ANSWERS', payload: [] })
      dispatch({ type: 'SET_GAME_TYPE', payload: null })
      dispatch({ type: 'SET_GAME_TITLE', payload: '' })
      dispatch({ type: 'SET_GAME_STARTED', payload: false })
      dispatch({ type: 'SET_GAME_DESCRIBED', payload: false })
      dispatch({ type: 'SET_GAME_STEP', payload: -1 })
      dispatch({ type: 'SET_IS_IN_GAME', payload: false })
      return Promise.resolve()
    }
  },
  setChangePage: (change) => ({ type: 'SET_CHANGE_PAGE', payload: change }),
  setGameStarted: (started) => ({ type: 'SET_GAME_STARTED', payload: started }),
  setGameDescribed: (described) => ({ type: 'SET_GAME_DESCRIBED', payload: described }),
  setScrollEnabled: (enabled) => ({ type: 'SET_IS_SCROLL_ENABLED', payload: enabled }),
  setHistory: (history) => ({ type: 'SET_HISTORY', payload: history }),
  setEnableHistory: (enabled) => ({ type: 'SET_ENABLE_HISTORY', payload: enabled })
}