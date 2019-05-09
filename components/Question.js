import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import {
  Text,
  View,
  StyleSheet
} from 'react-native'

import Button from './Button'

import Actions from '../redux/actions'

import GlobalStyles from '../resources/styles.js'

class Question extends React.Component {
  constructor(props) {
    super(props)

    this.onAnswerNo = this.onAnswerNo.bind(this)
    this.onAnswerYes = this.onAnswerYes.bind(this)
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.answers[this.props.index] !== this.props.answers[this.props.index]
  }

  onAnswerYes() {
    this.props.onAnswer(this.props.index, 'YES')
  }

  onAnswerNo() {
    this.props.onAnswer(this.props.index, 'NO')
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <View style={styles.box}>
          <Text style={{ ...styles.category }}>{this.props.category}</Text>
          <View style={styles.content}>
            <Text style={styles.question}>{this.props.question}</Text>
          </View>
          <View style={{ ...GlobalStyles.row, ...styles.buttons }}>
            <View style={GlobalStyles.flex}>
              <Button checkable={true} checked={this.props.answer === 'YES'} backgroundColor="lightseagreen" onPress={this.onAnswerYes} title="YES" />
            </View>
            <View style={GlobalStyles.spacer}></View>
            <View style={GlobalStyles.flex}>
              <Button checkable={true} checked={this.props.answer === 'NO'} backgroundColor="lightseagreen" onPress={this.onAnswerNo} title="NO" />
            </View>
          </View>
        </View>
      </View>)
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10
  },
  box: {
    flex: -1
  },
  category: {
    fontSize: 30,
    color: 'white',
    textAlign: 'center',
    marginBottom: 40,
    marginHorizontal: 50,
    padding: 10,
    fontFamily: 'palanquin',
    borderBottomWidth: 3,
    borderBottomColor: 'lightseagreen'
  },
  content: {
    flex: -1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80
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
  }
})

const mapStateToProps = (state) => ({
  answers: state.Game.answers
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
