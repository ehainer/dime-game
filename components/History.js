import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
  StatusBar,
  Easing,
  BackHandler,
  Alert,
  AsyncStorage
} from 'react-native'

import { format } from 'date-fns'

import Button from './Button'
import Entry from './Entry'

import GlobalStyles from '../resources/styles'
import Questions from '../resources/questions.json'
import Answers from '../resources/answers.json'

import Actions from '../redux/actions'

const { width, height } = Dimensions.get('window')

class History extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      type: null,
      title: '',
      solution: '',
      answers: [],
      date: '',
      open: false
    }

    this.topSpace = (StatusBar.currentHeight || 0) + 5
    this.moveEntry = new Animated.ValueXY({ x: width, y: 0 })
    this.moveHistory = new Animated.ValueXY({ x: 0, y: 0 })
    this.opacityEntry = new Animated.Value(0)

    this.moveClear = new Animated.ValueXY({ x: 0, y: 0 })

    this.getHistory = this.getHistory.bind(this)
    this.showEntry = this.showEntry.bind(this)
    this.hideEntry = this.hideEntry.bind(this)
    this.showClear = this.showClear.bind(this)
    this.hideClear = this.hideClear.bind(this)
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

    if(this.props.history.length){
      this.showClear()
    }else{
      this.hideClear()
    }
  }

  componentWillUpdate(nextProps) {
    if(nextProps.history.length === 0){
      this.hideClear()
    }else{
      this.showClear()
    }
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

  showClear() {
    Animated.timing(this.moveClear, {
      toValue: { x: 0, y: 0 },
      duration: 250,
      easing: Easing.bezier(0.455, 0.030, 0.515, 0.955),
      useNativeDriver: true
    }).start()
  }

  hideClear() {
    Animated.timing(this.moveClear, {
      toValue: { x: 0, y: 200 },
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
          toValue: { x: -width, y: 0 },
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
        toValue: { x: width, y: 0 },
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
    this.props.resetGame().then(() => {
      this.props.setIsInGame(true)
    })
  }

  render() {
    return (
      <View style={GlobalStyles.page}>
        <Animated.View style={{ ...GlobalStyles.page, marginTop: 0, paddingTop: 0, transform: this.moveHistory.getTranslateTransform() }}>
          <View style={{ ...GlobalStyles.header, ...GlobalStyles.padded }}>
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
          <Animated.View style={{ ...styles.footer, transform: this.moveClear.getTranslateTransform() }}>
            <Button backgroundColor="lightseagreen" onPress={this.onClearHistory} title="Clear History" />
          </Animated.View>
        </Animated.View>
        <Animated.View style={{ ...styles.entry, opacity: this.opacityEntry, transform: this.moveEntry.getTranslateTransform() }}>
          <View style={{ padding: 20 }}>
            <View>
              <Text style={GlobalStyles.h1}>{this.state.title}</Text>
              <View style={{ ...GlobalStyles.row, alignItems: 'center' }}>
                <Text style={GlobalStyles.caption}>{this.getGameType()}</Text>
                <Text style={{ ...GlobalStyles.dot, ...GlobalStyles.caption, lineHeight: 16 }}>&middot;</Text>
                <Text style={GlobalStyles.caption}>{this.getDate()}</Text>
              </View>
            </View>
          </View>
          <ScrollView style={styles.questions}>
            {this.getQuestions().map((q, index) => {
              return (<View key={q.category} style={styles.answer}>
                <Text style={styles.categoryText}>{q.category}</Text>
                <Text style={styles.questionText}>{q.question}</Text>
                <Text style={styles.answerText}>{this.getAnswer(index)}</Text>
              </View>)
            })}
          </ScrollView>
          <View style={styles.resultWrapper}>
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
  entry: {
    position: 'absolute',
    width: width,
    height: height - (StatusBar.currentHeight || 0),
    zIndex: 99
  },
  history: {
    paddingBottom: 30,
    paddingHorizontal: 20
  },
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
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)'
  },
  questions: {
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
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
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
