import * as React from 'react';

import { View,Text,StyleSheet,} from 'react-native';
import db from '../config'
import firebase from 'firebase'
import {ListItem} from 'react-native-elements'
import {Header,Icon,Badge} from 'react-native-elements'
import {SwipeListView} from 'react-native-swipe-list-view'
import { Dimensions } from 'react-native';
export default class SwipeableFlatlist extends React.Component{

constructor(props){
    super(props)
    this.state = {
        allNotifications:this.props.allNotifications
    }
}

updateMarkAsRead = (notification)=>{
    db.collection('allNotifications').doc(notification.docID).update({
        'notificationStatus':"Read"
    })
}

onSwipeValueChange = swipeData =>{
    var allNotifications = this.state.allNotifications
    const {key,value} = swipeData
    if(value <-Dimensions.get('window').width){
        const newData = [...allNotifications]
        // const prevIndex = allNotifications.findIndex(item =>item.key === key)
        this.updateMarkAsRead(allNotifications[key])
        newData.splice(key,1)
        this.setState({
            allNotifications:newData
        })
    }
}

renderItem = data=>(

        <ListItem 
         bottomDivider> 
            <ListItem.Content> 
                <ListItem.Title style = {{ color: 'black', fontWeight: 'bold' }}>{data.item.bookName} </ListItem.Title> 
                <ListItem.Subtitle>{data.item.message}</ListItem.Subtitle> 
            </ListItem.Content> 
             
        </ListItem>

)

renderHiddenItem = ()=>(
    <View
        style = {styles.rowBack}>
        <View
        style = {[styles.backRightButton,styles.backRightButtonRight]}>
            <Text
            style = {styles.backTextWhite}>
                Mark As Read      
            </Text>
        </View>
    </View>
)
render(){
    return(
        <View
            style = {styles.container}>
            <SwipeListView
                disableRightSwipe
                data = {this.state.allNotifications}
                rightOpenValue = {-Dimensions.get('window').width}
                renderItem = {this.renderItem}
                renderHiddenItem = {this.renderHiddenItem}
                previewRowKey = {'0'}
                previewOpenValue = {-40}
                previewOpenDelay = {3000}
                onSwipeValueChange = {this.onSwipeValueChange}
                keyExtractor = {(item,index)=>index.toString()}/>
        </View>
    )
}
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: "white", 
        flex: 1 
    },
    backTextWhite: {
        color: "#FFF", 
        fontWeight: "bold", 
        fontSize: 15, 
        textAlign: "center", 
        alignSelf: "flex-start"
    },
    rowBack: {
        alignItems: "center",
        backgroundColor: "#29b6f6", 
        flex: 1, 
        flexDirection: "row", 
        justifyContent: "space-between", 
        paddingLeft: 15 
    },
    backRightButton: {
        alignItems: "center", 
        bottom: 0, 
        justifyContent: "center", 
        position: "absolute", 
        top: 0, 
        width: 100 
    }, 
    backRightButtonRight: { 
        backgroundColor: "#29b6f6", 
        right: 0 
    }, 
});