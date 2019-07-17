import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import {
  View,
  StyleSheet,
  AsyncStorage,
  SafeAreaView
} from 'react-native'

import Carousel, { Pagination } from 'react-native-snap-carousel'

import Challenge from './Challenge'
import Questions from './Questions'
import Describe from './Describe'
import Result from './Result'
import Dot from './Dot'

import Actions from '../redux/actions'

import Layout from '../resources/layout'

class Wizard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      index: -1,
      layout: null
    }

    this.getStep = this.getStep.bind(this)
    this.getSteps = this.getSteps.bind(this)
    this.onComplete = this.onComplete.bind(this)
    this.getMaxStep = this.getMaxStep.bind(this)
  }

  componentDidMount() {
    this.setState({ index: this.props.step })
  }

  componentDidUpdate(prevProps) {
    if(prevProps.step !== this.props.step){
      this.setState({ index: this.props.step })
      if(this._wizard){
        requestAnimationFrame(() => {
          this._wizard.snapToItem(this.props.step)
        })
      }
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

    this.props.resetGame()
  }

  getMaxStep() {
    return [
      true,
      this.props.isGameDescribed,
      ['ASK', 'SAY_NO'].includes(this.props.type),
      this.props.answers.length === 10
    ].filter(a => a).length
  }

  getSteps() {
    return [
      { key: 'describe' },
      { key: 'challenge' },
      { key: 'questions' },
      { key: 'result' }
    ].slice(0, this.getMaxStep())
  }

  getStep({ index }) {
    return [
      (<Describe onNext={() => this.props.setGameStep(1)} />),
      (<Challenge onNext={() => this.props.setGameStep(2)} />),
      (<Questions onNext={() => this.props.setGameStep(3)} />),
      (<Result onComplete={this.onComplete} />)
    ][index]
  }

  getStepLayout(data, index) {
    return { length: Layout.width, offset: Layout.width * index, index }
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} onLayout={(e) => this.setState({ layout: e.nativeEvent.layout })}>
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
            removeClippedSubviews={true}
            initialNumToRender={1}
            maxToRenderPerBatch={3}
            updateCellsBatchingPeriod={200}
            windowSize={3}
            onBeforeSnapToItem={this.props.setGameStep}
          />}
          {this._wizard && <View style={{ position: 'absolute', bottom: 0, width: Layout.width }} onLayout={this.props.setBottomLayout}>
          <Pagination
            dotsLength={4}
            activeDotIndex={this.state.index}
            containerStyle={{ flex: -1, alignItems: 'center', justifyContent: 'center', paddingVertical: 15 }}
            carouselRef={this._wizard}
            tappableDots={true}
            renderDots={(activeIndex) => {
              const length = this.getMaxStep() - 1
              return ['describe', 'challenge', 'questions', 'result'].map((q, idx) => {
                return (<Dot key={idx} active={activeIndex === idx} enabled={idx <= length} onPress={() => this._wizard.snapToItem(this._wizard._getPositionIndex(idx))} />)
              })
            }}
          />
          </View>}
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
  isGameDescribed: state.States.isGameDescribed,
  step: state.Game.step,
  type: state.Game.type,
  title: state.Game.title,
  answers: state.Game.answers,
  enableHistory: state.Settings.enableHistory
})

const mapDispatchToProps = {
  resetGame: Actions.resetGame,
  setHistory: Actions.setHistory,
  setGameStep: Actions.setGameStep,
  setBottomLayout: Actions.setBottomLayout
}

export default connect(mapStateToProps, mapDispatchToProps)(Wizard)
