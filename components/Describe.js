import React from 'react'
import { connect } from 'react-redux'

import {
  View,
  Text,
  StyleSheet,
  Keyboard,
  TouchableOpacity
} from 'react-native'

import Svg, { G, Path } from 'react-native-svg'

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
    this.onBack = this.onBack.bind(this)
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.title !== this.props.title
     || nextProps.step !== this.props.step
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
    this.props.onNext()
  }

  onBack() {
    this.props.resetGame().then(() => {
      this.props.setIsInGame(false)
    })
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <View style={GlobalStyles.header}>
            <TouchableOpacity style={{ position: 'absolute', left: 10, top: 10, padding: 10, zIndex: 999 }} onPress={this.onBack} activeOpacity={1}>
              <Svg style={{ padding: 10 }} width={23} height={30} viewBox="0 0 492 492">
                <G>
                  <G>
                    <Path fill="white" d="M464.344,207.418l0.768,0.168H135.888l103.496-103.724c5.068-5.064,7.848-11.924,7.848-19.124
                      c0-7.2-2.78-14.012-7.848-19.088L223.28,49.538c-5.064-5.064-11.812-7.864-19.008-7.864c-7.2,0-13.952,2.78-19.016,7.844
                      L7.844,226.914C2.76,231.998-0.02,238.77,0,245.974c-0.02,7.244,2.76,14.02,7.844,19.096l177.412,177.412
                      c5.064,5.06,11.812,7.844,19.016,7.844c7.196,0,13.944-2.788,19.008-7.844l16.104-16.112c5.068-5.056,7.848-11.808,7.848-19.008
                      c0-7.196-2.78-13.592-7.848-18.652L134.72,284.406h329.992c14.828,0,27.288-12.78,27.288-27.6v-22.788
                      C492,219.198,479.172,207.418,464.344,207.418z"/>
                  </G>
                </G>
              </Svg>
            </TouchableOpacity>
            <Text style={GlobalStyles.h1}>     Describe Situation</Text>
            <Text style={GlobalStyles.caption}>In a few words, briefly describe what it is you're trying to decide how strongly to ask or say no to.</Text>
          </View>
          <View style={{ marginVertical: 30, paddingHorizontal: 20, alignItems: 'stretch' }}>
            <MultilineInput ref={(i) => { this._input = i }} value={this.props.title} placeholder={this.state.placeholder} maxLength={100} onChange={this.props.setGameTitle}></MultilineInput>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Button style={{ flex: -1 }} backgroundColor="lightseagreen" onPress={this.onClickNext} title={this.getButtonTitle()} />
          </View>
        </View>
      </View>)
  }
}

const styles = StyleSheet.create({
})

const mapStateToProps = (state) => ({
  title: state.Game.title,
  step: state.Game.step
})

const mapDispatchToProps = {
  resetGame: Actions.resetGame,
  setIsInGame: Actions.setIsInGame,
  setGameTitle: Actions.setGameTitle,
  setGameStep: Actions.setGameStep,
  setGameDescribed: Actions.setGameDescribed
}

export default connect(mapStateToProps, mapDispatchToProps)(Describe)
