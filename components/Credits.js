import React from 'react'
import { connect } from 'react-redux'

import {
  View,
  Text,
  StyleSheet,
  Linking,
  ScrollView
} from 'react-native'

import Svg, { G, Path } from 'react-native-svg'

import GlobalStyles from '../resources/styles'

class Credits extends React.Component {
  constructor(props) {
    super(props)
  }

  onClickLink(url) {
    Linking.canOpenURL(url).then(supported => {
      if(supported){
        Linking.openURL(url)
      }
    })
  }

  render() {
    return (
      <View style={{ ...GlobalStyles.flex, paddingTop: 5 }}>
        <View style={{ ...GlobalStyles.header, ...GlobalStyles.padded, paddingBottom: 18 }}>
          <Text style={GlobalStyles.h1}>Legal Information</Text>
        </View>
        <ScrollView style={{ ...GlobalStyles.padded, ...styles.content }}>
          <View style={styles.section}>
            <View>
              <Text style={styles.sectionTitle}>Credits</Text>
              <Text style={styles.label}>Programming</Text>
              <Text style={styles.text}>Eric Hainer</Text>
              <Text style={styles.label}>Design & Logo</Text>
              <Text style={styles.text}>Tannen Helmers</Text>
            </View>
          </View>
          <View style={styles.section}>
            <View>
              <Text style={styles.sectionTitle}>Assets</Text>
            </View>
            <View style={{ ...GlobalStyles.row, ...styles.iconRow }}>
              <View style={styles.icon}>
                <Svg height={30} width={30} viewBox="0 0 512 512">
                  <G>
                    <G>
                      <G>
                        <Path fill="white" strokeWidth="8" d="M448,309.333c-20.827,0-64,11.598-85.885,17.885c-2.904-30.609-42.125-41.444-82.656-49.677
                          c-18.5-3.75-32.271-10.385-45.583-16.813c-16.417-7.917-31.917-15.396-52.542-15.396c-23.618,0-45.142,4.831-57.288,8.173
                          c-3.211-11.172-12.32-20.177-24.421-22.59L12.75,213.542c-3.104-0.625-6.375,0.188-8.854,2.208C1.438,217.781,0,220.802,0,224
                          v170.667c0,5.896,4.771,10.667,10.667,10.667H77.5c13.172,0,24.397-8.379,29.223-20.142C130.625,396.586,241.081,448,288,448
                          c41.375,0,126.563-41.875,182.917-69.583c14.688-7.219,26.833-13.198,34.708-16.646C509.5,360.063,512,356.229,512,352
                          C512,326.875,485.688,309.333,448,309.333z M103.917,263.802L88.063,374.844C87.313,380.063,82.771,384,77.5,384H21.333V237.01
                          l74.125,14.823C101,252.948,104.729,258.198,103.917,263.802z M461.5,359.271c-51.271,25.208-137.083,67.396-173.5,67.396
                          c-38.792,0-140.688-45.427-176.667-62.927c-0.04-0.02-0.085-0.013-0.125-0.031l12.551-87.904
                          c7.772-2.431,31.518-9.138,57.574-9.138c15.75,0,27.896,5.865,43.292,13.281c13.813,6.667,29.479,14.219,50.583,18.51
                          c46.354,9.396,66.125,19.031,66.125,32.208c0,2.604-0.792,4.208-2.813,5.719c-6.771,5.073-33.271,13.594-132.813-15.948
                          c-5.688-1.646-11.583,1.552-13.271,7.198c-1.667,5.646,1.542,11.583,7.188,13.26c49.146,14.563,86.708,21.823,113.333,21.823
                          c17.354,0,30.083-3.083,38.313-9.24c0.708-0.529,1.227-1.176,1.871-1.745c0.671-0.074,1.331,0.004,2.004-0.203
                          C374,345.729,427.438,330.667,448,330.667c17.396,0,35.708,5.281,41.083,15.208C481.646,349.375,472.25,354,461.5,359.271z"/>
                        <Path fill="white" strokeWidth="8" d="M333.833,252.906c2.063,2.063,4.792,3.094,7.5,3.094c2.708,0,5.438-1.031,7.5-3.094l80.417-79.656
                          C441.333,161.156,448,145.094,448,128c0-35.292-28.708-64-64-64c-16,0-31.021,5.896-42.667,16.479
                          C329.688,69.896,314.667,64,298.667,64c-35.292,0-64,28.708-64,64c0,17.094,6.666,33.156,18.792,45.281L333.833,252.906z
                          M298.667,85.333c13.479,0,25.896,6.313,34.104,17.333c4.042,5.396,13.083,5.396,17.125,0
                          c8.208-11.021,20.625-17.333,34.104-17.333c23.521,0,42.667,19.135,42.667,42.667c0,11.396-4.438,22.104-12.458,30.135
                          l-72.875,72.188L268.5,158.167C260.438,150.104,256,139.396,256,128C256,104.469,275.146,85.333,298.667,85.333z"/>
                      </G>
                    </G>
                  </G>
                </Svg>
              </View>
              <View style={styles.attribution}>
                <Text style={styles.text}>Icon made by <Text style={styles.link} onPress={() => this.onClickLink('https://www.flaticon.com/authors/those-icons')}>Those Icons</Text> from <Text style={styles.link} onPress={() => this.onClickLink('https://www.flaticon.com')}>Flat Icon</Text></Text>
              </View>
            </View>

            <View style={{ ...GlobalStyles.row, ...styles.iconRow }}>
              <View style={styles.icon}>
                <Svg height={30} width={30} viewBox="0 0 512 512">
                  <G>
                    <G>
                      <Path fill="white" strokeWidth="8" d="M426.667,85.333c-7.76,0-15.052,2.083-21.333,5.729V64c0-23.531-19.135-42.667-42.667-42.667
                        c-8.781,0-16.938,2.667-23.729,7.219C333.094,11.948,317.25,0,298.667,0c-18.583,0-34.427,11.948-40.271,28.552
                        c-6.792-4.552-14.948-7.219-23.729-7.219C211.135,21.333,192,40.469,192,64v264.146c0,5.375-3.542,8.135-5.063,9.073
                        s-5.615,2.865-10.375,0.469l-68.5-34.25c-6.24-3.125-13.229-4.771-20.208-4.771c-24.917,0-45.187,20.271-45.187,45.188V352
                        c0,2.958,1.229,5.781,3.385,7.802l123.115,114.906C194.937,498.75,228.542,512,263.781,512h66.885
                        c76.458,0,138.667-62.208,138.667-138.667V128C469.333,104.469,450.198,85.333,426.667,85.333z M448,373.333
                        c0,64.698-52.635,117.333-117.333,117.333h-66.885c-29.813,0-58.25-11.208-80.052-31.563L64,347.365v-3.51
                        C64,330.698,74.698,320,87.854,320c3.677,0,7.375,0.875,10.667,2.521l68.5,34.25c9.969,5.01,21.635,4.458,31.135-1.396
                        c9.5-5.875,15.177-16.052,15.177-27.229V64c0-11.76,9.573-21.333,21.333-21.333C246.427,42.667,256,52.24,256,64v138.667
                        c0,5.896,4.771,10.667,10.667,10.667c5.896,0,10.667-4.771,10.667-10.667v-160c0-11.76,9.573-21.333,21.333-21.333
                        c11.76,0,21.333,9.573,21.333,21.333v160c0,5.896,4.771,10.667,10.667,10.667c5.896,0,10.667-4.771,10.667-10.667V64
                        c0-11.76,9.573-21.333,21.333-21.333S384,52.24,384,64v170.667c0,4.042,2.323,7.75,5.938,9.563c0.01,0,0.021,0.01,0.042,0.021
                        s0.042,0.021,0.063,0.031c0.052,0.021,0.104,0.042,0.146,0.073c0.021,0,0.021,0.021,0.042,0.01l0.01,0.01
                        c0.01,0,0.021,0.01,0.021,0.01c0.021,0.01,0.021,0.01,0.042,0.01c0.01,0.021,0.021,0.021,0.031,0.021l0.031,0.01
                        c0.01,0,0.01,0.021,0.042,0.021c0.021,0.042,0.042,0.01,0.042,0.01c5.135,2.25,11.24,0.094,13.802-5
                        c0.917-1.844,1.26-3.823,1.083-5.729V128c0-11.76,9.573-21.333,21.333-21.333S448,116.24,448,128V373.333z"/>
                    </G>
                  </G>
                </Svg>
              </View>
              <View style={styles.attribution}>
              <Text style={styles.text}>Icon made by <Text style={styles.link} onPress={() => this.onClickLink('https://www.flaticon.com/authors/those-icons')}>Those Icons</Text> from <Text style={styles.link} onPress={() => this.onClickLink('https://www.flaticon.com')}>Flat Icon</Text></Text>
              </View>
            </View>

            <View style={{ ...GlobalStyles.row, ...styles.iconRow }}>
              <View style={styles.icon}>
                <Svg width={20} height={30} viewBox="0 0 26 26">
                  <Path fill="white" d="m.3,14c-0.2-0.2-0.3-0.5-0.3-0.7s0.1-0.5 0.3-0.7l1.4-1.4c0.4-0.4 1-0.4 1.4,0l.1,.1 5.5,5.9c0.2,0.2 0.5,0.2 0.7,0l13.4-13.9h0.1v-8.88178e-16c0.4-0.4 1-0.4 1.4,0l1.4,1.4c0.4,0.4 0.4,1 0,1.4l0,0-16,16.6c-0.2,0.2-0.4,0.3-0.7,0.3-0.3,0-0.5-0.1-0.7-0.3l-7.8-8.4-.2-.3z"/>
                </Svg>
              </View>
              <View style={styles.attribution}>
              <Text style={styles.text}>Icon made by <Text style={styles.link} onPress={() => this.onClickLink('https://www.flaticon.com/authors/eleonor-wang')}>Eleonor Wang</Text> from <Text style={styles.link} onPress={() => this.onClickLink('https://www.flaticon.com')}>Flat Icon</Text></Text>
              </View>
            </View>

            <View style={{ ...GlobalStyles.row, ...styles.iconRow, marginBottom: 0 }}>
              <View style={styles.icon}>
                <Svg height={20} width={30} viewBox="0 0 451.847 451.847">
                  <G>
                    <Path fill="white" d="M345.441,248.292L151.154,442.573c-12.359,12.365-32.397,12.365-44.75,0c-12.354-12.354-12.354-32.391,0-44.744
                                          L278.318,225.92L106.409,54.017c-12.354-12.359-12.354-32.394,0-44.748c12.354-12.359,32.391-12.359,44.75,0l194.287,194.284
                                          c6.177,6.18,9.262,14.271,9.262,22.366C354.708,234.018,351.617,242.115,345.441,248.292z" />
                  </G>
                </Svg>
              </View>
              <View style={styles.attribution}>
              <Text style={styles.text}>Icon made by <Text style={styles.link} onPress={() => this.onClickLink('https://www.freepik.com/')}>Freepik</Text></Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View>
              <Text style={styles.sectionTitle}>Third-party Software</Text>
              <Text style={{ ...GlobalStyles.caption, ...styles.sectionCaption }}>Awesome libraries without which would have made this app impossible. Or at least really, really difficult.</Text>
              <Text style={styles.library} onPress={() => this.onClickLink('https://date-fns.org')}>date-fns</Text>
              <Text style={styles.library} onPress={() => this.onClickLink('https://github.com/bartgryszko/react-native-circular-progress')}>react-native-circular-progress</Text>
              <Text style={styles.library} onPress={() => this.onClickLink('https://github.com/archriss/react-native-snap-carousel')}>react-native-snap-carousel</Text>
            </View>
          </View>

          <View style={styles.section}>
            <View>
              <Text style={styles.sectionTitle}>Source</Text>
              <Text style={{ ...GlobalStyles.caption, ...styles.sectionCaption }}>Feel free to fork, modify, criticize (constructively), or improve upon. Just keep it free.</Text>
              <Text style={styles.library} onPress={() => this.onClickLink('https://github.com/ehainer/dime-game')}>View on GitHub</Text>
            </View>
          </View>
        </ScrollView>
      </View>)
  }
}

const styles = StyleSheet.create({
  content: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)'
  },
  iconRow: {
    marginTop: 5,
    marginBottom: 15,
    alignItems: 'center'
  },
  icon: {
    flex: -1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 30
  },
  attribution: {
    flex: 1,
    paddingLeft: 10
  },
  link: {
    color: 'lightseagreen'
  },
  label: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'palanquin',
  },
  text: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'open-sans'
  },
  library: {
    color: 'lightseagreen',
    fontSize: 15,
    marginBottom: 5,
    fontFamily: 'open-sans'
  },
  section: {
    marginTop: 10,
    marginBottom: 15
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'palanquin'
  },
  sectionCaption: {
    marginBottom: 10
  }
})

const mapStateToProps = (state) => ({
})

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(Credits)
