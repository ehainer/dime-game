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
  }

  render() {
    return (
      <View style={GlobalStyles.page}>
        <View style={{ ...GlobalStyles.padded, flex: 1, alignItems: 'center' }}>
          <View style={{ ...GlobalStyles.flexSmall }}>
            <Text style={styles.heading}>For Mallory & Belle</Text>
          </View>
          <View style={GlobalStyles.padded}>
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
  heading: {
    color: 'white',
    fontSize: 30,
    fontFamily: 'palanquin',
    textAlign: 'center',
    marginBottom: 40,
    borderBottomWidth: 4,
    borderBottomColor: 'lightseagreen'
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
