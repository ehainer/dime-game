import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import {
  View,
  Text,
  TextInput,
  StyleSheet
} from 'react-native'

import GlobalStyles from '../resources/styles.js'

class MultilineInput extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      characters: 0,
      height: 30
    }

    this.onTextChange = this.onTextChange.bind(this)
    this.onContentChange = this.onContentChange.bind(this)
  }

  onTextChange(text) {
    this.setState({ characters: text.length })
    this.props.onChange(text)
  }

  onContentChange(event) {
    this.setState({
      height: event.nativeEvent.contentSize.height + 8
    })
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <TextInput style={{ ...styles.input, height: this.state.height }} value={this.props.value} placeholder={this.props.placeholder} maxLength={this.props.maxLength} multiline={true} onChangeText={this.onTextChange} onContentSizeChange={this.onContentChange} textAlignVertical="center"></TextInput>
        {this.props.maxLength > -1 && <Text style={styles.count}>{this.state.characters} / {this.props.maxLength}</Text>}
      </View>)
  }
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'flex-end'
  },
  input: {
    width: '100%',
    color: 'white',
    borderColor: 'white',
    borderBottomWidth: 1,
    fontSize: 18,
    fontFamily: 'open-sans'
  },
  count: {
    color: 'white',
    fontSize: 13
  }
})

MultilineInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  maxLength: PropTypes.number,
  placeholder: PropTypes.string
}

export default MultilineInput