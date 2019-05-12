import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  StatusBar,
  Easing,
  BackHandler,
  Alert,
  AsyncStorage,
  TouchableOpacity
} from 'react-native'

import Svg, { G, Path } from 'react-native-svg'

import { format } from 'date-fns'

import Button from './Button'
import Entry from './Entry'

import GlobalStyles from '../resources/styles'
import Layout from '../resources/layout'
import Questions from '../resources/questions.json'
import Answers from '../resources/answers.json'

import Actions from '../redux/actions'

class History extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      type: null,
      title: '',
      solution: '',
      answers: [],
      date: '',
      open: false,
      headerLayout: null,
      middleLayout: null,
      footerLayout: null
    }

    this.topSpace = (StatusBar.currentHeight || 0) + 5
    this.moveEntry = new Animated.ValueXY({ x: Layout.width, y: 0 })
    this.moveHistory = new Animated.ValueXY({ x: 0, y: 0 })
    this.moveClear = new Animated.ValueXY({ x: 0, y: 0 })

    this.opacityEntry = new Animated.Value(0)

    this.getHistory = this.getHistory.bind(this)
    this.showEntry = this.showEntry.bind(this)
    this.hideEntry = this.hideEntry.bind(this)
    this.toggleClear = this.toggleClear.bind(this)
    this.getAnswer = this.getAnswer.bind(this)
    this.getSolution = this.getSolution.bind(this)
    this.onClearHistory = this.onClearHistory.bind(this)
    this.onClickMenu = this.onClickMenu.bind(this)
    this.onClickStart = this.onClickStart.bind(this)
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
      if(this.state.open){
        this.hideEntry()
        return true
      }
    })
  }

  componentDidUpdate() {
    this.toggleClear()
  }

  getHistory() {
    return JSON.parse(JSON.stringify(this.props.history)).reverse().map((h) => {
      return (<Entry key={h.date} { ...h } onPress={this.showEntry} />)
    })
  }

  getQuestions() {
    return Questions[this.state.type] ? Questions[this.state.type] : []
  }

  getAnswer(index) {
    return this.state.answers[index] === 'YES' ? 'Yes' : 'No'
  }

  getSolution() {
    return Answers[this.state.type] ? Answers[this.state.type][this.getIntensity()] : ''
  }

  getIntensity() {
    return this.state.answers.filter(a => a === (this.state.type === 'ASK' ? 'YES' : 'NO')).length
  }

  getDate() {
    const parsed = Date.parse(this.state.date)
    return format(parsed, 'MMMM Do, YYYY')
  }

  getGameType() {
    return this.state.type === 'ASK' ? 'Asking' : 'Saying No'
  }

  toggleClear() {
    Animated.timing(this.moveClear, {
      toValue: { x: 0, y: this.props.history.length ? 0 : 200 },
      duration: 250,
      easing: Easing.bezier(0.455, 0.030, 0.515, 0.955),
      useNativeDriver: true
    }).start()
  }

  showEntry(type, title, date, answers) {
    this.props.setIsInHistory(true)
    this.props.setIsFullScreen(true)
    this.props.setScrollEnabled(false)

    this.setState({
      open: true,
      type: type,
      title: title,
      date: date,
      answers: answers
    }, () => {
      Animated.parallel([
        Animated.timing(this.moveHistory, {
          toValue: { x: -Layout.width, y: 0 },
          duration: 250,
          easing: Easing.bezier(0.455, 0.030, 0.515, 0.955),
          useNativeDriver: true
        }),
        Animated.timing(this.moveEntry, {
          toValue: { x: 0, y: 0 },
          duration: 250,
          easing: Easing.bezier(0.455, 0.030, 0.515, 0.955),
          useNativeDriver: true
        }),
        Animated.timing(this.opacityEntry, {
          toValue: 1,
          duration: 250,
          easing: Easing.bezier(0.455, 0.030, 0.515, 0.955),
          useNativeDriver: true
        })
      ]).start()
    })
  }

  hideEntry() {
    this.props.setIsInHistory(false)
    this.props.setIsFullScreen(false)
    this.props.setScrollEnabled(true)

    Animated.parallel([
      Animated.timing(this.moveHistory, {
        toValue: { x: 0, y: 0 },
        duration: 250,
        easing: Easing.bezier(0.455, 0.030, 0.515, 0.955),
        useNativeDriver: true
      }),
      Animated.timing(this.moveEntry, {
        toValue: { x: Layout.width, y: 0 },
        duration: 250,
        easing: Easing.bezier(0.455, 0.030, 0.515, 0.955),
        useNativeDriver: true
      }),
      Animated.timing(this.opacityEntry, {
        toValue: 0,
        duration: 250,
        easing: Easing.bezier(0.455, 0.030, 0.515, 0.955),
        useNativeDriver: true
      })
    ]).start(() => {
      this.setState({
        open: false
      })
    })
  }

  onClearHistory() {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to clear your dime game history?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            await AsyncStorage.removeItem('@minow.dbt.dime:history')
            this.props.setHistory([])
          }
        }
      ]
    )
  }

  onClickMenu() {
    this.props.onChangePage(0)
  }

  onClickStart() {
    this.props.onChangePage(1)
  }

  render() {
    return (
      <View style={{ flex: 1 }} removeClippedSubviews={true}>
        <Animated.View style={{ flex: 1, paddingBottom: this.props.layout ? this.props.layout.height : 0, overflow: 'hidden', transform: this.moveHistory.getTranslateTransform() }}>
          <View style={GlobalStyles.header}>
            <Text style={GlobalStyles.h1}>History</Text>
          </View>
          <ScrollView style={styles.list}>
            {this.props.enableHistory && this.props.history.length === 0 && <View style={{ ...GlobalStyles.center, padding: 20 }}>
              <Text style={styles.empty}>No history yet.</Text>
              <Text style={{ ...styles.empty, ...styles.link }} onPress={this.onClickStart}>Start New Game</Text>
            </View>}
            {!this.props.enableHistory && <View style={{ ...GlobalStyles.center, padding: 20 }}>
              <Text style={styles.empty}>History is currently disabled.</Text>
              <Text style={styles.empty}>You can enable it in the <Text style={styles.link} onPress={this.onClickMenu}>Menu</Text>.</Text>
            </View>}
            {this.getHistory()}
          </ScrollView>
          <Animated.View style={{ ...styles.footer, alignItems: 'stretch', transform: this.moveClear.getTranslateTransform() }}>
            <Button customContainerStyle={{ width: Layout.width > Layout.maxWidth ? Layout.defaultWidth : null }} backgroundColor="lightseagreen" onPress={this.onClearHistory} title="Clear History" />
          </Animated.View>
        </Animated.View>
        <Animated.View style={{ flex: 1, position: 'absolute', top: 0, bottom: 0, overflow: 'hidden', opacity: this.opacityEntry, width: Layout.width, transform: this.moveEntry.getTranslateTransform() }} onLayout={(e) => this.setState({ middleLayout: e.nativeEvent.layout })}>
          <View style={{ ...GlobalStyles.header, borderBottomWidth: 1, borderBottomColor: 'rgba(0, 0, 0, 0.1)' }} onLayout={(e) => this.setState({ headerLayout: e.nativeEvent.layout })}>
            <TouchableOpacity style={{ position: 'absolute', left: 10, top: 10, padding: 10, zIndex: 999 }} onPress={this.hideEntry} activeOpacity={1}>
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
            <Text style={GlobalStyles.h1}>     {this.state.title}</Text>
            <View style={{ ...GlobalStyles.row, top: -8, alignItems: 'center' }}>
              <Text style={GlobalStyles.caption}>{this.getGameType()}</Text>
              <Text style={{ ...GlobalStyles.dot, ...GlobalStyles.caption, lineHeight: 16 }}>&middot;</Text>
              <Text style={GlobalStyles.caption}>{this.getDate()}</Text>
            </View>
          </View>
          {this.state.headerLayout && this.state.middleLayout && this.state.footerLayout && <View style={{ height: this.state.middleLayout.height - this.state.headerLayout.height - this.state.footerLayout.height }}>
            <ScrollView contentContainerStyle={{
              paddingHorizontal: 20
            }}>
              {this.getQuestions().map((q, index) => {
                return (<View key={q.category} style={styles.answer}>
                  <Text style={styles.categoryText}>{q.category}</Text>
                  <Text style={styles.questionText}>{q.question}</Text>
                  <Text style={styles.answerText}>{this.getAnswer(index)}</Text>
                </View>)
              })}
            </ScrollView>
          </View>}
          <View style={{ ...styles.resultWrapper, position: 'absolute', bottom: 0, width: Layout.width }} onLayout={(e) => this.setState({ footerLayout: e.nativeEvent.layout })}>
            <View style={styles.labelWrapper}>
              <Text style={styles.label}>Solution</Text>
              <Text style={styles.label}>Intensity</Text>
            </View>
            <View style={styles.valueWrapper}>
              <Text style={styles.solution}>{this.getSolution()}</Text>
              <Text style={styles.intensity}>{this.getIntensity()}</Text>
            </View>
          </View>
        </Animated.View>
      </View>)
  }
}

