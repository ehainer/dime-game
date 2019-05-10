import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import {
  View,
  Text,
  StyleSheet,
  Easing,
  PixelRatio
} from 'react-native'

import { AnimatedCircularProgress } from 'react-native-circular-progress'

import Button from './Button'

import GlobalStyles from '../resources/styles'
import Layout from '../resources/layout'

import Answers from '../resources/answers.json'

class Result extends React.Component {
  constructor(props) {
    super(props)

    this.showProgress = this.showProgress.bind(this)
    this.getTitle = this.getTitle.bind(this)
    this.getIntensity = this.getIntensity.bind(this)
    this.getSolution = this.getSolution.bind(this)
    this.onComplete = this.onComplete.bind(this)
  }

  componentDidMount() {
    setTimeout(() => {
      this.showProgress()
    }, 300)
  }

  componentDidUpdate() {
    this.showProgress()
  }
  
  showProgress() {
    requestAnimationFrame(() => {
      if(this._progress){
        this._progress.animate(this.getIntensity() * 10, 1600, Easing.bezier(0.455, 0.030, 0.515, 0.955))
      }
    })
  }

  getTitle() {
    return this.props.type === 'ASK' ? 'How Strongly to Ask' : 'How Strongly to Say No'
  }

  getIntensity() {
    return this.props.type === 'ASK'
     ? this.props.answers.filter(a => a === 'YES').length
     : this.props.answers.filter(a => a === 'NO').length
  }

  getSolution() {
    return this.props.type ? Answers[this.props.type][this.getIntensity()] : ''
  }

  onComplete() {
    this.props.onComplete()
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View style={GlobalStyles.header}>
            <Text style={GlobalStyles.h1}>{this.getTitle()}</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }}>
            <View style={styles.outcome}>
              <View style={styles.progress}>
                <Text style={styles.intensity}>{this.getIntensity()}</Text>
                <AnimatedCircularProgress
                  ref={(p) => { this._progress = p }}
                  size={200}
                  width={10}
                  fill={0}
                  arcSweepAngle={300}
                  rotation={210}
                  duration={1600}
                  lineCap="round"
                  tintColor="lightseagreen"
                  onLayout={this.showProgress}
                  backgroundColor="rgba(0, 0, 0, 0.3)"
                />
              </View>
              <Text style={styles.solution}>{this.getSolution()}</Text>
            </View>
          </View>
          <View style={{ paddingHorizontal: 20, alignItems: 'center', paddingBottom: PixelRatio.getPixelSizeForLayoutSize(30) }}>
            <Button customContainerStyle={{ width: Layout.width > Layout.maxWidth ? Layout.defaultWidth : null }} backgroundColor="lightseagreen" onPress={this.onComplete} title="Done" />
          </View>
        </View>
      </View>)
  }
}

const styles = StyleSheet.create({
  result: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    marginBottom: 15
  },
  outcome: {
    flex: -1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  progress: {
    width: 200,
    height: 200,
    marginBottom: 30
  },
  intensity: {
    color: 'white',
    fontSize: 100,
    lineHeight: 180,
    width: 200,
    fontFamily: 'palanquin',
    position: 'absolute',
    textAlign: 'center'
  },
  solution: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'palanquin',
    textAlign: 'center'
  }
})

const mapStateToProps = (state) => ({
  type: state.Game.type,
  title: state.Game.title,
  answers: state.Game.answers
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(Result)
