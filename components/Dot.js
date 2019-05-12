import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  PixelRatio
} from 'react-native'

class Dot extends React.Component {
  constructor(props) {
    super(props)

    this.opacity = new Animated.Value(this.props.active ? 1 : 0.6)
    this.scale = new Animated.Value(this.props.active ? 1 : 0.8)
    this.backgroundColor = this.props.enabled ? 'rgba(255, 255, 255, 0.92)' : 'rgba(255, 255, 255, 0)'
  }

  componentDidUpdate(prevProps) {
    this.backgroundColor = this.props.enabled ? 'rgba(255, 255, 255, 0.92)' : 'rgba(255, 255, 255, 0)'

    if(prevProps.active !== this.props.active){
      Animated.parallel([
        Animated.spring(this.scale, {
          friction: 4,
          tension: 50,
          toValue: this.props.active ? 1 : 0.8,
          duration: 200,
          easing: Easing.easeOutBack,
          useNativeDriver: true
        }),
        Animated.timing(this.opacity, {
          toValue: this.props.active ? 1 : 0.6,
          duration: 200,
          useNativeDriver: true
        })
      ]).start()
    }
  }

  render() {
    return (
      <TouchableOpacity style={{ flex: -1, alignItems: 'center', justifyContent: 'center' }} onPress={this.props.onPress} activeOpacity={1}>
        <View style={{ padding: PixelRatio.getPixelSizeForLayoutSize(5) }}>
          <Animated.View style={{
            borderWidth: 2,
            borderColor: 'rgba(255, 255, 255, 0.92)',
            backgroundColor: this.backgroundColor,
            width: 10,
            height: 10,
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: this.opacity,
            transform: [{ scale: this.scale }]
          }}>
          </Animated.View>
        </View>
      </TouchableOpacity>)
  }
}

Dot.propTypes = {
  onPress: PropTypes.func.isRequired,
  enabled: PropTypes.bool,
  active: PropTypes.bool
}

const styles = StyleSheet.create({
})

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(Dot)
