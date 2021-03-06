import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  PixelRatio
} from 'react-native'

import Layout from '../resources/layout'

class MultilineInput extends React.Component {
  constructor(props) {
    super(props)

    this.state = { height: 30 }

    this.onTextChange = this.onTextChange.bind(this)
    this.onContentChange = this.onContentChange.bind(this)
  }

  onTextChange(text) {
    this.props.onChange(text)
  }

  onContentChange(event) {
    this.setState({
      height: event.nativeEvent.contentSize.height + 8
    })
  }

  render() {
    return (
      <View style={{ flex: -1, alignItems: 'stretch', minWidth: Layout.minWidth, maxWidth: Layout.maxWidth }}>
        <TextInput
          style={{ ...styles.input, height: this.state.height }}
          value={this.props.value}
          placeholder={this.props.placeholder}
          placeholderTextColor="#d3d3d3"
          maxLength={this.props.maxLength}
          multiline={true}
          onChangeText={this.onTextChange}
          onContentSizeChange={this.onContentChange}
          textAlignVertical="center"
          returnKeyType="next">
        </TextInput>
        {this.props.maxLength > -1 && <Text style={{ ...styles.count, alignSelf: 'flex-end' }}>{this.props.title.length} / {this.props.maxLength}</Text>}
      </View>)
  }
}

const styles = StyleSheet.create({
  input: {
    color: 'white',
    borderColor: 'white',
    borderBottomWidth: 1,
    fontSize: 18,
    fontFamily: 'open-sans',
    minWidth: Layout.minWidth,
    maxWidth: Layout.maxWidth
  },
  count: {
    color: 'white',
    fontSize: 13,
    fontFamily: 'open-sans'
  }
})

MultilineInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  maxLength: PropTypes.number,
  placeholder: PropTypes.string
}

const mapStateToProps = (state) => ({
  title: state.Game.title
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(MultilineInput)