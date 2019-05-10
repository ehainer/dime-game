import React from 'react'
import { connect } from 'react-redux'

import {
  View,
  Text,
  StyleSheet,
  Keyboard
} from 'react-native'

import MultilineInput from './MultilineInput'
import Button from './Button'

import Actions from '../redux/actions'

import GlobalStyles from '../resources/styles'

class Describe extends React.Component {
  constructor(props) {
    super(props)

    this.state = { placeholder: this.getPlaceholder() }

    this.getButtonTitle = this.getButtonTitle.bind(this)
    this.onClickNext = this.onClickNext.bind(this)
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.title !== this.props.title
  }

  getPlaceholder() {
    const options = [
      'Friend asked me to move...',
      'Roommate stopped putting dishes...',
      'Asking for a ride to the airport...',
      'Boss is asking last minute for...'
    ]

    return options[Math.floor(Math.random() * options.length)]
  }

  getButtonTitle() {
    return this.props.title.trim() === '' ? 'SKIP' : 'NEXT'
  }

  onClickNext() {
    Keyboard.dismiss()
    this.props.setGameDescribed(true)
    this.props.setGameStep(1)
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          <View style={GlobalStyles.header}>
            <Text style={GlobalStyles.h1}>Describe Situation</Text>
            <Text style={GlobalStyles.caption}>In a few words, briefly describe what it is you're trying to decide how strongly to ask or say no to.</Text>
          </View>
          <View style={styles.description}>
            <MultilineInput ref={(i) => { this._input = i }} style={styles.input} value={this.props.title} placeholder={this.state.placeholder} maxLength={100} onChange={this.props.setGameTitle}></MultilineInput>
          </View>
          <View style={{ ...GlobalStyles.center, ...styles.next }}>
            <Button style={GlobalStyles.flexSmall} backgroundColor="lightseagreen" onPress={this.onClickNext} title={this.getButtonTitle()} />
          </View>
        </View>
      </View>)
  }
}

const styles = StyleSheet.create({
  description: {
    marginVertical: 30
  },
  input: {
    marginBottom: 10
  },
  next: {
    marginTop: 10
  }
})

const mapStateToProps = (state) => ({
  title: state.Game.title
})

const mapDispatchToProps = {
  setGameTitle: Actions.setGameTitle,
  setGameStep: Actions.setGameStep,
  setGameDescribed: Actions.setGameDescribed
}

export default connect(mapStateToProps, mapDispatchToProps)(Describe)
