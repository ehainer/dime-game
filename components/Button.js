import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Dimensions,
  Animated,
  Easing
} from 'react-native'

import Svg, { Path } from 'react-native-svg'

import GlobalStyles from '../resources/styles'

class Button extends React.Component {
  constructor(props) {
    super(props)

    this.moveButton = new Animated.ValueXY({ x: 0, y: 0 })
  }

  componentWillUpdate(nextProps) {
    if(this.props.checkable){
      Animated.timing(this.moveButton, {
        toValue: { x: 0, y: nextProps.checked ? -50 : 0 },
        duration: 250,
        easing: Easing.bezier(0.455, 0.030, 0.515, 0.955),
        useNativeDriver: true
      }).start()
    }
  }

  render() {
    return (
      <View style={{ borderRadius: this.props.icon ? 0 : 25, ...(this.props.customContainerStyle || {}) }}>
        {!this.props.icon && <TouchableHighlight hitSlop={{top: 5, bottom: 5, left: 3, right: 3}} style={{ ...styles.wrapper, backgroundColor: this.props.backgroundColor }} onPress={this.props.onPress} activeOpacity={0.8} underlayColor="lightseagreen">
          <View style={{ overflow: 'hidden', height: 50 }}>
            {this.props.checkable && <Animated.View style={{ transform: this.moveButton.getTranslateTransform() }}>
              <Text style={styles.label}>{this.props.title.toUpperCase()}</Text>
              <View style={{ ...GlobalStyles.center, height: 50 }}>
                <Svg width={26} height={26} viewBox="0 0 26 26">
                  <Path fill="white" d="m.3,14c-0.2-0.2-0.3-0.5-0.3-0.7s0.1-0.5 0.3-0.7l1.4-1.4c0.4-0.4 1-0.4 1.4,0l.1,.1 5.5,5.9c0.2,0.2 0.5,0.2 0.7,0l13.4-13.9h0.1v-8.88178e-16c0.4-0.4 1-0.4 1.4,0l1.4,1.4c0.4,0.4 0.4,1 0,1.4l0,0-16,16.6c-0.2,0.2-0.4,0.3-0.7,0.3-0.3,0-0.5-0.1-0.7-0.3l-7.8-8.4-.2-.3z"/>
                </Svg>
              </View>
            </Animated.View>}
            {!this.props.checkable && <View>
              <Text style={styles.label}>{this.props.title.toUpperCase()}</Text>
            </View>}
          </View>
        </TouchableHighlight>}
        {this.props.icon && <View style={this.props.style}>
          <TouchableHighlight hitSlop={{top: 5, bottom: 5, left: 3, right: 3}} onPress={this.props.onPress} activeOpacity={1} underlayColor="rgba(0, 0, 0, 0)">
            <View style={{ ...styles.icon, ...this.props.style, borderColor: this.props.backgroundColor }}>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                {this.props.icon}
              </View>
              <Text style={{ ...styles.label, ...styles.iconLabel, color: this.props.backgroundColor }}>{this.props.title.toUpperCase()}</Text>
            </View>
          </TouchableHighlight>
        </View>}
      </View>)
  }
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 30,
    height: 50,
    borderRadius: 25
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: 'white',
    width: '100%',
    height: '100%'
  },
  label: {
    color: 'white',
    fontSize: 16,
    lineHeight: 50,
    fontFamily: 'palanquin',
    textAlign: 'center'
  },
  check: {
    height: 50
  },
  iconLabel: {
    fontSize: 18
  }
})

Button.propTypes = {
  icon: PropTypes.object,
  checkable: PropTypes.bool,
  checked: PropTypes.bool,
  backgroundColor: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired
}

export default connect()(Button)