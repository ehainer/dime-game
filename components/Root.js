import React from 'react'

import { Font, SplashScreen } from 'expo'

import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
  BackHandler,
  AsyncStorage,
  Easing,
  SafeAreaView,
  Platform,
  PixelRatio
} from 'react-native'

import Carousel, { Pagination } from 'react-native-snap-carousel'

import { connect } from 'react-redux'

import Dot from './Dot'
import Menu from './Menu'
import About from './About'
import Wizard from './Wizard'
import History from './History'

import Actions from '../redux/actions'

const { width, height } = Dimensions.get('window')

import GlobalStyles from '../resources/styles'
import Layout from '../resources/layout'

class Root extends React.Component {
  constructor(props) {
    super(props)

    SplashScreen.preventAutoHide()

    this.state = {
      layout: null
    }
    
    this.topSpace = StatusBar.currentHeight
    this.opacityContainer = new Animated.Value(0)
    this.moveHome = new Animated.ValueXY({ x: 0, y: 0 })
    this.moveWizard = new Animated.ValueXY({ x: width, y: 0 })
    this.movePagination = new Animated.ValueXY({ x: 0, y: 0 })

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
      if(this.props.step >= 0 && this.props.isInGame){
        if(this.props.step === 0){
          this.props.resetGame()
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
        toValue: { x: 0, y: this.props.isFullScreen ? PixelRatio.getPixelSizeForLayoutSize(80) : 0 },
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
        {this.props.isLoaded && 
        <SafeAreaView>
          <Animated.View style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 0 : (StatusBar.currentHeight || 0), opacity: this.opacityContainer }}>
            <Animated.View style={{ flex: 1, transform: this.moveHome.getTranslateTransform() }} onLayout={(e) => this.setState({ layout: e.nativeEvent.layout })}>
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
                activeAnimationType="decay"
                onBeforeSnapToItem={this.props.setPage}
                slideInterpolatedStyle={() => {}}
              />
              <Animated.View style={{ position: 'absolute', bottom: 0, width: Layout.width, transform: this.movePagination.getTranslateTransform() }} onLayout={this.props.setLayout}>
                <Pagination
                  dotsLength={3}
                  activeDotIndex={this.props.page}
                  containerStyle={{ paddingVertical: PixelRatio.getPixelSizeForLayoutSize(5) }}
                  carouselRef={this._pages}
                  tappableDots={!!this._pages}
                  renderDots={(activeIndex) => {
                    return ['menu', 'about', 'history'].map((q, idx) => {
                      return (<Dot key={idx} active={activeIndex === idx} enabled={true} onPress={() => this._pages.snapToItem(this._pages._getPositionIndex(idx))} />)
                    })
                  }}
                />
              </Animated.View>
            </Animated.View>
            {this.state.layout && <Animated.View style={{ flex: 1, position: 'absolute', width: Layout.width, height: this.state.layout.height, marginTop: Platform.OS === 'ios' ? 0 : (StatusBar.currentHeight || 0), transform: this.moveWizard.getTranslateTransform() }}>
              <Wizard />
            </Animated.View>}
          </Animated.View>
        </SafeAreaView>}
      </View>)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#234051'
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
  resetGame: Actions.resetGame,
  setIsLoaded: Actions.setIsLoaded,
  setGameStep: Actions.setGameStep,
  setEnableHistory: Actions.setEnableHistory,
  setIsInThanks: Actions.setIsInThanks,
  setIsInMenu: Actions.setIsInMenu,
  setHistory: Actions.setHistory,
  setLayout: Actions.setLayout
}

export default connect(mapStateToProps, mapDispatchToProps)(Root)