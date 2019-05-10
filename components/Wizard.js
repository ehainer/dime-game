import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import {
  View,
  StyleSheet,
  Dimensions,
  AsyncStorage,
  StatusBar,
  SafeAreaView
} from 'react-native'

import Carousel, { Pagination } from 'react-native-snap-carousel'

import Challenge from './Challenge'
import Questions from './Questions'
import Describe from './Describe'
import Result from './Result'

import Actions from '../redux/actions'

const { width, height } = Dimensions.get('window')

class Wizard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      index: 0,
      layout: null
    }

    this.setStep = this.setStep.bind(this)
    this.getStep = this.getStep.bind(this)
    this.getSteps = this.getSteps.bind(this)
    this.onComplete = this.onComplete.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.index !== this.state.index
    || nextProps.step !== this.props.step
    || nextProps.type !== this.props.type
    || nextProps.isInGame !== this.props.isInGame
    || nextProps.isGameStarted !== this.props.isGameStarted
    || nextProps.answers.length !== this.props.answers.length
  }

  componentDidUpdate(prevProps) {
    if(prevProps.step !== this.props.step){
      this.setStep(this.props.step)
    }

    if(this._wizard){
      this._wizard.triggerRenderingHack()
    }
  }

  async onComplete() {
    if(this.props.enableHistory){
      let history = await AsyncStorage.getItem('@minow.dbt.dime:history')
      history = JSON.parse(history) || []
  
      history.push({
        type: this.props.type,
        title: this.props.title.trim(),
        answers: this.props.answers,
        date: new Date().toISOString()
      })
  
      await AsyncStorage.setItem('@minow.dbt.dime:history', JSON.stringify(history))
      this.props.setHistory(history)
    }

    this.props.resetGame().then(() => {
      this.props.setIsInGame(false)
    })
  }

  setStep(step) {
    this.setState({ index: step })

    requestAnimationFrame(() => {
      if(this._wizard){
        this._wizard.snapToItem(step)
      }
    })
  }

  getSteps() {
    const allowed = [
      true,
      this.props.isGameDescribed,
      ['ASK', 'SAY_NO'].includes(this.props.type),
      this.props.answers.length === 10
    ].filter(a => a).length

    return [
      { key: 'describe' },
      { key: 'challenge' },
      { key: 'questions' },
      { key: 'result' }
    ].slice(0, allowed)
  }

  getStep({ index }) {
    return [(<Describe />), (<Challenge />), (<Questions />), (<Result onComplete={this.onComplete} />)][index]
  }

  getStepLayout(data, index) {
    return { length: width, offset: width * index, index }
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }} onLayout={(e) => this.setState({ layout: e.nativeEvent.layout })}>
          {this.state.layout && <Carousel
            ref={(l) => { this._wizard = l }}
            data={this.getSteps()}
            scrollEnabled={true}
            renderItem={this.getStep}
            sliderHeight={this.state.layout.height}
            itemHeight={this.state.layout.height}
            sliderWidth={this.state.layout.width}
            itemWidth={this.state.layout.width}
            getItemLayout={this.getStepLayout}
            keyboardShouldPersistTaps="handled"
            onBeforeSnapToItem={(index) => this.setState({ index: index }) }
          />}
          {this._wizard && <Pagination
            dotsLength={4}
            activeDotIndex={this.state.index}
            containerStyle={{ marginBottom: 20, paddingVertical: 20 }}
            carouselRef={this._wizard}
            tappableDots={!!this._wizard}
            scrolling
            dotStyle={{
              width: 10,
              height: 10,
              borderRadius: 5,
              marginHorizontal: 8,
              backgroundColor: 'rgba(255, 255, 255, 0.92)'
            }}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
          />}
        </View>
      </SafeAreaView>)
  }
}

Wizard.propTypes = {
  step: PropTypes.number
}

const styles = StyleSheet.create({
})

const mapStateToProps = (state) => ({
  isInGame: state.States.isInGame,
  isGameStarted: state.States.isGameStarted,
  isGameDescribed: state.States.isGameDescribed,
  step: state.Game.step,
  type: state.Game.type,
  title: state.Game.title,
  answers: state.Game.answers,
  enableHistory: state.Settings.enableHistory
})

const mapDispatchToProps = {
  resetGame: Actions.resetGame,
  setIsInGame: Actions.setIsInGame,
  setHistory: Actions.setHistory
}

export default connect(mapStateToProps, mapDispatchToProps)(Wizard)
