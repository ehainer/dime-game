import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import {
  Text,
  View,
  StyleSheet
} from 'react-native'

import Button from './Button'

import GlobalStyles from '../resources/styles'
import Layout from '../resources/layout'

class Question extends React.Component {
  constructor(props) {
    super(props)

    this.state = { layout: null }

    this.onAnswerNo = this.onAnswerNo.bind(this)
    this.onAnswerYes = this.onAnswerYes.bind(this)
    this.setLayout = this.setLayout.bind(this)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.layout !== this.state.layout
    || nextProps.type !== this.props.type
    || nextProps.step !== this.props.step
    || nextProps.answer !== this.props.answer
    || nextProps.currentIndex === -1
  }

  onAnswerYes() {
    this.props.onAnswer(this.props.index, 'YES')
  }

  onAnswerNo() {
    this.props.onAnswer(this.props.index, 'NO')
  }

  setLayout(event) {
    this.setState({ layout: event.nativeEvent.layout })
  }

  render() {
    return (
      <View style={{ ...styles.wrapper, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={styles.box}>
          <View style={{ ...styles.categoryWrapper }}>
            <Text style={{ ...styles.category }} onLayout={this.setLayout}>{this.props.category}</Text>
            {this.state.layout && <View style={{ width: this.state.layout.width + 20, height: 4, backgroundColor: 'lightseagreen', borderRadius: 2 }}></View>}
          </View>
          <View style={{ ...styles.spacer }}></View>
          <View style={{ ...styles.content }}>
            <Text style={styles.question}>{this.props.question}</Text>
          </View>
          <View style={{ ...styles.spacer }}></View>
          <View style={{ ...GlobalStyles.row }}>
            <View style={{ flex: 1 }}>
              <Button checkable={true} checked={this.props.answer === 'YES'} backgroundColor="lightseagreen" onPress={this.onAnswerYes} title="YES" />
            </View>
            <View style={GlobalStyles.spacer}></View>
            <View style={{ flex: 1 }}>
              <Button checkable={true} checked={this.props.answer === 'NO'} backgroundColor="lightseagreen" onPress={this.onAnswerNo} title="NO" />
            </View>
          </View>
        </View>
      </View>)
  }
}

const styles = StyleSheet.create({
  wrapper: {
    minWidth: Math.min(Layout.width, Layout.maxWidth),
    maxWidth: Layout.maxWidth,
    paddingHorizontal: 10
  },
  box: {
    flex: -1
  },
  categoryWrapper: {
    alignItems: 'center'
  },
  category: {
    fontSize: 30,
    lineHeight: 40,
    color: 'white',
    textAlign: 'center',
    fontFamily: 'palanquin'
  },
  content: {
    flex: -1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  question: {
    fontSize: 20,
    color: 'white',
    textAlign: 'left',
    fontFamily: 'open-sans',
    paddingHorizontal: 10
  },
  answer: {
    flex: -1,
    marginTop: 20,
    textAlign: 'center',
    color: 'white',
    fontFamily: 'palanquin',
    fontSize: 20,
    padding: 10
  },
  buttons: {
    marginTop: 40
  },
  spacer: {
    height: 30
  }
})

const mapStateToProps = (state) => ({
  answers: state.Game.answers,
  currentIndex: state.Game.index,
  type: state.Game.type,
  step: state.Game.step
})

const mapDispatchToProps = {
}

Question.propTypes = {
  answer: PropTypes.string,
  index: PropTypes.number.isRequired,
  category: PropTypes.string.isRequired,
  question: PropTypes.string.isRequired,
  onAnswer: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Question)
