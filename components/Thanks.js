import React from 'react'
import { connect } from 'react-redux'

import {
  View,
  Text,
  StyleSheet
} from 'react-native'

import Actions from '../redux/actions'

import GlobalStyles from '../resources/styles'

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
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingHorizontal: 20, alignItems: 'center' }}>
          <View style={styles.headingWrapper}>
            <Text style={styles.heading} onLayout={this.setLayout}>For Mallory & Belle</Text>
            {this.state.layout && <View style={{ position: 'absolute', bottom: 0, left: -10, width: this.state.layout.width + 20, height: 4, backgroundColor: 'lightseagreen', borderRadius: 2 }}></View>}
          </View>
          <View style={{ flex: 1, marginTop: 40 }}>
            <Text style={styles.paragraph}>Thank you for your constant patience, wisdom, and willingness to guide, especially on days when I feel like doing nothing else but throwing in the towel.</Text>
            <Text style={styles.paragraph}>Everything you've done has changed, and continues to change my life, and since I'll never find exactly the right words to express how much that has meant to me, hopefully this app helps.</Text>
            <Text style={styles.thanks}>Thank You</Text>
            <Text style={styles.signature}>- Eric</Text>
          </View>
        </View>
      </View>)
  }
}

const styles = StyleSheet.create({
  headingWrapper: {
    paddingTop: 60
  },
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
}

export default connect(mapStateToProps, mapDispatchToProps)(Thanks)
