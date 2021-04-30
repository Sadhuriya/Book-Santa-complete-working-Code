import * as React from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer'
import {AppTabNavigator} from './AppTabNavigator'
import SettingScreen from '../Screens/SettingScreen'
import MyDonationsScreen from '../Screens/MyDonations'
import MyReceivedBookScreen from '../Screens/MyReceivedBookSCreen'
import SideBarMenu from './SideBarMenu'
import MyNotificationsScreen from '../Screens/notificationsScreen'

export const AppDrawerNavigator = createDrawerNavigator({
    Home: {
        screen:AppTabNavigator
    },
    MyDonations: {
        screen:MyDonationsScreen
    },
    MyReceivedBooks: {
        screen:MyReceivedBookScreen
    },
    Notifications:{
        screen:MyNotificationsScreen
    },
    Setting: {
        screen:SettingScreen
    },
},
    {
        contentComponent:SideBarMenu
    },
    {
        initialRouteName: 'Home'
        
    }
)