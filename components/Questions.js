import React from 'react'
import { connect } from 'react-redux'

import {
  View,
  Text,
  StyleSheet,
  PixelRatio
} from 'react-native'

import Carousel from 'react-native-snap-carousel'

import Question from './Question.js'

import Actions from '../redux/actions'

import GlobalStyles from '../resources/styles'
import Layout from '../resources/layout'

import Options from '../resources/questions.json'

class Questions extends React.Component {
  constructor(props) {
    super(props)

    this.state = { layout: null }

    this.getQuestions = this.getQuestions.bind(this)
    this.getQuestion = this.getQuestion.bind(this)
    this.setAnswer = this.setAnswer.bind(this)
    this.getTitle = this.getTitle.bind(this)
    this.setQuestionsLayout = this.setQuestionsLayout.bind(this)
  }

  getTitle() {
    return this.props.type === 'ASK'
     ? 'Asking'
     : 'Saying No'
  }

  getQuestions() {
    return this.props.type ? Options[this.props.type].slice(0, this.props.answers.length + 1) : []
  }

  getQuestion({ item, index }) {
    return (<Question { ...item } answer={this.props.answers[index]} index={index} onAnswer={this.setAnswer} />)
  }

  setQuestionsLayout(event) {
    this.setState({ layout: event.nativeEvent.layout })
  }

  setAnswer(index, answer) {
    this.props.setAnswer(index, answer).then(() => {
      if(index === Options['ASK'].length - 1){
        this.props.setGameStep(3)
      }else{
        requestAnimationFrame(() => {
          this._carousel.snapToNext()
        })
      }
    })
  }

  keyExtractor(item) {
    return item.category
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View style={GlobalStyles.header}>
            <Text style={GlobalStyles.h1}>{this.getTitle()}</Text>
            {this.props.title.trim() !== '' && <Text style={GlobalStyles.caption}>"{this.props.title.trim()}"</Text>}
          </View>
          <View style={{ flex: 1, paddingHorizontal: 20, paddingBottom: PixelRatio.getPixelSizeForLayoutSize(30) }} onLayout={this.setQuestionsLayout}>
            {this.state.layout && this.state.layout.height && <Carousel
              ref={(c) => { this._carousel = c }}
              activeAnimationType="decay"
              vertical={true}
              data={this.getQuestions()}
              renderItem={this.getQuestion}
              sliderHeight={this.state.layout.height}
              itemHeight={this.state.layout.height}
              sliderWidth={Layout.width - PixelRatio.getPixelSizeForLayoutSize(40)}
              itemWidth={Layout.width - PixelRatio.getPixelSizeForLayoutSize(40)}
              keyExtractor={this.keyExtractor}
            />}
          </View>
        </View>
      </View>)
  }
}

const styles = StyleSheet.create({
})

const mapStateToProps = (state) => ({
  step: state.Game.step,
  type: state.Game.type,
  title: state.Game.title,
  answers: state.Game.answers
})

const mapDispatchToProps = {
  setGameStep: Actions.setGameStep,
  setAnswer: Actions.setAnswer
}

export default connect(mapStateToProps, mapDispatchToProps)(Questions)