const styles = StyleSheet.create({
  empty: {
    flex: -1,
    color: 'white',
    fontSize: 18,
    lineHeight: 30,
    fontFamily: 'open-sans'
  },
  link: {
    flex: -1,
    color: 'lightseagreen'
  },
  list: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)'
  },
  footer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)'
  },
  answer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)'
  },
  categoryText: {
    color: 'white',
    fontSize: 18,
    lineHeight: 20,
    paddingTop: 15,
    paddingBottom: 1,
    fontFamily: 'palanquin'
  },
  questionText: {
    color: 'white',
    fontSize: 18,
    lineHeight: 22,
    fontFamily: 'open-sans'
  },
  answerText: {
    color: 'lightseagreen',
    fontSize: 18,
    top: -4,
    fontFamily: 'palanquin'
  },
  label: {
    color: 'white',
    fontSize: 16,
    lineHeight: 20,
    fontFamily: 'palanquin'
  },
  resultWrapper: {
    padding: 20,
    backgroundColor: 'lightseagreen'
  },
  labelWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  },
  valueWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  solution: {
    flex: 1,
    color: 'white',
    fontSize: 18,
    lineHeight: 25,
    marginRight: 20,
    fontFamily: 'open-sans'
  },
  intensity: {
    flex: -1,
    color: 'white',
    fontSize: 30,
    marginTop: -5,
    width: 45,
    fontFamily: 'palanquin'
  }
})

History.propTypes = {
  onChangePage: PropTypes.func
}

const mapStateToProps = (state) => ({
  layout: state.Settings.layout,
  history: state.History.history,
  enableHistory: state.Settings.enableHistory
})

const mapDispatchToProps = {
  setHistory: Actions.setHistory,
  setIsInHistory: Actions.setIsInHistory,
  setIsFullScreen: Actions.setIsFullScreen,
  setScrollEnabled: Actions.setScrollEnabled,
  resetGame: Actions.resetGame,
  setIsInGame: Actions.setIsInGame
}

export default connect(mapStateToProps, mapDispatchToProps)(History)
