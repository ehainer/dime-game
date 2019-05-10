import React from 'react'
import { connect } from 'react-redux'

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
  TouchableWithoutFeedback,
  Easing
} from 'react-native'

import Thanks from './Thanks'
import Button from './Button'

import Actions from '../redux/actions'

import GlobalStyles from '../resources/styles'

import debounce from 'debounce'

const { width, height } = Dimensions.get('window')

class About extends React.Component {
  constructor(props) {
    super(props)

    this.state = { tick: 0 }

    this.moveThanks = new Animated.ValueXY({ x: -width, y: 0 })
    this.moveAbout = new Animated.ValueXY({ x: 0, y: 0 })

    this.onClickNext = this.onClickNext.bind(this)
    this.onClickThanks = this.onClickThanks.bind(this)
    this.onTickThanks = this.onTickThanks.bind(this)
    this.onToggleThanks = this.onToggleThanks.bind(this)
  }

  componentDidUpdate(prevProps) {
    if(prevProps.isInThanks !== this.props.isInThanks){
      this.onToggleThanks()
    }
  }

  onClickNext() {
    this.props.resetGame().then(() => {
      this.props.setIsInGame(true)
      this.props.setGameStep(0)
    })
  }

  onTickThanks() {
    this.setState((prevState) => {
      return { tick: prevState.tick + 1 }
    })
  }

  onReleaseThanks = debounce(() => {
    this.setState({ tick: 0 })
  }, 8500)

  onClickThanks() {
    if(this.state.tick >= 3){
      this.props.setIsInThanks(true)
    }
    this.setState({ tick: 0 })
  }

  onToggleThanks() {
    this.props.setIsFullScreen(this.props.isInThanks)
    this.props.setScrollEnabled(!this.props.isInThanks)

    Animated.parallel([
      Animated.timing(this.moveThanks, {
        toValue: { x: this.props.isInThanks ? 0 : -width, y: 0 },
        duration: 1000,
        easing: Easing.bezier(0.455, 0.030, 0.515, 0.955),
        useNativeDriver: true
      }),
      Animated.timing(this.moveAbout, {
        toValue: { x: this.props.isInThanks ? width : 0, y: 0 },
        duration: 1000,
        easing: Easing.bezier(0.455, 0.030, 0.515, 0.955),
        useNativeDriver: true
      })
    ]).start()
  }

  render() {
    return (
      <View style={{ flex: 1 }} removeClippedSubviews={true}>
        <View style={{ flex: 1 }} removeClippedSubviews={true}>
          <Animated.View style={{ flex: 1, overflow: 'hidden', transform: this.moveAbout.getTranslateTransform() }}>
            <View style={GlobalStyles.header}>
              <TouchableWithoutFeedback onPress={this.onTickThanks} onPressOut={this.onReleaseThanks} onLongPress={this.onClickThanks} delayLongPress={8000}>
                <Text style={GlobalStyles.h1}>The Dime Game</Text>
              </TouchableWithoutFeedback>
              <Text style={GlobalStyles.h2}>Figuring out how stongly to ask or say no</Text>
            </View>
            <View style={{ marginVertical: 40, paddingHorizontal: 20 }}>
              <Text style={GlobalStyles.text}>From Dialectical Behavorial Therapy, the "Dime Game" is a valuable skill that can be used to figure out how strongly to ask for something or how strongly to say no.</Text>
              <Text style={{ ...GlobalStyles.text, marginTop: 20, }}>Check wise mind before acting, if some question categories are more important than others.</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Button style={{ flex: -1 }} backgroundColor="lightseagreen" onPress={this.onClickNext} title="Start New Game" />
            </View>
          </Animated.View>
          <Animated.View style={{ flex: 1, position: 'absolute', overflow: 'hidden', transform: this.moveThanks.getTranslateTransform() }}>
            <Thanks />
          </Animated.View>
        </View>
      </View>)
  }
}

const styles = StyleSheet.create({
})

const mapStateToProps = (state) => ({
  title: state.Game.title,
  isInThanks: state.States.isInThanks
})

const mapDispatchToProps = {
  resetGame: Actions.resetGame,
  setIsFullScreen: Actions.setIsFullScreen,
  setScrollEnabled: Actions.setScrollEnabled,
  setIsInThanks: Actions.setIsInThanks,
  setGameDescribed: Actions.setGameDescribed,
  setGameStarted: Actions.setGameStarted,
  setGameTitle: Actions.setGameTitle,
  setGameType: Actions.setGameType,
  setGameStep: Actions.setGameStep,
  setIsInGame: Actions.setIsInGame
}

export default connect(mapStateToProps, mapDispatchToProps)(About)
