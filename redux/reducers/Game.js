import update from 'immutability-helper'

const INITIAL_STATE = {
  title: '',
  type: null,
  step: -1,
  questions: [],
  answers: [],
  index: 0
}

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SET_GAME_INDEX':
      return { ...state, index: action.payload }
    case 'SET_GAME_TITLE':
      return { ...state, title: action.payload }
    case 'SET_GAME_TYPE':
      return { ...state, type: action.payload }
    case 'SET_GAME_STEP':
      return { ...state, step: action.payload }
    case 'SET_QUESTIONS':
      return { ...state, questions: action.payload }
    case 'SET_ANSWER':
      return update(state, {
        answers: {
          [action.payload.index]: { $set: action.payload.value }
        }
      })
    case 'SET_ANSWERS':
      return { ...state, answers: action.payload }
    case 'SAVE_GAME':
      return { ...state, answers: action.payload }
    default:
      return state
  }
}