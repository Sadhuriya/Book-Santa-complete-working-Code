import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {createAppContainer,createSwitchNavigator} from 'react-navigation'
import WelcomeScreen from './Screens/WelcomeScreen'
import {AppTabNavigator} from './components/AppTabNavigator'
import {SafeAreaProvider} from 'react-native-safe-area-context'
import {AppDrawerNavigator} from './components/AppDrawerNavigator'

export default class App extends React.Component {
  render(){
    return (
      <SafeAreaProvider>
      
        <AppContainer />
      
      </SafeAreaProvider>
    );
  }
}

const switchNavigator = createSwitchNavigator({
  WelcomeScreen:{screen:WelcomeScreen},
  Drawer: {screen:AppDrawerNavigator},
  
})

const AppContainer = createAppContainer(switchNavigator)


