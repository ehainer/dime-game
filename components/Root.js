import React from 'react'

import { LinearGradient, Font, SplashScreen } from 'expo'

import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
  BackHandler,
  AsyncStorage,
  Easing,
  SafeAreaView
} from 'react-native'

import Carousel, { Pagination } from 'react-native-snap-carousel'

import { connect } from 'react-redux'

import Menu from '../components/Menu'
import About from '../components/About'
import Wizard from '../components/Wizard'
import History from '../components/History'

import Actions from '../redux/actions'

const { width, height } = Dimensions.get('window')

import GlobalStyles from '../resources/styles'

class Root extends React.Component {
  constructor(props) {
    super(props)

    SplashScreen.preventAutoHide()
    
    this.topSpace = StatusBar.currentHeight
    this.opacityContainer = new Animated.Value(0)
    this.moveHome = new Animated.ValueXY({ x: 0, y: 0 })
    this.moveWizard = new Animated.ValueXY({ x: width, y: 0 })
    this.movePagination = new Animated.ValueXY({ x: 0, y: -30 })

    this.getPage = this.getPage.bind(this)
    this.onChangePage = this.onChangePage.bind(this)
  }

  async componentDidMount() {
    let preserve = await AsyncStorage.getItem('@minow.dbt.dime:preserve')
    this.props.setEnableHistory(!(preserve === 'false'))

    let history = await AsyncStorage.getItem('@minow.dbt.dime:history')
    this.props.setHistory(JSON.parse(history || '[]'))

    await Font.loadAsync({
      'open-sans': require('../assets/fonts/OpenSans-Regular.ttf'),
      'palanquin': require('../assets/fonts/palanquindark-bold.ttf')
    })

    BackHandler.addEventListener('hardwareBackPress', () => {
      if(this.props.step >= 0 && this.props.isInGame && !this.props.isInHistory){
        if(this.props.step === 0){
          this.props.setIsInGame(false)
          this.props.setGameStarted(false)
          this.props.setGameDescribed(false)
        }
        this.props.setGameStep(Math.max(this.props.step - 1, 0))
        return true
      }else if(this.props.page !== 1 && !this.props.isInGame && !this.props.isInHistory && !this.props.isInMenu && this._pages){
        requestAnimationFrame(() => {
          this._pages.snapToItem(1)
        })
        return true
      }else if(this.props.isInThanks){
        this.props.setIsInThanks(false)
        return true
      }else if(this.props.isInMenu){
        this.props.setIsInMenu(false)
        return true
      }
    })

    this.props.setIsLoaded(true)
    SplashScreen.hide()

    Animated.timing(this.opacityContainer, {
      toValue: 1,
      duration: 300,
      easing: Easing.bezier(0.455, 0.030, 0.515, 0.955),
      useNativeDriver: true
    }).start()
  }

  componentDidUpdate(prevProps) {
    if(prevProps.isInGame !== this.props.isInGame){
      Animated.parallel([
        Animated.timing(this.moveWizard, {
          toValue: { x: this.props.isInGame ? 0 : width, y: 0 },
          duration: 200,
          useNativeDriver: true
        }),
        Animated.timing(this.moveHome, {
          toValue: { x: this.props.isInGame ? -width : 0, y: 0 },
          duration: 200,
          useNativeDriver: true
        })
      ]).start()
    }
  
    if(prevProps.isFullScreen !== this.props.isFullScreen){
      Animated.timing(this.movePagination, {
        toValue: { x: 0, y: this.props.isFullScreen ? 50 : -30 },
        duration: 200,
        useNativeDriver: true
      }).start()
    }
  }

  getPages() {
    return [
      { key: 'menu' },
      { key: 'about' },
      { key: 'history' }
    ]
  }

  getPage({ index }) {
    return [(<Menu />), (<About />), (<History onChangePage={this.onChangePage} />)][index]
  }

  onChangePage(page) {
    if(this._pages){
      requestAnimationFrame(() => {
        this._pages.snapToItem(page)
      })
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#234051', '#323a45']} style={GlobalStyles.background} />
        {this.props.isLoaded && 
        <SafeAreaView>
          <Animated.View style={{ flex: 1, opacity: this.opacityContainer }}>
            <Animated.View style={{ width: width, transform: this.moveHome.getTranslateTransform() }}>
              <Carousel
                ref={c => this._pages = c }
                data={this.getPages()}
                activeAnimationType="decay"
                renderItem={this.getPage}
                firstItem={1}
                keyboardShouldPersistTaps="handled"
                scrollEnabled={this.props.isScrollEnabled}
                sliderHeight={height}
                itemHeight={height}
                sliderWidth={width}
                itemWidth={width}
                onBeforeSnapToItem={this.props.setPage}
              />
              <Animated.View style={{ position: 'absolute', width: width, bottom: -30, transform: this.movePagination.getTranslateTransform() }}>
                <Pagination
                  dotsLength={3}
                  activeDotIndex={this.props.page}
                  containerStyle={{ paddingVertical: 20 }}
                  carouselRef={this._pages}
                  tappableDots={!!this._pages}
                  dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    marginHorizontal: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.92)'
                  }}
                  inactiveDotOpacity={0.4}
                  inactiveDotScale={0.6}
                />
              </Animated.View>
            </Animated.View>
            <Animated.View style={{ ...styles.wizard, transform: this.moveWizard.getTranslateTransform() }}>
              <Wizard />
            </Animated.View>
          </Animated.View>
        </SafeAreaView>}
      </View>)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#323a45',
    alignItems: 'center',
    justifyContent: 'center'
  },
  wizard: {
    position: 'absolute',
    height: '100%',
    width: width
  }
})

const mapStateToProps = (state) => ({
  step: state.Game.step,
  page: state.States.page,
  isLoaded: state.States.isLoaded,
  isInGame: state.States.isInGame,
  isInMenu: state.States.isInMenu,
  isInHistory: state.States.isInHistory,
  isInThanks: state.States.isInThanks,
  isFullScreen: state.States.isFullScreen,
  isScrollEnabled: state.States.isScrollEnabled,
  enableHistory: state.Settings.enableHistory,
  layout: state.Settings.layout
})

const mapDispatchToProps = {
  setPage: Actions.setPage,
  setIsLoaded: Actions.setIsLoaded,
  setIsInGame: Actions.setIsInGame,
  setGameStep: Actions.setGameStep,
  setGameStarted: Actions.setGameStarted,
  setGameDescribed: Actions.setGameDescribed,
  setEnableHistory: Actions.setEnableHistory,
  setIsInThanks: Actions.setIsInThanks,
  setIsInMenu: Actions.setIsInMenu,
  setHistory: Actions.setHistory,
  setLayout: Actions.setLayout
}

export default connect(mapStateToProps, mapDispatchToProps)(Root)