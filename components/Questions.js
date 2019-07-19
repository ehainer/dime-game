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
      index: -1,
      type: null,
      answers: [],
      allQuestions: [],
      questions: []
    }

    this.getQuestion = this.getQuestion.bind(this)
    this.setAnswer = this.setAnswer.bind(this)
    this.getTitle = this.getTitle.bind(this)
    this.setQuestionsLayout = this.setQuestionsLayout.bind(this)
  }

  shouldComponentUpdate(prevProps, prevState) {
    return (prevState.carousel === null && this.state.carousel !== null)
        || prevState.index !== this.state.index
        || prevState.layout !== this.state.layout
        || prevState.answers.join('') !== this.state.answers.join('')
        || prevProps.step !== this.props.step
        || prevProps.type !== this.props.type
        || prevState.questions.map(q => q.question).join('') !== this.state.questions.map(q => q.question).join('')
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let newState = {
      type: nextProps.type,
      answers: nextProps.answers
    }

    const answersChanged = nextProps.answers.join('') !== prevState.answers.join('')
    const typeChanged = nextProps.type !== prevState.type
    
    if(typeChanged || answersChanged){
      if(typeChanged){
        newState['index'] = -1
        newState['allQuestions'] = Options[nextProps.type] || []
      }
      
      newState['questions'] = (Options[nextProps.type]).slice(0, nextProps.answers.length + 1)
    }

    return newState
  }

  getTitle() {
    return this.props.type === 'ASK' ? 'Asking' : 'Saying No'
  }

  getQuestion({ item, index }) {
    return (<Question { ...item } answer={this.props.answers[index]} index={index} onAnswer={this.setAnswer} />)
  }

  getQuestions() {
    return Options[this.props.type]
  }

  setQuestionsLayout(event) {
    this.setState({ layout: event.nativeEvent.layout })
  }

  setAnswer(index, answer) {
    this.props.setAnswer(index, answer).then(() => {
      if(index === Options[this.props.type].length - 1){
        this.props.onNext()
      }else{
        requestAnimationFrame(() => {
          this.state.carousel.snapToNext()
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
          <View style={{ flex: -1, height: 30 }}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              {this.state.carousel && <View style={{ flex: -1, alignItems: 'center', justifyContent: 'center', minWidth: Layout.minWidth, maxWidth: Layout.maxWidth }}>
                <Pagination
                  dotsLength={this.state.allQuestions.length}
                  activeDotIndex={Math.max(this.state.index, 0)}
                  containerStyle={{
                    flex: -1,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  carouselRef={this.state.carousel}
                  tappableDots={true}
                  renderDots={(activeIndex) => {
                    const length = this.state.questions.length - 1
                    return this.state.allQuestions.map((q, idx) => {
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
                  requestAnimationFrame(() => {
                    this.forceUpdate()
                  })
                }
              }}
              activeAnimationType="decay"
              vertical={true}
              data={this.state.questions}
              renderItem={this.getQuestion}
              firstItem={0}
              sliderHeight={this.state.layout.height}
              itemHeight={this.state.layout.height}
              sliderWidth={Layout.width - PixelRatio.getPixelSizeForLayoutSize(40)}
              itemWidth={Layout.width - PixelRatio.getPixelSizeForLayoutSize(40)}
              keyExtractor={this.keyExtractor}
              onBeforeSnapToItem={(idx) => this.setState({ index: idx })}
              removeClippedSubviews={true}
              initialNumToRender={1}
              maxToRenderPerBatch={3}
              updateCellsBatchingPeriod={300}
              windowSize={10}
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
