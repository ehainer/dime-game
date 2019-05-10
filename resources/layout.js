import { StyleSheet, Dimensions, StatusBar, Platform } from 'react-native'
const { width, height } = Dimensions.get('window')

export default {
  width: width,
  height: height,
  space: StatusBar.currentHeight || 0
}