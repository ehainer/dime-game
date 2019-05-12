import React from 'react'
import { connect } from 'react-redux'

import {
  View,
  Text,
  StyleSheet,
  PixelRatio
} from 'react-native'

import Carousel, { Pagination } from 'react-native-snap-carousel'

import Dot from './Dot'

import Question from './Question.js'

import Actions from '../redux/actions'

import GlobalStyles from '../resources/styles'
import Layout from '../resources/layout'

import Options from '../resources/questions.json'

class Questions extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      carousel: null,
      layout: null,
      index: -1
    }

    this.getAllQuestions = this.getAllQuestions.bind(this)
    this.getQuestions = this.getQuestions.bind(this)
    this.getQuestion = this.getQuestion.bind(this)
    this.setAnswer = this.setAnswer.bind(this)
    this.getTitle = this.getTitle.bind(this)
    this.setQuestionsLayout = this.setQuestionsLayout.bind(this)
  }

  shouldComponentUpdate(prevProps, prevState) {
    return prevState.index !== this.state.index
     || prevState.carousel !== this.state.carousel
     || prevState.layout !== this.state.layout
     || prevProps.answers.length !== this.props.answers.length
     || prevProps.step !== this.props.step
  }

  componentDidMount() {
    let options = this.props.type ? Options[this.props.type] : []
    this.setState({ index: 0 })
  }

  componentDidUpdate(prevProps) {
    if(prevProps.type !== this.props.type){
      this.setState({ index: -1 })
    }
  }

  getTitle() {
    return this.props.type === 'ASK' ? 'Asking' : 'Saying No'
  }

  getAllQuestions() {
    return this.props.type ? Options[this.props.type] : []
  }

  getQuestions() {
    return this.getAllQuestions().slice(0, this.props.answers.length + 1)
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
        this.props.onNext()
      }else{
        setTimeout(() => {
          if(this.state.carousel){
            requestAnimationFrame(() => {
              this.state.carousel.snapToNext()
            })
          }
        }, 1)
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
          <View style={{ flex: -1, height: 30 }}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              {this.state.carousel && <View style={{ flex: -1, alignItems: 'center', justifyContent: 'center', minWidth: Layout.minWidth, maxWidth: Layout.maxWidth }}>
                <Pagination
                  dotsLength={this.getAllQuestions().length}
                  activeDotIndex={Math.max(this.state.index, 0)}
                  containerStyle={{
                    flex: -1,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  carouselRef={this.state.carousel}
                  tappableDots={true}
                  renderDots={(activeIndex) => {
                    const length = this.getQuestions().length - 1
                    return this.getAllQuestions().map((q, idx) => {
                      return (<Dot key={idx} active={activeIndex === idx} enabled={idx <= length} onPress={() => this.state.carousel.snapToItem(this.state.carousel._getPositionIndex(idx))} />)
                    })
                  }}
                />
              </View>}
            </View>
          </View>
          <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 20, marginBottom: this.props.bottomLayout.height }} onLayout={this.setQuestionsLayout}>
            {this.state.layout && this.state.layout.height && <Carousel
              ref={(c) => {
                if(!this.state.carousel){
                  this.setState({ carousel: c })
                }
              }}
              activeAnimationType="decay"
              vertical={true}
              data={this.getQuestions()}
              renderItem={this.getQuestion}
              firstItem={0}
              sliderHeight={this.state.layout.height}
              itemHeight={this.state.layout.height / 2}
              sliderWidth={Layout.width - PixelRatio.getPixelSizeForLayoutSize(40)}
              itemWidth={Layout.width - PixelRatio.getPixelSizeForLayoutSize(40)}
              keyExtractor={this.keyExtractor}
              onBeforeSnapToItem={(idx) => this.setState({ index: idx })}
              slideInterpolatedStyle={(index, animatedValue, carouselProps) => {
                return {
                  opacity: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                    extrapolate: 'clamp'
                  }),
                  transform: [
                    {
                      scale: animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.3, 1],
                        extrapolate: 'clamp'
                      }),
                      rotateX: animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 0],
                        extrapolate: 'clamp'
                      }),
                      perspective: 1000
                    }
                  ]
                }
              }}
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
  answers: state.Game.answers,
  bottomLayout: state.Settings.bottomLayout
})

const mapDispatchToProps = {
  setGameStep: Actions.setGameStep,
  setAnswer: Actions.setAnswer
}

export default connect(mapStateToProps, mapDispatchToProps)(Questions)
