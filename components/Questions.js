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
      layout: null
    }

    this.getQuestion = this.getQuestion.bind(this)
    this.setAnswer = this.setAnswer.bind(this)
    this.getTitle = this.getTitle.bind(this)
    this.setQuestionsLayout = this.setQuestionsLayout.bind(this)
  }

  shouldComponentUpdate(prevProps, prevState) {
    return (prevState.carousel === null && this.state.carousel !== null)
        || prevState.layout !== this.state.layout
        || prevProps.index !== this.props.index
        || prevProps.type !== this.props.type
        || prevProps.step !== this.props.step
        || prevProps.answers.length !== this.props.answers.length
  }

  getTitle() {
    return this.props.type === 'ASK' ? 'Asking' : 'Saying No'
  }

  getQuestion({ item, index }) {
    return (<Question { ...item } answer={this.props.answers[index]} index={index} onAnswer={this.setAnswer} />)
  }

  setQuestionsLayout(event) {
    this.setState({ layout: event.nativeEvent.layout })
  }

  setAnswer(index, answer) {
    this.props.setAnswer(index, answer).then(() => {
      if(index === this.props.allQuestions.length - 1){
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
                  dotsLength={10}
                  activeDotIndex={Math.max(this.props.index, 0)}
                  containerStyle={{
                    flex: -1,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  carouselRef={this.state.carousel}
                  tappableDots={true}
                  renderDots={(activeIndex) => {
                    const length = this.props.questions.length - 1
                    return this.props.allQuestions.map((q, idx) => {
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
              data={this.props.questions}
              extraData={this.props.questions}
              renderItem={this.getQuestion}
              firstItem={0}
              sliderHeight={this.state.layout.height}
              itemHeight={this.state.layout.height}
              sliderWidth={Layout.width - PixelRatio.getPixelSizeForLayoutSize(40)}
              itemWidth={Layout.width - PixelRatio.getPixelSizeForLayoutSize(40)}
              keyExtractor={this.keyExtractor}
              onBeforeSnapToItem={(idx) => this.props.setGameIndex(idx)}
              removeClippedSubviews={true}
              initialNumToRender={1}
              maxToRenderPerBatch={3}
              updateCellsBatchingPeriod={300}
              windowSize={3}
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
  index: state.Game.index,
  answers: state.Game.answers,
  questions: state.Game.questions,
  allQuestions: state.Game.allQuestions,
  bottomLayout: state.Settings.bottomLayout
})

const mapDispatchToProps = {
  setGameIndex: Actions.setGameIndex,
  setGameStep: Actions.setGameStep,
  setAnswer: Actions.setAnswer
}

export default connect(mapStateToProps, mapDispatchToProps)(Questions)
