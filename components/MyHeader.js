import * as React from 'react';

import { View,Text,StyleSheet,} from 'react-native';
import db from '../config'
import firebase from 'firebase'

import {Header,Icon,Badge} from 'react-native-elements'
export default class MyHeader extends React.Component{
   constructor(props){
      super(props)
      this.state={
         value:"",
      }
   }

   getNumberOfUnreadNotifications(){
      db.collection('allNotifications').where('notificationStatus','==',"Unread")
      .onSnapshot((snapshot)=>{
         var unreadNotifications = snapshot.docs.map((doc)=>doc.data())
         this.setState({
            value: unreadNotifications.length
         })
      })
   }

   componentDidMount(){
      this.getNumberOfUnreadNotifications()
   }
BellIconWithBadge = ()=>{
   return(
      <View>
         <Icon
            name = "bell"
            type = 'font-awesome'
            color = "gold"
            size = {25}
            onPress ={()=>{
               this.props.navigation.navigate('Notifications')
            }}/>
         <Badge
            value = {this.state.value}
            containerStyle = {{position:'absolute',top:-4,right:-4}}/>
      </View>
   )
}
render(){
   return(
      <Header 
         leftComponent = {
            <Icon
               name = "bars"
               type = 'font-awesome'
               color = "gold"
               onPress = {()=>{
                 this.props.navigation.toggleDrawer()
               }}/>
         }
         centerComponent = {{
             text:this.props.title,
             style:{color:"gold",
                     fontSize:25,
                     fontWeight:"bold"
                    }  
         }}
         rightComponent = {
            <this.BellIconWithBadge
               {...this.props}/>
         }
         backgroundColor = "grey"/> 
   )
}
}

