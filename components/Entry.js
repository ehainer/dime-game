import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight
} from 'react-native'

import Svg, { G, Path } from 'react-native-svg'

import { format } from 'date-fns'

import Questions from '../resources/questions.json'

import GlobalStyles from '../resources/styles'

class Entry extends React.Component {
  constructor(props) {
    super(props)

    this.getGameType = this.getGameType.bind(this)
    this.getDate = this.getDate.bind(this)
    this.onPress = this.onPress.bind(this)
  }

  getGameType() {
    return this.props.type === 'ASK' ? 'Asking' : 'Saying No'
  }

  getDate() {
    const parsed = Date.parse(this.props.date)
    return format(parsed, 'MMMM Do, YYYY')
  }

  getIntensity() {
    return this.props.answers.filter(a => a === (this.props.type === 'ASK' ? 'YES' : 'NO')).length
  }

  onPress() {
    this.props.onPress(this.props.type, this.props.title || 'Untitled', this.props.date, this.props.answers)
  }

  render() {
    return (
      <TouchableHighlight onPress={this.onPress} activeOpacity={1} underlayColor="rgba(0, 0, 0, 0.2)">
        <View style={styles.entry}>
          <View style={styles.text}>
            <Text style={styles.title}>{this.props.title || 'Untitled'}</Text>
            <View style={styles.subtext}>
              <Text style={styles.type}>{this.getGameType()}</Text>
              <Text style={GlobalStyles.dot}>&middot;</Text>
              <Text style={styles.date}>{this.getDate()}</Text>
            </View>
          </View>
          <View style={styles.intensity}>
            <Text style={styles.value}>{this.getIntensity()}</Text>
          </View>
          <View style={styles.arrow}>
            <Svg height={20} width={20} viewBox="0 0 451.847 451.847">
              <G>
                <Path fill="white" d="M345.441,248.292L151.154,442.573c-12.359,12.365-32.397,12.365-44.75,0c-12.354-12.354-12.354-32.391,0-44.744
                                      L278.318,225.92L106.409,54.017c-12.354-12.359-12.354-32.394,0-44.748c12.354-12.359,32.391-12.359,44.75,0l194.287,194.284
                                      c6.177,6.18,9.262,14.271,9.262,22.366C354.708,234.018,351.617,242.115,345.441,248.292z" />
              </G>
            </Svg>
          </View>
        </View>
      </TouchableHighlight>)
  }
}
const styles = StyleSheet.create({
  entry: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.1)'
  },
  text: {
    flex: 1
  },
  intensity: {
    flex: -1
  },
  arrow: {
    flex: -1,
    justifyContent: 'flex-end',
    marginLeft: 20
  },
  subtext: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    color: 'white',
    fontFamily: 'open-sans',
    fontSize: 16
  },
  type: {
    color: '#d3d3d3',
    fontFamily: 'open-sans',
    fontSize: 14
  },
  date: {
    color: '#d3d3d3',
    fontFamily: 'open-sans',
    fontSize: 14
  },
  intensity: {
    flex: -1,
    paddingLeft: 20
  },
  value: {
    color: 'white',
    fontSize: 32,
    fontFamily: 'palanquin',
    top: -6
  }
})

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = {
}

Entry.propTypes = {
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  answers: PropTypes.array.isRequired,
  onPress: PropTypes.func
}

export default connect(mapStateToProps, mapDispatchToProps)(Entry)
