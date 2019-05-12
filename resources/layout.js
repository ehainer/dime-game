import { Dimensions, StatusBar, PixelRatio } from 'react-native'
const { width, height } = Dimensions.get('window')

export default {
  width: width,
  height: height,
  space: StatusBar.currentHeight || 0,
  ratio: PixelRatio.get(),
  maxWidth: 550,
  defaultWidth: 450
}