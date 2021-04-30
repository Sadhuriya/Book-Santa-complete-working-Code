import * as React from 'react';

import { View,Text,StyleSheet,TouchableOpacity,TextInput,Image,FlatList} from 'react-native';
import {ListItem} from 'react-native-elements';
import MyHeader from '../components/MyHeader'
import SwipeableFlatlist from '../components/SwipeableFlatlist'
import{Card} from 'react-native-elements'
import db from '../config'
import firebase from 'firebase'

export default class MyNotificationsScreen extends React.Component{
    constructor(){
        super()
        this.state = {
            userID:firebase.auth().currentUser.email,
            allNotifications:[],
            donorName:'',
        }
        this.notificationRef = null;
    }
    
    getAllNotifications = ()=>{
        this.notificationRef = db.collection("allNotifications").where('notificationStatus','==',"Unread")
        .where('targetedUserID','==',this.state.userID)
        .onSnapshot((snapshot)=>{
            var allNotifications = []
            snapshot.docs.map((doc)=>{
                var notifications = doc.data()
                notifications["docID"] = doc.id
                allNotifications.push(notifications)
            })
            this.setState({
                allNotifications:allNotifications
            })
        })
    }

    componentDidMount(){
        this.getAllNotifications()
    }

    componentWillUnmount(){
        this.notificationRef()
    }

    keyExtractor = (item,index)=>index.toString()
    renderItem = ({item,i})=>{
        return(
            <ListItem 
            key={i} bottomDivider> 
                <ListItem.Content> 
                    <ListItem.Title style = {{ color: 'black', fontWeight: 'bold' }}>{item.bookName} </ListItem.Title> 
                    <ListItem.Subtitle>{item.message}</ListItem.Subtitle> 
                </ListItem.Content> 
            </ListItem>

        )
    }

    render(){
        console.log(this.state.allNotifications)
        return(
            <View
            style = {{flex:1}}>
                <MyHeader 
                    title = "My Notifications"
                    navigation = {this.props.navigation}/>
                <View
                style = {{flex:1}}>
                    {
                        this.state.allNotifications.length === 0 ? (
                            <View 
                            style = {styles.container}>
                                <Text
                                style = {{fontSize:15}}>
                                    You Have No Notifications
                                </Text>
                            </View>
                        )
                        :(
                            <SwipeableFlatlist allNotifications = {this.state.allNotifications}/>
                        )
                    }
                </View>     
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        marginTop:20,
        
       },
})     
