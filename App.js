import React from 'react'

import Root from './components/Root'

import { Provider } from 'react-redux'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import Settings from './redux/reducers/Settings'
import History from './redux/reducers/History'
import States from './redux/reducers/States'
import Game from './redux/reducers/Game'

import GlobalStyles from './resources/styles'

const store = createStore(combineReducers({
  Settings,
  History,
  States,
  Game
}), applyMiddleware(thunk))

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Root style={GlobalStyles.page} />
      </Provider>
    )
  }
}
