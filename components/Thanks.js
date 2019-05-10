import React from 'react'
import { connect } from 'react-redux'

import {
  View,
  Text,
  StyleSheet
} from 'react-native'

import Actions from '../redux/actions'

import GlobalStyles from '../resources/styles'
import Layout from '../resources/layout'

class Thanks extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      layout: null
    }

    this.setLayout = this.setLayout.bind(this)
  }

  setLayout(event) {
    this.setState({ layout: event.nativeEvent.layout })
  }

  render() {
    return (
      <View style={{ flex: 1, overflow: 'hidden' }}>
        <View style={{ flex: 1, paddingHorizontal: 20, alignItems: 'center', justifyContent: 'center', width: Layout.width }}>
          <View style={{ flex: -1, paddingVertical: 30 }}>
            <View>
              <Text style={styles.heading} onLayout={this.setLayout}>For Mallory & Belle</Text>
              {this.state.layout && <View style={{ position: 'absolute', bottom: 0, left: -10, width: this.state.layout.width + 20, height: 4, backgroundColor: 'lightseagreen', borderRadius: 2 }}></View>}
            </View>
          </View>
          <View style={{ flex: 1, width: Layout.width > Layout.maxWidth ? Layout.defaultWidth : null }}>
            <Text style={styles.paragraph}>Thank you for your constant patience, wisdom, and willingness to guide, especially on days when I feel like doing nothing else but throwing in the towel.</Text>
            <Text style={styles.paragraph}>Everything you've done has changed, and continues to change my life, and since I'll never find exactly the right words to express how much that has meant to me, hopefully this app helps.</Text>
            <Text style={styles.thanks}>Thank You</Text>
            <Text style={styles.signature}>- Eric</Text>
          </View>
          <View style={{ flex: -1, paddingVertical: 20 }}>
            <Text style={{ marginTop: 30, color: 'lightseagreen', fontFamily: 'open-sans', fontSize: 15, textAlign: 'center' }} onPress={() => this.props.setIsInThanks(false)}>CLOSE</Text>
          </View>
        </View>
      </View>)
  }
}

const styles = StyleSheet.create({
  heading: {
    color: 'white',
    fontSize: 30,
    lineHeight: 35,
    fontFamily: 'palanquin',
    textAlign: 'center'
  },
  paragraph: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'open-sans',
    marginBottom: 20
  },
  thanks: {
    color: 'white',
    fontSize: 25,
    fontFamily: 'palanquin',
    textAlign: 'center'
  },
  signature: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'open-sans',
    textAlign: 'center'
  }
})

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = {
  setIsInThanks: Actions.setIsInThanks
}

export default connect(mapStateToProps, mapDispatchToProps)(Thanks)
