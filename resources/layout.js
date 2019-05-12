import { Dimensions, StatusBar, PixelRatio } from 'react-native'
const { width, height } = Dimensions.get('window')

export default {
  width: width,
  height: height,
  space: StatusBar.currentHeight || 0,
  ratio: PixelRatio.get(),
  minWidth: Math.min(450, Math.min(550, width - 40)),
  maxWidth: Math.min(550, width - 40)
}