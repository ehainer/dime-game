import React from 'react'
import PropTypes from 'prop-types'

import {
  View,
  Text,
  StyleSheet,
  AsyncStorage,
  Switch,
  Linking,
  Alert,
  TouchableHighlight,
  Animated,
  StatusBar,
  Dimensions,
  ScrollView,
  Easing
} from 'react-native'

import Credits from './Credits'

import Markdown from 'react-native-markdown-renderer'

import Actions from '../redux/actions'

import { connect } from 'react-redux'

import App from '../app.json'
import GlobalStyles from '../resources/styles'

const { width, height } = Dimensions.get('window')

class Menu extends React.Component {
  constructor(props) {
    super(props)

    this.timer = null
    this.clicks = 0

    this.state = {
      clicks: 0,
      showCredits: false
    }

    this.topSpace = (StatusBar.currentHeight || 0)
    this.moveCredits = new Animated.ValueXY({ x: width, y: 0 })
    this.moveMenu = new Animated.ValueXY({ x: 0, y: 0 })

    this.onToggleHistory = this.onToggleHistory.bind(this)
    this.onToggleCredits = this.onToggleCredits.bind(this)
    this.onClickCredits = this.onClickCredits.bind(this)
  }

  shouldComponentUpdate(nextProps) {
    return this.props.page === 0
  }

  componentDidUpdate(prevProps, prevState) {
    if(prevState.showCredits !== this.state.showCredits){
      this.onToggleCredits()
    }

    if(prevProps.isInMenu && !this.props.isInMenu){
      this.setState({ showCredits: false })
    }

    this.props.setIsInMenu(this.state.showCredits)
    this.props.setIsFullScreen(this.state.showCredits)
    this.props.setScrollEnabled(!this.state.showCredits)
  }

  async onToggleHistory() {
    if(this.props.enableHistory && this.props.history.length){
      Alert.alert(
        'Are You Sure?',
        'Disabling this will also delete your current dime game history.',
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
              this.props.setEnableHistory(false)
              await AsyncStorage.setItem('@minow.dbt.dime:preserve', 'false')
            }
          }
        ]
      )
    }else{
      let enabled = !this.props.enableHistory
      this.props.setEnableHistory(enabled)
      await AsyncStorage.setItem('@minow.dbt.dime:preserve', enabled.toString())
    }
  }

  onClickCredits() {
    this.setState({ showCredits: true })
  }
  
  onToggleCredits() {
    Animated.parallel([
      Animated.timing(this.moveMenu, {
        toValue: { x: this.state.showCredits ? -width : 0, y: 0 },
        duration: 250,
        easing: Easing.bezier(0.455, 0.030, 0.515, 0.955),
        useNativeDriver: true
      }),
      Animated.timing(this.moveCredits, {
        toValue: { x: this.state.showCredits ? 0 : width, y: 0 },
        duration: 250,
        easing: Easing.bezier(0.455, 0.030, 0.515, 0.955),
        useNativeDriver: true
      })
    ]).start()
  }

  render() {
    return (
      <View style={GlobalStyles.page}>
        <Animated.View style={{ ...GlobalStyles.page, marginTop: 0, paddingTop: 0, transform: this.moveMenu.getTranslateTransform() }}>
          <View style={{ ...GlobalStyles.header, ...GlobalStyles.padded }}>
            <Text style={GlobalStyles.h1}>Menu</Text>
          </View>
          <View style={styles.list}>
            <View style={{ ...styles.item, ...styles.clickable }}>
              <View style={styles.text}>
                <Text style={styles.title}>Enable History</Text>
                <Text style={styles.subtitle}>Save the results of each dime game</Text>
              </View>
              <View style={styles.action}>
                <Switch value={this.props.enableHistory} onValueChange={this.onToggleHistory}></Switch>
              </View>
            </View>
            <TouchableHighlight onPress={this.onClickCredits} style={{ ...styles.item, ...styles.clickable }} activeOpacity={1} underlayColor="rgba(0, 0, 0, 0.2)">
              <View style={styles.text}>
                <Text style={styles.title}>Legal Information</Text>
                <Text style={styles.subtitle}>Credits & Attribution</Text>
              </View>
            </TouchableHighlight>
            <View style={styles.item}>
              <View style={styles.text}>
                <Text style={styles.title}>About</Text>
                <Text style={styles.subtitle}>Version {App.expo.version}</Text>
              </View>
            </View>
          </View>
        </Animated.View>
        <Animated.View style={{ ...styles.panel, ...styles.credits, transform: this.moveCredits.getTranslateTransform() }}>
          <Credits />
        </Animated.View>
      </View>)
  }
}

Menu.propTypes = {
  enableHistory: PropTypes.bool.isRequired
}

const markdownStyles = StyleSheet.create({
  heading: {
    color: '#ffffff',
    fontFamily: 'palanquin'
  },
  heading1: {
    color: 'white',
    fontSize: 32
  },
  heading2: {
    color: 'white',
    fontSize: 24,
  },
  heading3: {
    color: 'white',
    fontSize: 18,
  },
  heading4: {
    color: 'white',
    fontSize: 16,
  },
  heading5: {
    color: 'white',
    fontSize: 13,
  },
  heading6: {
    color: 'white',
    fontSize: 11,
  },
  codeBlock: {
    fontFamily: 'open-sans'
  },
  inlineCode: {
    fontFamily: 'open-sans'
  },
  paragraph: {
    color: 'white',
    fontSize: 16
  }
})

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    width: width,
    height: height - (StatusBar.currentHeight || 0)
  },
  license: {
  },
  list: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)'
  },
  item: {
    flex: -1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  clickable: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.1)'
  },
  text: {
    flex: 1
  },
  action: {
    flex: -1,
    alignItems: 'center',
    paddingLeft: 10
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'open-sans'
  },
  subtitle: {
    color: '#d3d3d3',
    fontSize: 13,
    fontFamily: 'open-sans'
  },
  licenseTitle: {
    color: 'white',
    fontSize: 18
  },
  licenseVersion: {
    color: 'white',
    fontSize: 14
  },
  copy: {
    color: 'white',
    fontSize: 16
  }
})

const mapStateToProps = (state) => ({
  page: state.States.page,
  history: state.History.history,
  isInMenu: state.States.isInMenu,
  enableHistory: state.Settings.enableHistory
})

const mapDispatchToProps = {
  setEnableHistory: Actions.setEnableHistory,
  setHistory: Actions.setHistory,
  setIsInMenu: Actions.setIsInMenu,
  setIsFullScreen: Actions.setIsFullScreen,
  setScrollEnabled: Actions.setScrollEnabled
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu)