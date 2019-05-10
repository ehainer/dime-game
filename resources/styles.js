import { StyleSheet } from 'react-native'

module.exports = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 0
  },
  header: {
    flex: -1,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 10
  },
  h1: {
    color: 'white',
    fontSize: 30,
    lineHeight: 40,
    fontFamily: 'palanquin'
  },
  h2: {
    color: '#d3d3d3',
    fontSize: 16,
    lineHeight: 16,
    fontFamily: 'open-sans'
  },
  text: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'open-sans'
  },
  caption: {
    color: '#d3d3d3',
    fontSize: 14,
    fontFamily: 'open-sans'
  },
  dot: {
    color: '#d3d3d3',
    width: 10,
    fontSize: 15,
    fontFamily: 'open-sans',
    textAlign: 'center'
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  spacer: {
    width: 10
  },
  row: {
    flexDirection: 'row'
  }
})